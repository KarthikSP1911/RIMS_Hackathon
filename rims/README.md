# 🏙️ UrbanVoice Sentinel - Installation Guide

Welcome to the **UrbanVoice Sentinel** project! This repository contains a professional three-stack architecture:
1.  **Frontend**: React (Vite) - The user dashboard.
2.  **Middleware**: Express.js - The API bridge.
3.  **Core Engine**: FastAPI (Python) - The neural processing unit.

---

## 🛠️ Step 1: Prerequisites

Before you begin, ensure you have the following installed on your Windows machine:
*   [Node.js](https://nodejs.org/) (Version 18 or higher)
*   [Python](https://www.python.org/downloads/) (Version 3.9 or higher)
*   [Git](https://git-scm.com/downloads) (Optional, for cloning)

---

## 📥 Step 2: Installation

Open your terminal (Command Prompt or PowerShell) in the workspace directory and follow these steps:

### 1. Unified Installation (The Fast Way)
Run the following command in the **root directory**:
```powershell
npm run install:all
```
*Wait for it to finish. It will automatically install dependencies for the Frontend, Express, and create a Python virtual environment for FastAPI.*

### 2. Manual Installation (If the above fails)
If you prefer to install each part manually, run these in order:
```powershell
# Install Root Tools
npm install

# Install Frontend
cd frontend
npm install
cd ..

# Install Express Middleware
cd backend-express
npm install
cd ..

# Install FastAPI Backend
cd backend-fastapi
python -m venv venv
.\venv\Scripts\pip install fastapi uvicorn requests pydantic-settings
cd ..
```

---

## 🚀 Step 3: Running the Application

You have two ways to start the entire system simultaneously:

### Option A: The One-Click Launch (Recommended)
Double-click the file named **`run_all.bat`** in the root folder. 
*   This will open **three separate windows** so you can see the logs for each service independently.

### Option B: The Unified Terminal
In your root terminal, run:
```powershell
npm run dev
```
*This will run all services in a single window using `concurrently`.*

---

## 🌐 Accessing the Services

Once everything is running, you can access the following:

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend** | [http://localhost:5173](http://localhost:5173) | The main UI Dashboard. |
| **Express API** | [http://localhost:5000](http://localhost:5000) | Middleware API endpoints. |
| **FastAPI Core** | [http://localhost:8000](http://localhost:8000) | Python Core & [API Docs](/docs). |

---

## 📁 Project Structure

*   `/frontend` - React source code and UI styles.
*   `/backend-express` - Node.js routes, controllers, and services.
*   `/backend-fastapi` - Python neural engine and API logic.
*   `run_all.bat` - Quick runner for Windows users.

---
**Happy Coding!** 🚀
