import express from 'express';
import TaskController from '../controllers/task.controller.js';

const router = express.Router();

// Rotas para tarefas
router.post('/projects/:projectId/tasks', TaskController.createTask);
router.get('/tasks', TaskController.getAllTasks);
router.get('/tasks/:id', TaskController.getTaskById);
router.put('/tasks/:id', TaskController.updateTask);
router.delete('/tasks/:id', TaskController.deleteTask);
router.get('/projects/:projectId/tasks', TaskController.getTasksByProject);

export default router;
