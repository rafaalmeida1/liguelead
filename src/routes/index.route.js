import express from 'express';
import projectRoutes from './project.routes.js';
import taskRoutes from './task.routes.js';

const router = express.Router();

// Rotas de projetos
router.use('/', projectRoutes);

// Rotas de tarefas
router.use('/', taskRoutes);

export default router;
