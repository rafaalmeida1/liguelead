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
        const [affectedRows] = await this.model.update(data, {
            where: { id }
        });
        
        if (affectedRows === 0) {
            throw new Error('Registro não encontrado');
        }
        
        return await this.model.findByPk(id);
    }

    async delete(id) {
        const deletedRows = await this.model.destroy({
            where: { id }
        });
        
        if (deletedRows === 0) {
            throw new Error('Registro não encontrado');
        }
        
        return true;
    }

    async count(where = {}) {
        return await this.model.count({ where });
    }
}
