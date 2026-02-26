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

Open the workspace directory in your file explorer and choose one of the following:

### 1. Automatic Setup (Windows Recommended)
Double-click the file named **`setup.bat`** in the root folder.
*   This will automatically install Node dependencies for all stacks and set up the Python virtual environment.

### 2. Manual Installation
If you prefer the command line, run:
```powershell
npm run install:all
```

---

## 🚀 Step 3: Running the Application

Once setup is complete, you can launch the entire ecosystem in separate terminal windows:

### Option A: One-Click Launch
Double-click **`run_all.bat`** in the root folder.

### Option B: Terminal Command
In your root terminal, run:
```powershell
npm run dev
```
*Note: This now triggers the batch runner for separate window logging.*

---

## 🌐 Accessing the Services

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend** | [http://localhost:5173](http://localhost:5173) | The main UI Dashboard. |
| **Express API** | [http://localhost:5000](http://localhost:5000) | Middleware API endpoints. |
| **FastAPI Core** | [http://localhost:8000](http://localhost:8000) | Python Core & [API Docs](/docs). |

---

## 📁 Project Structure

*   `/frontend` - React source code and UI styles (Enterprise SaaS theme).
*   `/backend-express` - Node.js routes and controllers.
*   `/backend-fastapi` - Python neural engine logic.
*   `setup.bat` - Automated installation script.
*   `run_all.bat` - Multi-terminal service runner.

---
**Happy Coding!** 🚀
