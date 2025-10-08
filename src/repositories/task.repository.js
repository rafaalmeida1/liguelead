import { BaseRepository } from './base.repository.js';
import { Task, Project } from '../models/index.js';

export class TaskRepository extends BaseRepository {
    constructor() {
        super(Task);
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async findByIdWithProject(id) {
        return await this.model.findByPk(id, {
            include: [{
                model: Project,
                as: 'project',
                attributes: ['id', 'name', 'status']
            }]
        });
    }

    async findAllWithProject(where = {}, options = {}) {
        return await this.model.findAndCountAll({
            where,
            include: [{
                model: Project,
                as: 'project',
                attributes: ['id', 'name', 'status']
            }],
            ...options
        });
    }

    async findByProjectId(projectId) {
        return await this.model.findAll({
            where: { projectId },
            include: [{
                model: Project,
                as: 'project',
                attributes: ['id', 'name', 'status']
            }],
            order: [['createdAt', 'DESC']]
        });
    }
}
