export class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return await this.model.create(data);
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async findByIdWithIncludes(id, includes = []) {
        return await this.model.findByPk(id, {
            include: includes
        });
    }

    async findAll(where = {}, options = {}) {
        return await this.model.findAll({
            where,
            ...options
        });
    }

    async findAndCountAll(where = {}, options = {}) {
        return await this.model.findAndCountAll({
            where,
            ...options
        });
    }

    async update(id, data) {
        const record = await this.model.findByPk(id);
        if (!record) {
            throw new Error('Registro não encontrado');
        }
        return await record.update(data);
    }

    async delete(id) {
        const record = await this.model.findByPk(id);
        if (!record) {
            throw new Error('Registro não encontrado');
        }
        return await record.destroy();
    }

    async count(where = {}) {
        return await this.model.count({ where });
    }
}
