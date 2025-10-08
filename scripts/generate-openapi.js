import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LigueLead API',
      version: '1.0.0',
      description: 'Sistema completo de gerenciamento de projetos e tarefas com cache Redis profissional',
      contact: {
        name: 'Suporte LigueLead',
        email: 'suporte@liguelead.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
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
    ],
    components: {
      schemas: {
        Project: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do projeto',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Nome do projeto',
              example: 'Sistema de Vendas'
            },
            description: {
              type: 'string',
              description: 'Descrição do projeto',
              example: 'Desenvolvimento de sistema completo de vendas online'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              default: 'active',
              description: 'Status do projeto'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização'
            }
          }
        },
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da tarefa',
              example: 1
            },
            title: {
              type: 'string',
              description: 'Título da tarefa',
              example: 'Implementar autenticação'
            },
            description: {
              type: 'string',
              description: 'Descrição da tarefa',
              example: 'Desenvolver sistema de login e registro'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'cancelled'],
              default: 'pending',
              description: 'Status da tarefa'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              default: 'medium',
              description: 'Prioridade da tarefa'
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: 'Data de vencimento',
              example: '2024-02-15'
            },
            projectId: {
              type: 'integer',
              description: 'ID do projeto associado',
              example: 1
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Projeto não encontrado'
            },
            status: {
              type: 'integer',
              description: 'Código de status HTTP',
              example: 404
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../src/routes/*.js')
  ]
};

try {
  const openapiSpec = swaggerJSDoc(options);
  
  // Garantir que a pasta docs existe
  const docsDir = path.join(__dirname, '../docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  // Salvar o arquivo OpenAPI
  const outputPath = path.join(docsDir, 'openapi.yaml');
  fs.writeFileSync(outputPath, JSON.stringify(openapiSpec, null, 2));
  
  console.log('Arquivo OpenAPI gerado com sucesso em:', outputPath);
} catch (error) {
  console.error('Erro ao gerar arquivo OpenAPI:', error);
  process.exit(1);
}
