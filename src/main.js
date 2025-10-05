import express from "express";
import dotenv from "dotenv";
import { i18nMiddleware } from "./middlewares/i18n.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import routes from "./routes/index.route.js";
import { syncDatabase } from "./models/index.js";
import redisClient from "./config/redis.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nMiddleware);
app.use(generalLimiter);
app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.NODE_PORT;

const startServer = async () => {
    try {
        await redisClient.connect();
        
        await syncDatabase();
        
        app.listen(PORT, () => {
            console.log(`Servidor rodando em ${process.env.NODE_ENV} na porta ${PORT}`);
            console.log(`Ambiente: ${process.env.NODE_ENV}`);
            console.log('Redis conectado com sucesso');
        });
    } catch (error) {
        console.error('Erro ao inicializar servidor:', error);
        process.exit(1);
    }
};

startServer();