Modern AI-powered Event Planner Web App

## 1. Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)
- A Google Gemini API Key (Get one here: https://aistudio.google.com/app/apikey)

## 2. Installation
1.  Unzip the downloaded project.
2.  Open the folder in VS Code.
3.  Open a terminal and run:
    ```bash
    npm install
    ```

## 3. Configure AI for Local Use
The project currently uses `sk-YOUWARE` which only works inside the Youware platform. You need to switch to the direct Google provider.

1.  Install the Google provider:
    ```bash
    npm install @ai-sdk/google
    ```

2.  Open `src/services/aiEventService.ts`.

3.  **Replace** the imports and client setup:

    **Remove/Comment out:**
    ```typescript
    import { createOpenAI } from '@ai-sdk/openai';
    // ...
    const openai = createOpenAI({
      baseURL: 'https://api.youware.com/public/v1/ai',
      apiKey: 'sk-YOUWARE'
    });
    ```

    **Add/Uncomment:**
    ```typescript
    import { google } from '@ai-sdk/google';
    // No client setup needed, just use 'google' directly in generateObject
    ```

4.  **Update** the `generateObject` call:

    **Change:**
    ```typescript
    model: openai(config.model),
    ```

    **To:**
    ```typescript
    model: google('gemini-1.5-flash'), // Or 'gemini-2.0-flash' if available
    ```

5.  **Set your API Key**:
    Create a `.env.local` file in the root directory:
    ```env
    GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
    ```

## 4. Run the App
```bash
npm run dev
```
Open the link shown in the terminal (usually `http://localhost:5173`).

## Backend Note
This project currently operates as a **Frontend + AI** application. There is **no** separate Node.js/Express backend server included yet. All logic happens in the browser and via the AI API.

If you want to add a backend (e.g., to save plans to a database), you would need to:
1.  Set up an Express server.
2.  Connect to MongoDB.
3.  Create API endpoints.
4.  Call those endpoints from the React frontend.
