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
            # Models paths are handled internally by the class now, but we can pass them
            model_path = 'models/respira_net_v1.pt'
            scaler_path = 'models/scaler.pkl'
            inference_engine = RespiraNetInference(model_path=model_path, scaler_path=scaler_path)
            print("[OK] ML Inference Engine initialized")
        except Exception as e:
            print(f"[ERROR] Critical failure initializing ML engine: {e}")
            import traceback
            traceback.print_exc()
            # Still set to None so we try again or handle as null
            inference_engine = None
    return inference_engine

# Pre-initialize at module load
try:
    get_inference_engine()
except:
    pass

@router.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    """Analyze respiratory audio file for risk assessment"""
    
    # Validate file type
    if not file.filename.endswith(('.wav', '.mp3', '.m4a', '.ogg')):
        raise HTTPException(status_code=400, detail="Only audio files (.wav, .mp3, .m4a, .ogg) are supported")
    
    # Get inference engine (should be initialized already)
    engine = get_inference_engine()
    if engine is None:
        # If engine is STILL None, we have a code import issue, but we handles this gracefully
        return {
            "error": "Analysis system initializing or unavailable",
            "risk_level": "SYSTEM UNAVAILABLE",
            "confidence": 0,
            "recommendation": "System is currently unable to process audio. Please try again in a few moments.",
            "color": "gray"
        }
    
    # Save uploaded file temporarily
    import tempfile
    import os
    
    tmp_path = None
    try:
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Process audio
        result = engine.process_audio(tmp_path)
        
        # Check if internal error occurred in pipeline
        if "error" in result:
             return {
                "error": result["error"],
                "risk_level": "ERROR",
                "confidence": 0,
                "recommendation": "The audio quality was insufficient for analysis. Please record in a quieter environment.",
                "color": "gray",
                "processing_time_ms": result.get("processing_time_ms", 0)
            }
            
        return result
        
    except Exception as e:
        print(f"[ERROR] Analysis endpoint crash: {e}")
        return {
            "error": str(e),
            "risk_level": "ERROR",
            "confidence": 0,
            "recommendation": "An unexpected error occurred during processing. Please try again.",
            "color": "gray"
        }
    finally:
        # Clean up temp file
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except:
                pass

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
