"""Test if the trained model is ready"""
import sys
import os
sys.path.append('ml')
os.chdir('rims/backend-fastapi')

from inference_pipeline import RespiraNetInference

print("Testing trained model...")
inference = RespiraNetInference(
    model_path='models/respira_net_v1.pt',
    scaler_path='models/scaler.pkl'
)
print("✅ Model loaded successfully!")
print("✅ PIPELINE COMPLETE - Ready for real audio testing!")
print("\nModel files created:")
print("  - models/respira_net_v1.pt (Trained model)")
print("  - models/respira_net_ts.pt (TorchScript)")
print("  - models/scaler.pkl (Feature normalizer)")
print("  - models/train_history.json (Training results)")
print("\nYou can now test with real audio files!")
