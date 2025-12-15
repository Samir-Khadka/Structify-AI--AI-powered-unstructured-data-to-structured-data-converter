#!/bin/bash

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Download spaCy model
echo "Downloading spaCy model..."
python -m spacy download en_core_web_sm

# Create necessary directories
mkdir -p uploads
mkdir -p logs

echo "Setup complete!"
echo "Run the server with: python main.py"