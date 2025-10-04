import express from "express";
import dotenv from "dotenv";
import { i18nMiddleware } from "./middlewares/i18n.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import routes from "./routes/index.js";
import { syncDatabase } from "./models/index.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nMiddleware);
app.use(generalLimiter);
app.use(routes);

const PORT = process.env.NODE_PORT;

const startServer = async () => {
    try {
        await syncDatabase();
        
        app.listen(PORT, () => {
            console.log(`Servidor rodando em ${process.env.NODE_ENV} na porta ${PORT}`);
            console.log(`Ambiente: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Erro ao inicializar servidor:', error);
        process.exit(1);
    }
};

startServer();