import { createResponse } from './i18n.js';

export const errorHandler = (err, req, res, next) => {
    console.error('Erro capturado pelo middleware:', err);

    // Erro de validação do Zod
    if (err.name === 'ZodError') {
        const errorMessages = err.errors.map(error => ({
            field: error.path.join('.'),
            message: error.message
        }));
        return res.status(400).json(createResponse(req, { errors: errorMessages }, 'validationError', 400));
    }

    // Erro de conexão com banco de dados
    if (err.name === 'SequelizeConnectionError') {
        return res.status(503).json(createResponse(req, null, 'databaseConnectionError', 503));
    }

    // Erro de validação do Sequelize
    if (err.name === 'SequelizeValidationError') {
        const errorMessages = err.errors.map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(400).json(createResponse(req, { errors: errorMessages }, 'validationError', 400));
    }

    // Erro de chave duplicada
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json(createResponse(req, null, 'duplicateKeyError', 409));
    }

    // Erro de chave estrangeira
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json(createResponse(req, null, 'foreignKeyError', 400));
    }

    // Erro de conexão com Redis
    if (err.message && err.message.includes('Redis')) {
        console.warn('Erro de conexão com Redis, continuando sem cache');
        return res.status(500).json(createResponse(req, null, 'cacheError', 500));
    }

    // Erro genérico
    return res.status(500).json(createResponse(req, null, 'serverError', 500));
};

export const notFoundHandler = (req, res) => {
    res.status(404).json(createResponse(req, null, 'notFound', 404));
};
