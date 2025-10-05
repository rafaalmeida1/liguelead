import { createResponse } from '../middlewares/i18n.js';
import projectService from '../services/project.service.js';
import { z } from 'zod';

class ProjectController {
    async createProject(req, res) {
        try {
            const schema = z.object({
                name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome deve ter no máximo 255 caracteres'),
                description: z.string().min(1, 'Descrição é obrigatória').max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
                status: z.enum(['active', 'inactive']).optional()
            });
            
            const validatedData = schema.parse(req.body);
            const project = await projectService.createProject(validatedData);
            
            res.status(201).json(createResponse(req, project, 'projectCreated'));
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json(createResponse(req, { errors: errorMessages }, 'validationError', 400));
            }
            
            console.error('Erro ao criar projeto:', error);
            res.status(500).json(createResponse(req, null, 'serverError', 500));
        }
    }
    async getProjects(req, res) {
        try {
            const schema = z.object({
                page: z.string().optional().transform(val => val ? parseInt(val) : 1),
                limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
                name: z.string().optional(),
                description: z.string().optional(),
                status: z.enum(['active', 'inactive']).optional(),
                initialDate: z.string().optional(),
                finalDate: z.string().optional()
            });
            
            const validatedQuery = schema.parse(req.query);
            const result = await projectService.getProjects(validatedQuery);
            
            res.status(200).json(createResponse(req, result, 'projects'));
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json(createResponse(req, { errors: errorMessages }, 'validationError', 400));
            }
            
            console.error('Erro ao buscar projetos:', error);
            res.status(500).json(createResponse(req, null, 'serverError', 500));
        }
    }
    async getProjectById(req, res) {
        try {
            const schema = z.object({
                id: z.string().min(1, 'ID é obrigatório').regex(/^\d+$/, 'ID deve ser um número')
            });
            
            const { id } = schema.parse(req.params);
            const project = await projectService.getProjectById(parseInt(id));
            
            res.status(200).json(createResponse(req, project, 'project'));
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
            
            console.error('Erro ao buscar projeto:', error);
            res.status(500).json(createResponse(req, null, 'serverError', 500));
        }
    }
    async updateProject(req, res) {
        try {
            const paramsSchema = z.object({
                id: z.string().min(1, 'ID é obrigatório').regex(/^\d+$/, 'ID deve ser um número')
            });
            
            const bodySchema = z.object({
                name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome deve ter no máximo 255 caracteres'),
                description: z.string().min(1, 'Descrição é obrigatória').max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
                status: z.enum(['active', 'inactive']).optional()
            });
            
            const { id } = paramsSchema.parse(req.params);
            const validatedData = bodySchema.parse(req.body);
            
            const project = await projectService.updateProject(parseInt(id), validatedData);
            
            res.status(200).json(createResponse(req, project, 'project'));
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
            
            console.error('Erro ao atualizar projeto:', error);
            res.status(500).json(createResponse(req, null, 'serverError', 500));
        }
    }
    async deleteProject(req, res) {
        try {
            const schema = z.object({
                id: z.string().min(1, 'ID é obrigatório').regex(/^\d+$/, 'ID deve ser um número')
            });
            
            const { id } = schema.parse(req.params);
            await projectService.deleteProject(parseInt(id));
            
            res.status(200).json(createResponse(req, null, 'projectDeleted'));
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
            
            if (error.message.includes('tarefas vinculadas')) {
                return res.status(409).json(createResponse(req, null, 'projectHasTasks', 409));
            }
            
            console.error('Erro ao excluir projeto:', error);
            res.status(500).json(createResponse(req, null, 'serverError', 500));
        }
    }
}

export default new ProjectController();