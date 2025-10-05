import { createResponse } from '../middlewares/i18n.js';
import taskService from '../services/task.service.js';
import { z } from 'zod';

class TaskController {
    async createTask(req, res) {
        try {
            const schema = z.object({
                title: z.string().min(1, 'Título é obrigatório').max(255, 'Título deve ter no máximo 255 caracteres'),
                description: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').optional(),
                status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
                priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
                dueDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
                projectId: z.number().int().positive('ID do projeto deve ser um número positivo')
            });
            
            const validatedData = schema.parse(req.body);
            const task = await taskService.createTask(validatedData);
            
            res.status(201).json(createResponse(req, task, 'taskCreated'));
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json(createResponse(req, { errors: errorMessages }, 'validationError', 400));
            }
            
            if (error.message === 'Projeto não encontrado') {
                return res.status(404).json(createResponse(req, null, 'projectNotFound', 404));
            }
            
            console.error('Erro ao criar tarefa:', error);
            res.status(500).json(createResponse(req, null, 'serverError', 500));
        }
    }

    async getTaskById(req, res) {
        try {
            const schema = z.object({
                id: z.string().min(1, 'ID é obrigatório').regex(/^\d+$/, 'ID deve ser um número')
            });
            
            const { id } = schema.parse(req.params);
            const task = await taskService.getTaskById(parseInt(id));
            
            res.status(200).json(createResponse(req, task, 'task'));
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json(createResponse(req, { errors: errorMessages }, 'validationError', 400));
            }
            
            if (error.message === 'Tarefa não encontrada') {
                return res.status(404).json(createResponse(req, null, 'taskNotFound', 404));
            }
            
            console.error('Erro ao buscar tarefa:', error);
            res.status(500).json(createResponse(req, null, 'serverError', 500));
        }
    }

    async updateTask(req, res) {
        try {
            const paramsSchema = z.object({
                id: z.string().min(1, 'ID é obrigatório').regex(/^\d+$/, 'ID deve ser um número')
            });
            
            const bodySchema = z.object({
                title: z.string().min(1, 'Título é obrigatório').max(255, 'Título deve ter no máximo 255 caracteres').optional(),
                description: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').optional(),
                status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
                priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
                dueDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
                projectId: z.number().int().positive('ID do projeto deve ser um número positivo').optional()
            });
            
            const { id } = paramsSchema.parse(req.params);
            const validatedData = bodySchema.parse(req.body);
            
            const task = await taskService.updateTask(parseInt(id), validatedData);
            
            res.status(200).json(createResponse(req, task, 'task'));
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json(createResponse(req, { errors: errorMessages }, 'validationError', 400));
            }
            
            if (error.message === 'Tarefa não encontrada') {
                return res.status(404).json(createResponse(req, null, 'taskNotFound', 404));
            }
            
            if (error.message === 'Projeto de destino não encontrado') {
                return res.status(404).json(createResponse(req, null, 'projectNotFound', 404));
            }
            
            console.error('Erro ao atualizar tarefa:', error);
            res.status(500).json(createResponse(req, null, 'serverError', 500));
        }
    }

    async deleteTask(req, res) {
        try {
            const schema = z.object({
                id: z.string().min(1, 'ID é obrigatório').regex(/^\d+$/, 'ID deve ser um número')
            });
            
            const { id } = schema.parse(req.params);
            await taskService.deleteTask(parseInt(id));
            
            res.status(200).json(createResponse(req, null, 'taskDeleted'));
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json(createResponse(req, { errors: errorMessages }, 'validationError', 400));
            }
            
            if (error.message === 'Tarefa não encontrada') {
                return res.status(404).json(createResponse(req, null, 'taskNotFound', 404));
            }
            
            console.error('Erro ao excluir tarefa:', error);
            res.status(500).json(createResponse(req, null, 'serverError', 500));
        }
    }

    async getTasksByProject(req, res) {
        try {
            const schema = z.object({
                projectId: z.string().min(1, 'ID do projeto é obrigatório').regex(/^\d+$/, 'ID do projeto deve ser um número')
            });
            
            const { projectId } = schema.parse(req.params);
            const tasks = await taskService.getTasksByProject(parseInt(projectId));
            
            res.status(200).json(createResponse(req, tasks, 'tasks'));
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json(createResponse(req, { errors: errorMessages }, 'validationError', 400));
            }
            
            if (error.message === 'Projeto não encontrado') {
                return res.status(404).json(createResponse(req, null, 'projectNotFound', 404));
            }
            
            console.error('Erro ao buscar tarefas do projeto:', error);
            res.status(500).json(createResponse(req, null, 'serverError', 500));
        }
    }

    async getAllTasks(req, res) {
        try {
            const schema = z.object({
                page: z.string().optional().transform(val => val ? parseInt(val) : 1),
                limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
                status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
                priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
                projectId: z.string().optional().transform(val => val ? parseInt(val) : undefined)
            });
            
            const validatedQuery = schema.parse(req.query);
            const result = await taskService.getAllTasks(validatedQuery);
            
            res.status(200).json(createResponse(req, result, 'tasks'));
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json(createResponse(req, { errors: errorMessages }, 'validationError', 400));
            }
            
            console.error('Erro ao buscar tarefas:', error);
            res.status(500).json(createResponse(req, null, 'serverError', 500));
        }
    }
}

export default new TaskController();
