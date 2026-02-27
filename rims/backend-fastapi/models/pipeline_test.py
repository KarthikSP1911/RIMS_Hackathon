"""
RespiraScan Pipeline Verification Script
Tests complete ML pipeline with demo samples
"""

import sys
sys.path.append('..')

import numpy as np
import soundfile as sf
from pathlib import Path
import json
from ml.inference_pipeline import RespiraNetInference
from ml.dataset_generator import RespiratoryDatasetGenerator


def generate_demo_audio_samples():
    """Generate 10 demo audio samples for testing"""
    print("Generating 10 demo audio samples...")
    
    generator = RespiratoryDatasetGenerator()
    demo_samples = []
    
    # Generate 5 normal and 5 stressed samples
    scenarios = [
        {'label': 'normal_1', 'jitter': 0.015, 'shimmer': 0.025, 'aqi': 80, 'floor': 5},
        {'label': 'normal_2', 'jitter': 0.020, 'shimmer': 0.030, 'aqi': 100, 'floor': 10},
        {'label': 'normal_3', 'jitter': 0.018, 'shimmer': 0.028, 'aqi': 90, 'floor': 3},
        {'label': 'moderate_1', 'jitter': 0.035, 'shimmer': 0.055, 'aqi': 180, 'floor': 8},
        {'label': 'moderate_2', 'jitter': 0.040, 'shimmer': 0.065, 'aqi': 200, 'floor': 12},
        {'label': 'high_risk_1', 'jitter': 0.065, 'shimmer': 0.095, 'aqi': 300, 'floor': 15},
        {'label': 'high_risk_2', 'jitter': 0.070, 'shimmer': 0.105, 'aqi': 350, 'floor': 18},
        {'label': 'high_risk_3', 'jitter': 0.075, 'shimmer': 0.110, 'aqi': 380, 'floor': 20},
        {'label': 'borderline_1', 'jitter': 0.058, 'shimmer': 0.080, 'aqi': 250, 'floor': 10},
        {'label': 'borderline_2', 'jitter': 0.032, 'shimmer': 0.050, 'aqi': 160, 'floor': 7},
    ]
    
    Path('demo_audio').mkdir(exist_ok=True)
    
    for scenario in scenarios:
        audio = generator.generate_breathing_audio(
            jitter=scenario['jitter'],
            shimmer=scenario['shimmer'],
            aqi=scenario['aqi'],
            floor=scenario['floor']
        )
        
        filename = f"demo_audio/{scenario['label']}.wav"
        sf.write(filename, audio, generator.sr)
        
        demo_samples.append({
            'filename': filename,
            'parameters': scenario
        })
        
        print(f"  [OK] Generated {filename}")
    
    print(f"\n[OK] Generated {len(demo_samples)} demo audio files")
    return demo_samples


def test_inference_pipeline(demo_samples):
    """Test inference pipeline on demo samples"""
    print("\n" + "="*60)
    print("Testing Inference Pipeline")
    print("="*60)
    
    # Initialize inference
    inference = RespiraNetInference(
        model_path='respira_net_v1.pt',
        scaler_path='scaler.pkl'
    )
    
    results = []
    total_time = 0
    
    for sample in demo_samples:
        print(f"\nProcessing: {sample['filename']}")
        print(f"  Parameters: jitter={sample['parameters']['jitter']:.3f}, "
              f"shimmer={sample['parameters']['shimmer']:.3f}, "
              f"AQI={sample['parameters']['aqi']}")
        
        result = inference.process_audio(sample['filename'])
        
        if 'error' not in result:
            print(f"  Result: {result['risk_level']} ({result['confidence']}%)")
            print(f"  Processing time: {result['processing_time_ms']:.2f}ms")
            print(f"  Recommendation: {result['recommendation']}")
            
            total_time += result['processing_time_ms']
            
            results.append({
                'sample': sample['filename'],
                'parameters': sample['parameters'],
                'prediction': result
            })
        else:
            print(f"  [ERROR] Error: {result['error']}")
    
    avg_time = total_time / len(demo_samples)
    print(f"\n{'='*60}")
    print(f"Pipeline Performance Summary")
    print(f"{'='*60}")
    print(f"Total samples processed: {len(results)}")
    print(f"Average processing time: {avg_time:.2f}ms")
    print(f"Target: <2000ms ({'[PASS]' if avg_time < 2000 else '[FAIL]'})")
    
    # Save results
    with open('demo_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total_samples': len(results),
                'avg_processing_time_ms': round(avg_time, 2),
                'target_met': avg_time < 2000
            },
            'results': results
        }, f, indent=2)
    
    print(f"\n[OK] Results saved to demo_results.json")
    
    return results


