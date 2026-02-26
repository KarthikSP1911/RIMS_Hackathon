# Multi-Stack Project Setup

A modern, high-performance architecture featuring a React frontend, an Express middleware backend, and a FastAPI core backend.

## 🏗️ Architecture Overview

- **Frontend (React + Vite)**: Port 5173
  - Modern UI with HSL colors, glassmorphism, and smooth animations.
- **Middleware (Express.js)**: Port 5000
  - Handles authentication, logging, and relays data between the UI and FastAPI.
- **Core Engine (FastAPI)**: Port 8000
  - High-performance Python backend for data processing and AI integration.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.9+)

### Installation

1. Clone or copy this repository.
2. In the root directory, install all dependencies:
   ```bash
   npm run install:all
   ```

### Running the Application

Start all三个 (three) stacks simultaneously:
```bash
npm run dev
```

The system will automatically start:
- React Frontend: `http://localhost:5173`
- Express Backend: `http://localhost:5000`
- FastAPI Backend: `http://localhost:8000`

## 📁 Project Structure

```text
rims/
├── frontend/             # React + Vite
│   ├── src/              # UI components and logic
│   └── package.json
├── backend-express/      # Node.js + Express
│   ├── index.js          # Entry point and proxy logic
│   └── package.json
├── backend-fastapi/      # Python + FastAPI
│   ├── main.py           # Core logic and endpoints
│   └── venv/             # Python Virtual Environment
└── package.json          # Root scripts to orchestrate all stacks
```

## 🛠️ Key Features
- **Modern UI**: Stylish dark mode with glassmorphic cards and hover effects.
- **Proxy Communication**: UI calls Express, which then seamlessly proxies to FastAPI.
- **Single Command Startup**: Run `npm run dev` to launch the entire ecosystem.
- **Scalability**: Decoupled architecture allows each stack to scale independently.
