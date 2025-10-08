import express from "express";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { i18nMiddleware } from "./middlewares/i18n.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import routes from "./routes/index.route.js";
import { syncDatabase } from "./models/index.js";
import redisClient from "./config/redis.js";
dotenv.config();

const app = express();

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LigueLead API',
      version: '1.0.0',
      description: 'Sistema completo de gerenciamento de projetos e tarefas',
      contact: {
        name: 'Suporte',
        email: 'rafaprof312@gmail.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.NODE_PORT}`,
        description: 'Servidor de desenvolvimento'
      }
    ],
    tags: [
      {
        name: 'Projetos',
        description: 'Endpoints para gerenciamento de projetos'
      },
      {
        name: 'Tarefas',
        description: 'Endpoints para gerenciamento de tarefas'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nMiddleware);
app.use(generalLimiter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'LigueLead API Documentation'
}));

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