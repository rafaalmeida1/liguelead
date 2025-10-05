import express from 'express';
import ProjectController from '../controllers/project.controller.js';

const router = express.Router();

router.post('/projects', ProjectController.createProject);
router.get('/projects', ProjectController.getProjects);
router.get('/projects/:id', ProjectController.getProjectById);
router.put('/projects/:id', ProjectController.updateProject);
router.delete('/projects/:id', ProjectController.deleteProject);

export default router;