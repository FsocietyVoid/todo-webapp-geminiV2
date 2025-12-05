// backend/controllers/aiController.js
import { generateTasks } from '../services/geminiClient.js';

export async function generateTasksController(req, res) {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Prompt is required and must be a non-empty string.' });
    }

    try {
        const tasks = await generateTasks(prompt);
        // Success: Send the array of tasks back to the frontend
        return res.status(200).json({ success: true, tasks });

    } catch (error) {
        console.error('Error in generateTasksController:', error.message);
        // Forward generic internal/API errors
        return res.status(500).json({ success: false, error: error.message || 'Failed to generate tasks due to a server error.' });
    }
}