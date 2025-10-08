import { ProjectRepository } from '../repositories/project.repository.js';
import { TaskRepository } from '../repositories/task.repository.js';
import redisClient from '../config/redis.js';
import { Op } from 'sequelize';

class ProjectService {
    constructor() {
        this.projectRepository = new ProjectRepository();
        this.taskRepository = new TaskRepository();
    }

    async createProject(projectData) {
        try {
            const project = await this.projectRepository.create(projectData);
            
            await redisClient.delPattern('projects:list*');
            
            return project;
        } catch (error) {
            throw new Error(`Erro ao criar projeto: ${error.message}`);
        }
    }

    async getProjectById(id) {
        try {
            const cacheKey = redisClient.generateProjectKey(id);
            
            const cachedProject = await redisClient.get(cacheKey);
            if (cachedProject) {
                return cachedProject;
            }

            const project = await this.projectRepository.findByIdWithTasks(id);

            if (!project) {
                throw new Error('Projeto não encontrado');
            }

            await redisClient.set(cacheKey, project, 600);

            return project;
        } catch (error) {
            if (error.message === 'Projeto não encontrado') {
                throw error;
            }
            throw new Error(`Erro ao buscar projeto: ${error.message}`);
        }
    }

    async getProjects(filters = {}) {
        try {
            const cacheKey = redisClient.generateProjectsListKey(filters);
            
            const cachedProjects = await redisClient.get(cacheKey);
            if (cachedProjects) {
                return cachedProjects;
            }

            const { page = 1, limit = 10, name, description, status, initialDate, finalDate } = filters;
            const offset = (page - 1) * limit;

            const whereConditions = {};
            
            if (name) {
                whereConditions.name = {
                    [Op.like]: `%${name}%`
                };
            }
            
            if (description) {
                whereConditions.description = {
                    [Op.like]: `%${description}%`
                };
            }
            
            if (status) {
                whereConditions.status = status;
            }
            
            if (initialDate && finalDate) {
                whereConditions.createdAt = {
                    [Op.between]: [new Date(initialDate), new Date(finalDate)]
                };
            }

            const { count, rows: projects } = await this.projectRepository.findAllWithTasks(whereConditions, {
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });

            const result = {
                projects,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };

            await redisClient.set(cacheKey, result, 600);

            return result;
        } catch (error) {
            throw new Error(`Erro ao buscar projetos: ${error.message}`);
        }
    }

    async updateProject(id, updateData) {
        try {
            const project = await this.projectRepository.update(id, updateData);
            
            await redisClient.invalidateProjectCache(id);

            return project;
        } catch (error) {
            if (error.message === 'Registro não encontrado') {
                throw new Error('Projeto não encontrado');
            }
            throw new Error(`Erro ao atualizar projeto: ${error.message}`);
        }
    }

    async deleteProject(id) {
        try {
            const tasksCount = await this.taskRepository.count({ projectId: id });

            if (tasksCount > 0) {
                throw new Error('Não é possível excluir projeto que possui tarefas vinculadas');
            }

            await this.projectRepository.delete(id);
            
            await redisClient.invalidateProjectCache(id);

            return true;
        } catch (error) {
            if (error.message === 'Registro não encontrado') {
                throw new Error('Projeto não encontrado');
            }
            if (error.message.includes('tarefas vinculadas')) {
                throw error;
            }
            throw new Error(`Erro ao excluir projeto: ${error.message}`);
        }
    }

    async getProjectTasks(projectId) {
        try {
            const cacheKey = redisClient.generateProjectTasksKey(projectId);
            
            const cachedTasks = await redisClient.get(cacheKey);
            if (cachedTasks) {
                return cachedTasks;
            }

            const project = await this.projectRepository.findById(projectId);
            if (!project) {
                throw new Error('Projeto não encontrado');
            }

            const tasks = await this.taskRepository.findByProjectId(projectId);

            await redisClient.set(cacheKey, tasks, 600);

            return tasks;
        } catch (error) {
            if (error.message === 'Projeto não encontrado') {
                throw error;
            }
            throw new Error(`Erro ao buscar tarefas do projeto: ${error.message}`);
        }
    }
}
export default new ProjectService();

