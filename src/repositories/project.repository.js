import { BaseRepository } from './base.repository.js';
import { Project, Task } from '../models/index.js';

export class ProjectRepository extends BaseRepository {
    constructor() {
        super(Project);
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async findByIdWithTasks(id) {
        return await this.model.findByPk(id, {
            include: [{
                model: Task,
                as: 'tasks',
                required: false
            }]
        });
    }

    async findAllWithTasks(where = {}, options = {}) {
        return await this.model.findAndCountAll({
            where,
            include: [{
                model: Task,
                as: 'tasks',
                required: false,
                attributes: ['id', 'title', 'status', 'priority', 'dueDate', 'createdAt', 'updatedAt']
            }],
            distinct: true,
            ...options
        });
    }
}
