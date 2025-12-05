// backend/services/geminiClient.js
import fetch from 'node-fetch';
import { env } from 'process';

const GEMINI_MODEL = "gemini-2.0-flash-lite";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`; // Changed from v1beta to v1
const API_KEY = env.GEMINI_API_KEY;

/**
 * Calls the Gemini API to generate a structured list of tasks based on a prompt.
 * @param {string} prompt The user's request for tasks.
 * @returns {Promise<Array<{title: string, duration: string}>>} An array of task objects.
 */
export async function generateTasks(prompt) {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured in the server environment.");
    }

    const systemPrompt = "You are a professional task list organizer. Based on the user's request, break down the task into a logical series of steps. Return a JSON array of objects with 'title' and 'duration' fields. Example: [{\"title\":\"Task 1\",\"duration\":\"30 mins\"},{\"title\":\"Task 2\",\"duration\":\"1 hour\"}]";

    const payload = {
        contents: [
            { 
                role: "user",
                parts: [{ text: systemPrompt + "\n\nUser request: " + prompt }] 
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const apiData = await response.json();

    if (!response.ok) {
        console.error("Gemini API Error:", apiData);
        throw new Error(apiData.error?.message || "External API call failed.");
    }

    const textResponse = apiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
        throw new Error("Gemini returned an empty response.");
    }

    try {
        // Extract JSON from response (it might have markdown code blocks)
        const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        // If no JSON array found, try parsing the whole response
        return JSON.parse(textResponse);
    } catch (e) {
        console.error("Error parsing Gemini JSON:", textResponse);
        
        // Fallback: create simple tasks from the text response
        const lines = textResponse.split('\n').filter(line => line.trim());
        return lines.slice(0, 5).map((line, idx) => ({
            title: line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim(),
            duration: 'N/A'
        }));
    }
}