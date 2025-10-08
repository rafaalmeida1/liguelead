import { TaskRepository } from '../repositories/task.repository.js';
import { ProjectRepository } from '../repositories/project.repository.js';
import redisClient from '../config/redis.js';

class TaskService {
    constructor() {
        this.taskRepository = new TaskRepository();
        this.projectRepository = new ProjectRepository();
    }

    async createTask(taskData) {
        try {
            const project = await this.projectRepository.findById(taskData.projectId);
            if (!project) {
                throw new Error('Projeto não encontrado');
            }

            const task = await this.taskRepository.create(taskData);
            
            await redisClient.invalidateTaskCache(null, taskData.projectId);
            
            return task;
        } catch (error) {
            if (error.message === 'Projeto não encontrado') {
                throw error;
            }
            throw new Error(`Erro ao criar tarefa: ${error.message}`);
        }
    }

    async getTaskById(id) {
        try {
            const cacheKey = redisClient.generateTaskKey(id);
            
            const cachedTask = await redisClient.get(cacheKey);
            if (cachedTask) {
                return cachedTask;
            }

            const task = await this.taskRepository.findByIdWithProject(id);

            if (!task) {
                throw new Error('Tarefa não encontrada');
            }

            await redisClient.set(cacheKey, task, 600);

            return task;
        } catch (error) {
            if (error.message === 'Tarefa não encontrada') {
                throw error;
            }
            throw new Error(`Erro ao buscar tarefa: ${error.message}`);
        }
    }

    async updateTask(id, updateData) {
        try {
            const task = await this.taskRepository.findById(id);
            
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }

            if (updateData.projectId && updateData.projectId !== task.projectId) {
                const project = await this.projectRepository.findById(updateData.projectId);
                if (!project) {
                    throw new Error('Projeto de destino não encontrado');
                }
            }

            const updatedTask = await this.taskRepository.update(id, updateData);
            
            await redisClient.invalidateTaskCache(id, task.projectId);
            
            if (updateData.projectId && updateData.projectId !== task.projectId) {
                await redisClient.invalidateTaskCache(null, task.projectId);
            }

            return updatedTask;
        } catch (error) {
            if (error.message === 'Tarefa não encontrada' || error.message === 'Projeto de destino não encontrado') {
                throw error;
            }
            throw new Error(`Erro ao atualizar tarefa: ${error.message}`);
        }
    }

    async deleteTask(id) {
        try {
            const task = await this.taskRepository.findById(id);
            
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }

            const projectId = task.projectId;
            await this.taskRepository.delete(id);
            
            await redisClient.invalidateTaskCache(id, projectId);

            return true;
        } catch (error) {
            if (error.message === 'Tarefa não encontrada') {
                throw error;
            }
            throw new Error(`Erro ao excluir tarefa: ${error.message}`);
        }
    }

    async getTasksByProject(projectId) {
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

    async getAllTasks(filters = {}) {
        try {
            const { page = 1, limit = 10, status, priority, projectId } = filters;
            const offset = (page - 1) * limit;

            const whereConditions = {};
            
            if (status) {
                whereConditions.status = status;
            }
            
            if (priority) {
                whereConditions.priority = priority;
            }
            
            if (projectId) {
                whereConditions.projectId = projectId;
            }

            const { count, rows: tasks } = await this.taskRepository.findAllWithProject(whereConditions, {
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });

            return {
                tasks,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw new Error(`Erro ao buscar tarefas: ${error.message}`);
        }
    }
}

export default new TaskService();
