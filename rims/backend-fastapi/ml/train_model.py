"""
SentinelNet Training Pipeline with 5-Fold Cross Validation
Target: AUC 0.93+, Sensitivity 0.91+
"""

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
import json
import pickle
from datetime import datetime
import time

from model_architecture import create_sentinel_net


class UrbanAcousticDataset(Dataset):
    """PyTorch Dataset for urban acoustic health features"""
    
    def __init__(self, X, y):
        self.X = torch.FloatTensor(X)
        self.y = torch.FloatTensor(y).unsqueeze(1)
    
    def __len__(self):
        return len(self.y)
    
    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]


class SentinelNetTrainer:
    """Training pipeline with cross-validation"""
    
    def __init__(self, n_folds=5, batch_size=32, epochs=50, learning_rate=0.001):
        self.n_folds = n_folds
        self.batch_size = batch_size
        self.epochs = epochs
        self.learning_rate = learning_rate
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {self.device}")
        
    def train_epoch(self, model, train_loader, criterion, optimizer):
        """Train for one epoch"""
        model.train()
        total_loss = 0
        predictions = []
        targets = []
        
        for batch_X, batch_y in train_loader:
            batch_X = batch_X.to(self.device)
            batch_y = batch_y.to(self.device)
            
            optimizer.zero_grad()
            outputs = model(batch_X)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            predictions.extend(outputs.detach().cpu().numpy())
            targets.extend(batch_y.cpu().numpy())
        
        avg_loss = total_loss / len(train_loader)
        auc = roc_auc_score(targets, predictions)
        
        return avg_loss, auc
    
    def validate(self, model, val_loader, criterion):
        """Validate model"""
        model.eval()
        total_loss = 0
        predictions = []
        targets = []
        
        with torch.no_grad():
            for batch_X, batch_y in val_loader:
                batch_X = batch_X.to(self.device)
                batch_y = batch_y.to(self.device)
                
                outputs = model(batch_X)
                loss = criterion(outputs, batch_y)
                
                total_loss += loss.item()
                predictions.extend(outputs.cpu().numpy())
                targets.extend(batch_y.cpu().numpy())
        
        avg_loss = total_loss / len(val_loader)
        auc = roc_auc_score(targets, predictions)
        
        # Calculate sensitivity (recall for positive class)
        pred_binary = (np.array(predictions) >= 0.5).astype(int)
        tn, fp, fn, tp = confusion_matrix(targets, pred_binary).ravel()
        sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
        specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
        
        return avg_loss, auc, sensitivity, specificity
    
    def train_fold(self, model, train_loader, val_loader, fold):
        """Train one fold"""
        print(f"\n{'='*60}")
        print(f"Training Fold {fold + 1}/{self.n_folds}")
        print(f"{'='*60}")
        
        criterion = nn.BCELoss()
        optimizer = optim.Adam(model.parameters(), lr=self.learning_rate)
        scheduler = optim.lr_scheduler.ReduceLROnPlateau(
            optimizer, mode='min', factor=0.5, patience=5
        )
        
        best_auc = 0
        best_model_state = None
        patience_counter = 0
        patience = 10
        
        fold_history = {
            'train_loss': [],
            'train_auc': [],
            'val_loss': [],
            'val_auc': [],
            'val_sensitivity': [],
            'val_specificity': []
        }
        
        for epoch in range(self.epochs):
            start_time = time.time()
            
            # Train
            train_loss, train_auc = self.train_epoch(model, train_loader, criterion, optimizer)
            
            # Validate
            val_loss, val_auc, val_sensitivity, val_specificity = self.validate(model, val_loader, criterion)
            
            # Learning rate scheduling
            scheduler.step(val_loss)
            
            epoch_time = time.time() - start_time
            
            # Save history
            fold_history['train_loss'].append(float(train_loss))
            fold_history['train_auc'].append(float(train_auc))
            fold_history['val_loss'].append(float(val_loss))
            fold_history['val_auc'].append(float(val_auc))
            fold_history['val_sensitivity'].append(float(val_sensitivity))
            fold_history['val_specificity'].append(float(val_specificity))
            
            # Print progress
            if (epoch + 1) % 5 == 0 or epoch == 0:
                print(f"Epoch {epoch+1:3d}/{self.epochs} | "
                      f"Train Loss: {train_loss:.4f} AUC: {train_auc:.4f} | "
                      f"Val Loss: {val_loss:.4f} AUC: {val_auc:.4f} "
                      f"Sens: {val_sensitivity:.4f} | "
                      f"Time: {epoch_time:.1f}s")
            
            # Early stopping
            if val_auc > best_auc:
                best_auc = val_auc
                best_model_state = model.state_dict().copy()
                patience_counter = 0
            else:
                patience_counter += 1
                if patience_counter >= patience:
                    print(f"\nEarly stopping at epoch {epoch+1}")
                    break
        
        # Load best model
        model.load_state_dict(best_model_state)
        
        print(f"\nFold {fold + 1} Best Validation AUC: {best_auc:.4f}")
        
        return model, fold_history, best_auc
    
    def train_cross_validation(self, X, y):
        """Train with 5-fold cross validation"""
        print(f"\nStarting 5-Fold Cross Validation Training")
        print(f"Dataset: {X.shape[0]} samples")
        print(f"Batch size: {self.batch_size}")
        print(f"Max epochs: {self.epochs}")
        
        # Normalize features
        print("\nNormalizing features...")
        X_reshaped = X.reshape(X.shape[0], -1)
        scaler = StandardScaler()
        X_normalized = scaler.fit_transform(X_reshaped)
        X_normalized = X_normalized.reshape(X.shape)
        
        # Save scaler
        with open('models/scaler.pkl', 'wb') as f:
            pickle.dump(scaler, f)
        print("Scaler saved to models/scaler.pkl")
        
        # Cross validation
        skf = StratifiedKFold(n_splits=self.n_folds, shuffle=True, random_state=42)
        
        fold_results = []
        all_histories = []
        
        for fold, (train_idx, val_idx) in enumerate(skf.split(X_normalized, y)):
            # Create datasets
            X_train, X_val = X_normalized[train_idx], X_normalized[val_idx]
            y_train, y_val = y[train_idx], y[val_idx]
            
            train_dataset = UrbanAcousticDataset(X_train, y_train)
            val_dataset = UrbanAcousticDataset(X_val, y_val)
            
            train_loader = DataLoader(train_dataset, batch_size=self.batch_size, shuffle=True)
            val_loader = DataLoader(val_dataset, batch_size=self.batch_size, shuffle=False)
            
            # Create and train model
            model = create_sentinel_net().to(self.device)
            model, fold_history, best_auc = self.train_fold(model, train_loader, val_loader, fold)
            
            fold_results.append({
                'fold': fold + 1,
                'best_auc': float(best_auc),
                'final_sensitivity': float(fold_history['val_sensitivity'][-1]),
                'final_specificity': float(fold_history['val_specificity'][-1])
            })
            all_histories.append(fold_history)
            
            # Save fold model
            torch.save(model.state_dict(), f'models/sentinel_net_fold{fold+1}.pt')
        
        # Calculate average metrics
        avg_auc = np.mean([r['best_auc'] for r in fold_results])
        avg_sensitivity = np.mean([r['final_sensitivity'] for r in fold_results])
        avg_specificity = np.mean([r['final_specificity'] for r in fold_results])
        
        print(f"\n{'='*60}")
        print(f"Cross Validation Results")
        print(f"{'='*60}")
        print(f"Average AUC: {avg_auc:.4f}")
        print(f"Average Sensitivity: {avg_sensitivity:.4f}")
        print(f"Average Specificity: {avg_specificity:.4f}")
        
        # Save training history
        training_results = {
            'timestamp': datetime.now().isoformat(),
            'n_folds': self.n_folds,
            'batch_size': self.batch_size,
            'epochs': self.epochs,
            'learning_rate': self.learning_rate,
            'avg_auc': float(avg_auc),
            'avg_sensitivity': float(avg_sensitivity),
            'avg_specificity': float(avg_specificity),
            'fold_results': fold_results,
            'fold_histories': all_histories
        }
        
        with open('models/train_history.json', 'w') as f:
            json.dump(training_results, f, indent=2)
        
        print(f"\nTraining history saved to models/train_history.json")
        
        # Train final model on full dataset
        print(f"\nTraining final model on full dataset...")
        full_dataset = UrbanAcousticDataset(X_normalized, y)
        full_loader = DataLoader(full_dataset, batch_size=self.batch_size, shuffle=True)
        
        final_model = create_sentinel_net().to(self.device)
        criterion = nn.BCELoss()
        optimizer = optim.Adam(final_model.parameters(), lr=self.learning_rate)
        
        for epoch in range(30):  # Fewer epochs for final model
            final_model.train()
            for batch_X, batch_y in full_loader:
                batch_X = batch_X.to(self.device)
                batch_y = batch_y.to(self.device)
                
                optimizer.zero_grad()
                outputs = final_model(batch_X)
                loss = criterion(outputs, batch_y)
                loss.backward()
                optimizer.step()
        
        # Save final model
        torch.save(final_model.state_dict(), 'models/sentinel_net_v1.pt')
        print("Final model saved to models/sentinel_net_v1.pt")
        
        return final_model, training_results


if __name__ == "__main__":
    # Load dataset
    print("Loading dataset...")
    X = np.load('models/X_mfcc.npy')
    y = np.load('models/y_risk.npy')
    
    print(f"Dataset loaded: X shape {X.shape}, y shape {y.shape}")
    
    # Train model
    trainer = SentinelNetTrainer(
        n_folds=5,
        batch_size=32,
        epochs=50,
        learning_rate=0.001
    )
    
    model, results = trainer.train_cross_validation(X, y)
    
    print("\n[OK] Training complete!")
