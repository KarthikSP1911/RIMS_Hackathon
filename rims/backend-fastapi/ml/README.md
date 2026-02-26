# RespiraScan ML Pipeline

Complete production-ready ML pipeline for respiratory risk detection from voice audio.

## 🎯 Pipeline Overview

**7-Step Production Inference Process:**
1. Load 16kHz mono audio
2. Trim silence (<0.5 energy threshold)
3. Spectral noise gating (-30dB)
4. Extract 13 MFCCs, 100 frames
5. Z-score normalize (precomputed scaler)
6. TorchScript model inference (<500ms)
7. Calibrate probability → risk class

## 📊 Model Performance

- **Architecture**: Hybrid CNN-LSTM (RespiraNet)
- **Target AUC**: ≥0.93
- **Target Sensitivity**: ≥0.91
- **Inference Time**: <2 seconds total pipeline
- **Model Size**: <10MB
- **Deployment**: CPU-compatible TorchScript

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run Complete Pipeline

```bash
python run_complete_pipeline.py
```

This will:
- Generate 10K synthetic samples
- Train RespiraNet with 5-fold CV
- Convert to TorchScript
- Generate demo audio samples
- Test inference pipeline
- Verify all requirements

### 3. Use Inference Pipeline

```python
from inference_pipeline import RespiraNetInference

# Initialize
inference = RespiraNetInference(
    model_path='../models/respira_net_v1.pt',
    scaler_path='../models/scaler.pkl'
)

# Process audio
result = inference.process_audio('path/to/audio.wav')

print(f"Risk Level: {result['risk_level']}")
print(f"Confidence: {result['confidence']}%")
print(f"Processing Time: {result['processing_time_ms']}ms")
```

## 📁 File Structure

```
ml/
├── dataset_generator.py      # Generate 10K synthetic samples
├── model_architecture.py     # RespiraNet CNN-LSTM architecture
├── train_model.py            # 5-fold CV training pipeline
├── inference_pipeline.py     # Production inference (7 steps)
├── run_complete_pipeline.py  # Master execution script
├── requirements.txt          # Python dependencies
└── README.md                 # This file

models/
├── X_mfcc.npy               # Training features (10K x 13 x 100)
├── y_risk.npy               # Training labels (10K binary)
├── respira_net_v1.pt        # Trained PyTorch model
├── respira_net_ts.pt        # TorchScript production model
├── scaler.pkl               # Feature normalization scaler
├── train_history.json       # CV scores and metrics
├── demo_results.json        # Test predictions
├── dataset_metadata.json    # Dataset statistics
└── pipeline_test.py         # Verification script

demo_audio/
└── *.wav                    # 10 test audio samples
```

## 🔬 Model Architecture

**RespiraNet Hybrid CNN-LSTM:**

```
Input: [batch, 13_mfcc, 100_timesteps]
  ↓
Conv1D(13→32) + BatchNorm + MaxPool + Dropout(0.3)
  ↓
Conv1D(32→64) + BatchNorm + MaxPool + Dropout(0.3)
  ↓
Conv1D(64→128) + BatchNorm + MaxPool + Dropout(0.3)
  ↓
Bidirectional LSTM(128 units, 2 layers)
  ↓
Dense(256→64) + BatchNorm + Dropout(0.4)
  ↓
Dense(64→32) + BatchNorm + Dropout(0.4)
  ↓
Dense(32→1) + Sigmoid
  ↓
Output: [batch, 1] probability
```

## 📈 Risk Classification

| Probability | Risk Level | Recommendation |
|------------|------------|----------------|
| ≥0.85 | HIGH RISK | N95 mask recommended. Consult healthcare provider immediately. |
| 0.60-0.84 | MODERATE RISK | Mask advised. Monitor symptoms closely. |
| <0.60 | LOW RISK | Normal breathing patterns detected. Continue monitoring. |

## 🧪 Dataset Generation

**10K Synthetic Samples:**
- 5000 Normal: jitter 0.01-0.025, shimmer 0.02-0.04, AQI 50-150
- 5000 Stressed: jitter 0.03-0.08, shimmer 0.045-0.12, AQI 150-400
- Floor effects: 1st-20th floor echo simulation
- Balanced classes for optimal training

## ⚡ Performance Optimization

- **TorchScript**: JIT compilation for faster inference
- **CPU-only**: No GPU required for deployment
- **Batch normalization**: Faster convergence
- **Early stopping**: Prevents overfitting (patience=10)
- **Learning rate scheduling**: Adaptive optimization

## 🔍 Testing & Verification

Run verification script:

```bash
cd models
python pipeline_test.py
```

Checks:
- ✅ Model size <10MB
- ✅ TorchScript conversion successful
- ✅ AUC ≥0.93
- ✅ Sensitivity ≥0.91
- ✅ Inference time <2 seconds
- ✅ 10 demo predictions

## 📊 Output Format

```json
{
  "risk_level": "HIGH RISK",
  "confidence": 87.3,
  "recommendation": "N95 mask recommended...",
  "model_version": "v1.2.1",
  "processing_time_ms": 1243.56,
  "features": {
    "jitter": 0.023,
    "shimmer": 0.045,
    "mfcc_mean": [...],
    "silence_ratio": 0.12
  },
  "pipeline_timing": {
    "load_audio_ms": 234.12,
    "trim_silence_ms": 45.67,
    "noise_gate_ms": 123.45,
    "extract_mfcc_ms": 456.78,
    "normalize_ms": 12.34,
    "inference_ms": 345.67,
    "calibrate_ms": 25.53
  }
}
```

## 🛠️ Troubleshooting

**Issue**: Model not found
```bash
# Run complete pipeline to generate all artifacts
python run_complete_pipeline.py
```

**Issue**: Slow inference
```bash
# Ensure TorchScript model is being used
# Check: models/respira_net_ts.pt exists
```

**Issue**: Poor accuracy
```bash
# Retrain with more epochs or different hyperparameters
# Edit train_model.py: epochs=100, learning_rate=0.0005
```

## 📝 License

MIT License - RespiraScan Technologies Inc. 2026

## ⚠️ Medical Disclaimer

This is a screening tool and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
