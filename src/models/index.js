import sequelize from '../config/database.js';
import { Project } from './project.model.js';

// Project.hasMany(OtherModel, { foreignKey: 'projectId' });

export const syncDatabase = async (force = false) => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        
        await sequelize.sync({ force, alter: !force });
        console.log('Sincronização do banco de dados concluída.');
        
        return true;
    } catch (error) {
        console.error('Erro ao conectar/sincronizar com o banco de dados:', error);
        throw error;
    }
};

export const closeDatabase = async () => {
    try {
        await sequelize.close();
        console.log('Conexão com o banco de dados fechada.');
    } catch (error) {
        console.error('Erro ao fechar conexão com o banco de dados:', error);
        throw error;
    }
};

export { Project };

export { sequelize };
