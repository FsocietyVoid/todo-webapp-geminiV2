// backend/routes/aiRoutes.js
import express from 'express';
import { generateTasksController } from '../controllers/aiController.js';

const router = express.Router();

// POST /api/generate-tasks
router.post('/generate-tasks', generateTasksController);

export default router;