# Testing Setup - Authentication Disabled

## Current Status
Authentication has been **temporarily disabled** to allow friends to test the application without creating accounts.

## What Changed
- Dashboard and History pages are now accessible without login
- Users can click "Start Analysis" and immediately upload audio files
- No registration or sign-in required

## How to Test
1. Run the application using `run_all.bat`
2. Open browser to `http://localhost:5173`
3. Click "Start Analysis" button on the homepage
4. Upload an audio file (WAV, MP3, or M4A format)
5. View the AI analysis results

## Re-enabling Authentication (After Testing)
To restore authentication after testing is complete:

1. Open `rims/frontend/src/App.jsx`
2. Find the Routes section (around line 380)
3. Comment out the TESTING MODE routes:
   ```jsx
   {/* TESTING MODE: Auth temporarily disabled
   <Route path="/dashboard" element={<Dashboard />} />
   <Route path="/history" element={<HistoryPagePlaceholder />} />
   */}
   ```
4. Uncomment the PRODUCTION routes:
   ```jsx
   <Route element={<ProtectedRoute />}>
     <Route path="/dashboard" element={<Dashboard />} />
     <Route path="/history" element={<HistoryPagePlaceholder />} />
   </Route>
   ```

## Notes
- The Express backend auth endpoints still work (register/login)
- MongoDB connection is configured in `.env` file
- FastAPI backend runs on port 8000
- Express backend runs on port 5000
- Frontend runs on port 5173
