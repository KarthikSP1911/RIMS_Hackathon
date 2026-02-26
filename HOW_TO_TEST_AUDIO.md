# 🎤 How to Test RespiraScan with Real Audio

## ✅ Setup Complete
- ML Model: Trained and ready
- Backend: FastAPI with `/analyze` endpoint
- Frontend: Upload interface ready

## 📝 Steps to Test

### 1. Start All Services

```bash
# Terminal 1 - Frontend (React)
cd rims/frontend
npm run dev
# Opens at http://localhost:5173

# Terminal 2 - Backend (FastAPI)
cd rims/backend-fastapi
python -m uvicorn app.main:app --reload --port 8000
# Runs at http://localhost:8000
```

### 2. Prepare Audio File

**Supported Formats:**
- .wav (recommended)
- .mp3
- .m4a
- .ogg

**Best Quality:**
- 16kHz sample rate
- Mono channel
- 3-10 seconds duration
- Clear breathing sounds

**How to Record:**
- Use your phone's voice recorder
- Record yourself breathing normally for 5-10 seconds
- Save as .wav or .mp3
- Transfer to your computer

### 3. Test Through UI

1. Open http://localhost:5173
2. Click "Start Analysis" or navigate to Dashboard
3. Click "Upload Audio" or drag & drop your file
4. Click "Start AI Analysis"
5. Wait 2-5 seconds for results

### 4. Expected Results

The AI will return:
- **Risk Level**: LOW RISK, MODERATE RISK, or HIGH RISK
- **Confidence**: Percentage (0-100%)
- **Recommendation**: What action to take
- **Features**: Audio analysis details
- **Processing Time**: How long it took

### 5. Risk Classification

| Confidence | Risk Level | Meaning |
|-----------|-----------|---------|
| ≥85% | HIGH RISK | N95 mask recommended, consult doctor |
| 60-84% | MODERATE RISK | Mask advised, monitor symptoms |
| <60% | LOW RISK | Normal breathing patterns |

## 🧪 Quick Test Without Recording

If you don't have audio, you can:
1. Download a sample breathing sound from YouTube
2. Use any .wav file temporarily to test the upload flow
3. The model will analyze whatever audio you provide

## 🔧 Troubleshooting

**"ML model not available"**
- Check that `models/respira_net_v1.pt` exists
- Restart FastAPI server

**"Analysis failed"**
- Check audio file format
- Ensure file is not corrupted
- Try a different audio file

**CORS errors**
- FastAPI should allow all origins
- Check browser console for details

## 📊 What the Model Analyzes

The AI extracts:
- **MFCCs** (Mel-frequency cepstral coefficients)
- **Jitter** (voice frequency variation)
- **Shimmer** (voice amplitude variation)
- **Silence ratio** (breathing patterns)
- **Spectral features** (sound characteristics)

Then classifies respiratory risk based on these patterns.

## ✨ You're Ready!

Your RespiraScan application is fully functional and ready to analyze real respiratory audio!