def verify_model_requirements():
    """Verify model meets all requirements"""
    print("\n" + "="*60)
    print("Verifying Model Requirements")
    print("="*60)
    
    checks = []
    
    # Check model file exists
    model_path = Path('respira_net_v1.pt')
    if model_path.exists():
        model_size_mb = model_path.stat().st_size / (1024**2)
        print(f"[OK] Model file exists: {model_size_mb:.2f}MB")
        checks.append(('Model size <10MB', model_size_mb < 10, f"{model_size_mb:.2f}MB"))
    else:
        print(f"[ERROR] Model file not found")
        checks.append(('Model exists', False, 'Not found'))
    
    # Check TorchScript model
    ts_path = Path('respira_net_ts.pt')
    if ts_path.exists():
        ts_size_mb = ts_path.stat().st_size / (1024**2)
        print(f"[OK] TorchScript model exists: {ts_size_mb:.2f}MB")
        checks.append(('TorchScript model exists', True, f"{ts_size_mb:.2f}MB"))
    else:
        print(f"[ERROR] TorchScript model not found")
        checks.append(('TorchScript model exists', False, 'Not found'))
    
    # Check scaler
    scaler_path = Path('scaler.pkl')
    if scaler_path.exists():
        print(f"[OK] Scaler file exists")
        checks.append(('Scaler exists', True, 'Found'))
    else:
        print(f"[ERROR] Scaler file not found")
        checks.append(('Scaler exists', False, 'Not found'))
    
    # Check training history
    history_path = Path('train_history.json')
    if history_path.exists():
        with open(history_path, 'r') as f:
            history = json.load(f)
        
        avg_auc = history.get('avg_auc', 0)
        avg_sensitivity = history.get('avg_sensitivity', 0)
        
        print(f"[OK] Training history exists")
        print(f"  Average AUC: {avg_auc:.4f}")
        print(f"  Average Sensitivity: {avg_sensitivity:.4f}")
        
        checks.append(('AUC >= 0.93', avg_auc >= 0.93, f"{avg_auc:.4f}"))
        checks.append(('Sensitivity >= 0.91', avg_sensitivity >= 0.91, f"{avg_sensitivity:.4f}"))
    else:
        print(f"[ERROR] Training history not found")
        checks.append(('Training history exists', False, 'Not found'))
    
    # Summary
    print(f"\n{'='*60}")
    print(f"Requirements Summary")
    print(f"{'='*60}")
    
    for check_name, passed, value in checks:
        status = "[PASS]" if passed else "[FAIL]"
        print(f"{check_name:30s} {status:10s} {value}")
    
    all_passed = all(check[1] for check in checks)
    print(f"\n{'='*60}")
    if all_passed:
        print("[OK] ALL REQUIREMENTS MET")
    else:
        print("[ERROR] SOME REQUIREMENTS NOT MET")
    print(f"{'='*60}")
    
    return all_passed


def main():
    """Main verification script"""
    print("="*60)
    print("RespiraScan ML Pipeline Verification")
    print("="*60)
    
    # Step 1: Generate demo samples
    demo_samples = generate_demo_audio_samples()
    
    # Step 2: Test inference pipeline
    results = test_inference_pipeline(demo_samples)
    
    # Step 3: Verify requirements
    all_passed = verify_model_requirements()
    
    # Final summary
    print("\n" + "="*60)
    print("VERIFICATION COMPLETE")
    print("="*60)
    
    if all_passed:
        print("[OK] Production ML pipeline ready for deployment!")
    else:
        print("[WARNING]  Some requirements not met. Review output above.")
    
    print("\nGenerated files:")
    print("  - demo_audio/*.wav (10 test samples)")
    print("  - demo_results.json (inference results)")
    print("="*60)


if __name__ == "__main__":
    main()
