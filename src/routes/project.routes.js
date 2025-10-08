import express from 'express';
import ProjectController from '../controllers/project.controller.js';
import { projectLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Criar um novo projeto
 *     tags: [Projetos]
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [pt, en, es]
 *           default: pt
 *         description: Idioma da resposta (pt=Português, en=English, es=Español)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do projeto
 *                 example: "Sistema de Vendas"
 *               description:
 *                 type: string
 *                 description: Descrição do projeto
 *                 example: "Desenvolvimento de sistema completo de vendas online"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *                 description: Status do projeto
 *     responses:
 *       201:
 *         description: Projeto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Sistema de Vendas"
 *                 description:
 *                   type: string
 *                   example: "Desenvolvimento de sistema completo de vendas online"
 *                 status:
 *                   type: string
 *                   example: "active"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/projects', projectLimiter, ProjectController.createProject);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Listar todos os projetos
 *     tags: [Projetos]
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [pt, en, es]
 *           default: pt
 *         description: Idioma da resposta (pt=Português, en=English, es=Español)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página (começa em 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de itens por página (máximo 100)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nome do projeto
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filtrar por descrição do projeto
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filtrar por status do projeto
 *       - in: query
 *         name: initialDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtro (formato YYYY-MM-DD)
 *       - in: query
 *         name: finalDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtro (formato YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de projetos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Projetos listados com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     projects:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Sistema de Vendas"
 *                           description:
 *                             type: string
 *                             example: "Desenvolvimento de sistema completo de vendas online"
 *                           status:
 *                             type: string
 *                             example: "active"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           tasks:
 *                             type: array
 *                             items:
 *                               type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 25
 *                         totalPages:
 *                           type: integer
 *                           example: 3
 *                 language:
 *                   type: string
 *                   example: "pt-BR"
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/projects', ProjectController.getProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Buscar projeto por ID
 *     tags: [Projetos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
 *         example: 1
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [pt, en, es]
 *           default: pt
 *         description: Idioma da resposta (pt=Português, en=English, es=Español)
 *     responses:
 *       200:
 *         description: Projeto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Sistema de Vendas"
 *                 description:
 *                   type: string
 *                   example: "Desenvolvimento de sistema completo de vendas online"
 *                 status:
 *                   type: string
 *                   example: "active"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Projeto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/projects/:id', ProjectController.getProjectById);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Atualizar projeto
 *     tags: [Projetos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
 *         example: 1
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [pt, en, es]
 *           default: pt
 *         description: Idioma da resposta (pt=Português, en=English, es=Español)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do projeto
 *                 example: "Sistema de Vendas Atualizado"
 *               description:
 *                 type: string
 *                 description: Descrição do projeto
 *                 example: "Descrição atualizada do projeto"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: Status do projeto
 *                 example: "inactive"
 *     responses:
 *       200:
 *         description: Projeto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Sistema de Vendas Atualizado"
 *                 description:
 *                   type: string
 *                   example: "Descrição atualizada do projeto"
 *                 status:
 *                   type: string
 *                   example: "inactive"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Projeto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/projects/:id', projectLimiter,ProjectController.updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Excluir projeto
 *     tags: [Projetos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
 *         example: 1
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [pt, en, es]
 *           default: pt
 *         description: Idioma da resposta (pt=Português, en=English, es=Español)
 *     responses:
 *       200:
 *         description: Projeto excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Projeto excluído com sucesso"
 *       404:
 *         description: Projeto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/projects/:id', ProjectController.deleteProject);

export default router;