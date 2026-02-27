"""
UrbanVoice Sentinel Dataset Generator
Generates 10K synthetic urban acoustic audio samples with realistic health signatures and environmental features
"""

import numpy as np
import librosa
from scipy import signal
import json

class UrbanAcousticDatasetGenerator:
    def __init__(self, n_samples=10000, sample_rate=16000):
        self.n_samples = n_samples
        self.sr = sample_rate
        self.duration = 3.0  # 3 seconds per sample
        
    def generate_breathing_audio(self, jitter, shimmer, aqi, floor):
        """Generate synthetic acoustic audio with specified health and urban parameters"""
        t = np.linspace(0, self.duration, int(self.sr * self.duration))
        
        # Base acoustic periodic signature (respiratory frequency 12-20 cycles per minute)
        breath_freq = np.random.uniform(0.2, 0.33)  # Hz
        
        # Generate base acoustic pattern
        breathing = np.sin(2 * np.pi * breath_freq * t)
        
        # Add jitter (frequency variation)
        jitter_noise = np.random.normal(0, jitter, len(t))
        breathing = breathing * (1 + jitter_noise)
        
        # Add shimmer (amplitude variation)
        shimmer_envelope = 1 + np.random.normal(0, shimmer, len(t))
        breathing = breathing * shimmer_envelope
        
        # Add harmonics for realism
        for harmonic in range(2, 5):
            breathing += 0.3 * np.sin(2 * np.pi * breath_freq * harmonic * t) / harmonic
        
        # AQI effect (adds noise/irregularity)
        aqi_factor = (aqi - 50) / 350  # Normalize 50-400 to 0-1
        aqi_noise = np.random.normal(0, 0.1 * aqi_factor, len(t))
        breathing += aqi_noise
        
        # Floor echo effect (reverb simulation)
        floor_factor = floor / 20.0  # Normalize floor 1-20
        if floor > 5:
            # Add echo for higher floors
            echo_delay = int(0.05 * self.sr * floor_factor)
            echo = np.zeros_like(breathing)
            echo[echo_delay:] = breathing[:-echo_delay] * 0.3 * floor_factor
            breathing += echo
        
        # Normalize
        breathing = breathing / np.max(np.abs(breathing))
        
        # Add background noise
        noise = np.random.normal(0, 0.05, len(breathing))
        breathing += noise
        
        return breathing.astype(np.float32)
    
    def extract_mfcc_features(self, audio):
        """Extract 13 MFCCs with 100 time frames"""
        mfcc = librosa.feature.mfcc(
            y=audio,
            sr=self.sr,
            n_mfcc=13,
            n_fft=512,
            hop_length=int(len(audio) / 100)
        )
        
        # Ensure exactly 100 frames
        if mfcc.shape[1] < 100:
            mfcc = np.pad(mfcc, ((0, 0), (0, 100 - mfcc.shape[1])), mode='edge')
        elif mfcc.shape[1] > 100:
            mfcc = mfcc[:, :100]
        
        return mfcc
    
    def generate_dataset(self):
        """Generate complete dataset with balanced classes"""
        print("Generating 10K urban acoustic mapping samples...")
        
        X_mfcc = []
        y_risk = []
        metadata = []
        
        # Generate 5000 normal samples (risk=0)
        for i in range(5000):
            # Normal breathing parameters
            jitter = np.random.uniform(0.01, 0.025)
            shimmer = np.random.uniform(0.02, 0.04)
            aqi = np.random.uniform(50, 150)  # Good to moderate AQI
            floor = np.random.randint(1, 21)
            
            audio = self.generate_breathing_audio(jitter, shimmer, aqi, floor)
            mfcc = self.extract_mfcc_features(audio)
            
            X_mfcc.append(mfcc)
            y_risk.append(0)
            metadata.append({
                'jitter': float(jitter),
                'shimmer': float(shimmer),
                'aqi': float(aqi),
                'floor': int(floor),
                'label': 'normal'
            })
            
            if (i + 1) % 1000 == 0:
                print(f"  Generated {i + 1}/5000 normal acoustic baseline samples")
        
        # Generate 5000 stressed/high-risk samples (risk=1)
        for i in range(5000):
            # Stressed breathing parameters
            jitter = np.random.uniform(0.03, 0.08)
            shimmer = np.random.uniform(0.045, 0.12)
            aqi = np.random.uniform(150, 400)  # Unhealthy to hazardous AQI
            floor = np.random.randint(1, 21)
            
            audio = self.generate_breathing_audio(jitter, shimmer, aqi, floor)
            mfcc = self.extract_mfcc_features(audio)
            
            X_mfcc.append(mfcc)
            y_risk.append(1)
            metadata.append({
                'jitter': float(jitter),
                'shimmer': float(shimmer),
                'aqi': float(aqi),
                'floor': int(floor),
                'label': 'stressed'
            })
            
            if (i + 1) % 1000 == 0:
                print(f"  Generated {i + 1}/5000 anomalous acoustic samples")
        
        # Convert to numpy arrays
        X_mfcc = np.array(X_mfcc, dtype=np.float32)
        y_risk = np.array(y_risk, dtype=np.int64)
        
        print(f"\nDataset generated successfully!")
        print(f"X_mfcc shape: {X_mfcc.shape}")
        print(f"y_risk shape: {y_risk.shape}")
        print(f"Class distribution: {np.bincount(y_risk)}")
        
        return X_mfcc, y_risk, metadata
    
    def save_dataset(self, X_mfcc, y_risk, metadata, output_dir='models'):
        """Save dataset to disk"""
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        np.save(f'{output_dir}/X_mfcc.npy', X_mfcc)
        np.save(f'{output_dir}/y_risk.npy', y_risk)
        
        with open(f'{output_dir}/dataset_metadata.json', 'w') as f:
            json.dump({
                'n_samples': len(y_risk),
                'n_features': X_mfcc.shape[1:],
                'class_distribution': {
                    'normal': int(np.sum(y_risk == 0)),
                    'stressed': int(np.sum(y_risk == 1))
                },
                'samples': metadata[:100]  # Save first 100 for reference
            }, f, indent=2)
        
        print(f"\nDataset saved to {output_dir}/")
        print(f"  - X_mfcc.npy")
        print(f"  - y_risk.npy")
        print(f"  - dataset_metadata.json")


if __name__ == "__main__":
    generator = UrbanAcousticDatasetGenerator(n_samples=10000)
    X_mfcc, y_risk, metadata = generator.generate_dataset()
    generator.save_dataset(X_mfcc, y_risk, metadata)
