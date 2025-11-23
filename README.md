# Modern AI-Powered Event Planner Web App

A full-stack web application that generates detailed event plans using AI. Includes a React frontend, Node.js/Express backend, and integration with Google Gemini API for AI-powered planning.

---

## 1. Features

- Select event type (Birthday, School Event, Wedding, etc.)  
- Input custom budget (optional)  
- AI-generated step-by-step plan  
- Detailed to-do checklist with estimated costs  
- Total budget calculation  
- Theme ideas and extra tips in `expandedDetails`  
- Dark/light mode toggle  
- Backend API for future persistence and extension  

---

## 2. Prerequisites

- **Node.js** v18 or higher  
- **npm** (comes with Node.js)  
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))  

---


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
