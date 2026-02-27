from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import sys
import os
import httpx
sys.path.append(os.path.join(os.path.dirname(__file__), '../../ml'))

# Pydantic models for request validation
class AnalysisData(BaseModel):
    risk_level: str
    confidence: float
    explanation: str

class AirQualityData(BaseModel):
    location: str
    city: str
    value: float
    unit: str

class ReportRequest(BaseModel):
    analysis: AnalysisData
    air_quality: AirQualityData

router = APIRouter()

# Initialize ML inference engine
inference_engine = None

# Cache for air quality data (per location)
air_quality_cache = {}
CACHE_DURATION = 300  # 5 minutes in seconds

def get_inference_engine():
    global inference_engine
    if inference_engine is None:
        try:
            from inference_pipeline import UrbanVoiceInference
            # Models paths are handled internally by the class now, but we can pass them
            model_path = 'models/respira_net_v1.pt'
            scaler_path = 'models/scaler.pkl'
            inference_engine = UrbanVoiceInference(model_path=model_path, scaler_path=scaler_path)
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
    """Analyze urban acoustic audio file for health sentinel mapping"""
    
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
        "layer": "Sentinel Neural Infrastructure Layer"
    }

@router.get("/air-quality")
async def get_air_quality(location_id: int = 5574):
    """Proxy endpoint for OpenAQ API to avoid CORS issues - with caching"""
    import time
    
    # Check cache first
    cache_key = f"location_{location_id}"
    if cache_key in air_quality_cache and air_quality_cache[cache_key]["timestamp"]:
        if time.time() - air_quality_cache[cache_key]["timestamp"] < CACHE_DURATION:
            return air_quality_cache[cache_key]["data"]
    
    api_key = "5c252cf69847cc858100854d6ab3eecb1681f6aebef74ad115aadf7dc51678ab"
    latest_url = f"https://api.openaq.org/v3/locations/{location_id}/latest"
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            latest_response = await client.get(latest_url, headers={"X-API-Key": api_key})
            latest_response.raise_for_status()
            latest_data = latest_response.json()
            
            # Cache and return the data
            if cache_key not in air_quality_cache:
                air_quality_cache[cache_key] = {}
            air_quality_cache[cache_key]["data"] = latest_data
            air_quality_cache[cache_key]["timestamp"] = time.time()
            return latest_data
            
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            # Return cached data if available, even if expired
            if cache_key in air_quality_cache and air_quality_cache[cache_key].get("data"):
                return air_quality_cache[cache_key]["data"]
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again in a moment.")
        raise HTTPException(status_code=e.response.status_code, detail=f"OpenAQ API error: {str(e)}")
    except Exception as e:
        # Return cached data if available on any error
        if cache_key in air_quality_cache and air_quality_cache[cache_key].get("data"):
            return air_quality_cache[cache_key]["data"]
        raise HTTPException(status_code=500, detail=f"Failed to fetch air quality data: {str(e)}")


@router.post("/generate-report")
async def generate_personalized_report(request: ReportRequest):
    """Generate personalized health report using Gemini AI"""
    gemini_api_key = "AIzaSyDpuiBztF-uYwHS5wJCdoXyNI8AS8nrkkM"
    
    # Construct prompt for Gemini
    prompt = f"""You are the UrbanVoice Sentinel health advisor. Generate a personalized, authoritative health synthesis based on the following acoustic and environmental data:

RESPIRATORY ANALYSIS:
- Risk Level: {request.analysis.risk_level}
- Confidence: {request.analysis.confidence}%
- Analysis: {request.analysis.explanation}

AIR QUALITY DATA:
- Location: {request.air_quality.location}, {request.air_quality.city}
- Air Quality: {request.air_quality.value} {request.air_quality.unit}

Please provide:
1. A brief summary combining both acoustic health signatures and urban environmental factors
2. How the local air quality and urban acoustics might impact respiratory well-being
3. Personalized recommendations considering both factors
4. Preventive measures specific to this location

Keep the report concise (200-250 words), professional, and actionable. Use a warm, supportive tone."""

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
                headers={
                    "x-goog-api-key": gemini_api_key,
                    "Content-Type": "application/json"
                },
                json={
                    "contents": [{
                        "parts": [{
                            "text": prompt
                        }]
                    }]
                }
            )
            response.raise_for_status()
            data = response.json()
            
            # Extract generated text from Gemini response
            if data.get('candidates') and len(data['candidates']) > 0:
                report_text = data['candidates'][0]['content']['parts'][0]['text']
                return {"report": report_text}
            else:
                raise HTTPException(status_code=500, detail="No response from Gemini AI")
                
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Gemini API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")


class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """Chat endpoint for user queries about respiratory health"""
    gemini_api_key = "AIzaSyDpuiBztF-uYwHS5wJCdoXyNI8AS8nrkkM"
    
    # System context for the chatbot
    system_context = """You are a helpful AI assistant for UrbanVoice Sentinel, an urban acoustic health monitoring platform. 
You help users understand:
- Acoustic health signatures and common respiratory conditions
- How our sentinel AI-powered acoustic analysis works
- Urban air quality and its impact on community health
- When to seek medical attention or individual assessment
- How to use the UrbanVoice Sentinel platform

Keep responses concise (2-3 sentences), friendly, and informative. Always remind users that this is for screening purposes only and not a replacement for professional medical advice."""

    prompt = f"{system_context}\n\nUser question: {request.message}\n\nResponse:"
    
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
                headers={
                    "x-goog-api-key": gemini_api_key,
                    "Content-Type": "application/json"
                },
                json={
                    "contents": [{
                        "parts": [{
                            "text": prompt
                        }]
                    }]
                }
            )
            response.raise_for_status()
            data = response.json()
            
            if data.get('candidates') and len(data['candidates']) > 0:
                response_text = data['candidates'][0]['content']['parts'][0]['text']
                return {"response": response_text}
            else:
                raise HTTPException(status_code=500, detail="No response from AI")
                
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"AI API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get response: {str(e)}")
