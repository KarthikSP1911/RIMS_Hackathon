"""
RespiraNet: Hybrid CNN-LSTM Architecture for Respiratory Risk Detection
Target: AUC 0.93+, Sensitivity 0.91+
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class RespiraNet(nn.Module):
    """
    Hybrid CNN-LSTM architecture for respiratory audio classification
    Input: [batch, 13_mfcc, 100_timesteps]
    Output: [batch, 1] sigmoid probability
    """
    
    def __init__(self, input_channels=13, sequence_length=100):
        super(RespiraNet, self).__init__()
        
        # CNN Layers for feature extraction
        self.conv1 = nn.Conv1d(input_channels, 32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm1d(32)
        self.pool1 = nn.MaxPool1d(2)
        self.dropout1 = nn.Dropout(0.3)
        
        self.conv2 = nn.Conv1d(32, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm1d(64)
        self.pool2 = nn.MaxPool1d(2)
        self.dropout2 = nn.Dropout(0.3)
        
        self.conv3 = nn.Conv1d(64, 128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm1d(128)
        self.pool3 = nn.MaxPool1d(2)
        self.dropout3 = nn.Dropout(0.3)
        
        # Calculate LSTM input size after pooling
        # 100 -> 50 -> 25 -> 12 (after 3 pooling layers)
        lstm_input_size = 128
        lstm_sequence_length = sequence_length // 8
        
        # Bidirectional LSTM for temporal modeling
        self.lstm = nn.LSTM(
            input_size=lstm_input_size,
            hidden_size=128,
            num_layers=2,
            batch_first=True,
            bidirectional=True,
            dropout=0.3
        )
        
        # Dense layers for classification
        self.fc1 = nn.Linear(128 * 2, 64)  # *2 for bidirectional
        self.bn_fc1 = nn.BatchNorm1d(64)
        self.dropout_fc1 = nn.Dropout(0.4)
        
        self.fc2 = nn.Linear(64, 32)
        self.bn_fc2 = nn.BatchNorm1d(32)
        self.dropout_fc2 = nn.Dropout(0.4)
        
        self.fc3 = nn.Linear(32, 1)
        
    def forward(self, x):
        """
        Forward pass
        Args:
            x: [batch, 13, 100] MFCC features
        Returns:
            output: [batch, 1] sigmoid probability
        """
        # CNN feature extraction
        x = self.pool1(F.relu(self.bn1(self.conv1(x))))
        x = self.dropout1(x)
        
        x = self.pool2(F.relu(self.bn2(self.conv2(x))))
        x = self.dropout2(x)
        
        x = self.pool3(F.relu(self.bn3(self.conv3(x))))
        x = self.dropout3(x)
        
        # Reshape for LSTM: [batch, channels, time] -> [batch, time, channels]
        x = x.permute(0, 2, 1)
        
        # LSTM temporal modeling
        lstm_out, (h_n, c_n) = self.lstm(x)
        
        # Use last hidden state from both directions
        # h_n shape: [num_layers*2, batch, hidden_size]
        forward_hidden = h_n[-2, :, :]
        backward_hidden = h_n[-1, :, :]
        hidden = torch.cat([forward_hidden, backward_hidden], dim=1)
        
        # Dense classification layers
        x = F.relu(self.bn_fc1(self.fc1(hidden)))
        x = self.dropout_fc1(x)
        
        x = F.relu(self.bn_fc2(self.fc2(x)))
        x = self.dropout_fc2(x)
        
        # Sigmoid output for binary classification
        output = torch.sigmoid(self.fc3(x))
        
        return output
    
    def get_model_size(self):
        """Calculate model size in MB"""
        param_size = 0
        for param in self.parameters():
            param_size += param.nelement() * param.element_size()
        buffer_size = 0
        for buffer in self.buffers():
            buffer_size += buffer.nelement() * buffer.element_size()
        
        size_mb = (param_size + buffer_size) / 1024**2
        return size_mb
    
    def count_parameters(self):
        """Count trainable parameters"""
        return sum(p.numel() for p in self.parameters() if p.requires_grad)


def create_respira_net():
    """Factory function to create RespiraNet model"""
    model = RespiraNet(input_channels=13, sequence_length=100)
    print(f"RespiraNet created:")
    print(f"  Parameters: {model.count_parameters():,}")
    print(f"  Model size: {model.get_model_size():.2f} MB")
    return model


if __name__ == "__main__":
    # Test model architecture
    model = create_respira_net()
    
    # Test forward pass
    batch_size = 4
    dummy_input = torch.randn(batch_size, 13, 100)
    output = model(dummy_input)
    
    print(f"\nTest forward pass:")
    print(f"  Input shape: {dummy_input.shape}")
    print(f"  Output shape: {output.shape}")
    print(f"  Output range: [{output.min():.4f}, {output.max():.4f}]")
