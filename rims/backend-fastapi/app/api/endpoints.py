from fastapi import APIRouter, UploadFile, File, HTTPException
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../ml'))

router = APIRouter()

# Initialize ML inference engine
inference_engine = None

def get_inference_engine():
    global inference_engine
    if inference_engine is None:
        try:
            from inference_pipeline import RespiraNetInference
            # Models are in root models/ folder
            model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../models/respira_net_v1.pt'))
            scaler_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../models/scaler.pkl'))
            inference_engine = RespiraNetInference(model_path=model_path, scaler_path=scaler_path)
            print("✅ ML Model loaded successfully")
        except Exception as e:
            print(f"❌ Failed to load ML model: {e}")
            import traceback
            traceback.print_exc()
            inference_engine = None
    return inference_engine

@router.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    """Analyze respiratory audio file for risk assessment"""
    
    # Validate file type
    if not file.filename.endswith(('.wav', '.mp3', '.m4a', '.ogg')):
        raise HTTPException(status_code=400, detail="Only audio files (.wav, .mp3, .m4a, .ogg) are supported")
    
    # Get inference engine
    engine = get_inference_engine()
    if engine is None:
        raise HTTPException(status_code=500, detail="ML model not available")
    
    # Save uploaded file temporarily
    import tempfile
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        # Process audio
        result = engine.process_audio(tmp_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.get("/data")
async def get_data():
    return {
        "source": "Sentinel Neural Node #084",
        "region": "NYC-METRO",
        "metrics": {
            "air_quality": "94 (Optimal)",
            "bio_pulse": "Normal",
            "traffic_density": "Low",
            "infrastructure_load": "22%"
        },
        "items": ["Decentralized-Node", "FastAPI-Engine", "Neural-Processing", "Secure-Mux"],
        "status": "system_nominal",
        "layer": "Neural Infrastructure Layer"
    }
