import express from 'express';
import TaskController from '../controllers/task.controller.js';
import { taskLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   post:
 *     summary: Criar nova tarefa em um projeto
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título da tarefa
 *                 example: "Implementar autenticação"
 *               description:
 *                 type: string
 *                 description: Descrição da tarefa
 *                 example: "Desenvolver sistema de login e registro"
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *                 default: pending
 *                 description: Status da tarefa
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 default: medium
 *                 description: Prioridade da tarefa
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Data de vencimento
 *                 example: "2025-10-07"
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Implementar autenticação"
 *                 description:
 *                   type: string
 *                   example: "Desenvolver sistema de login e registro"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *                 priority:
 *                   type: string
 *                   example: "high"
 *                 dueDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-02-15"
 *                 projectId:
 *                   type: integer
 *                   example: 1
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
router.post('/projects/:projectId/tasks', taskLimiter, TaskController.createTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Listar todas as tarefas
 *     tags: [Tarefas]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *         description: Filtrar por status da tarefa
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         description: Filtrar por prioridade da tarefa
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do projeto
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
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
 *                   example: "Tarefas listadas com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: "Implementar autenticação"
 *                           description:
 *                             type: string
 *                             example: "Desenvolver sistema de login e registro"
 *                           status:
 *                             type: string
 *                             example: "pending"
 *                           priority:
 *                             type: string
 *                             example: "high"
 *                           dueDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-10-07T00:00:00.000Z"
 *                           projectId:
 *                             type: integer
 *                             example: 1
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           project:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               status:
 *                                 type: string
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
router.get('/tasks', TaskController.getAllTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Buscar tarefa por ID
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
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
 *         description: Tarefa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Implementar autenticação"
 *                 description:
 *                   type: string
 *                   example: "Desenvolver sistema de login e registro"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *                 priority:
 *                   type: string
 *                   example: "high"
 *                 dueDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-02-15"
 *                 projectId:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tasks/:id', TaskController.getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Atualizar tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
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
 *               title:
 *                 type: string
 *                 description: Título da tarefa
 *                 example: "Implementar autenticação JWT"
 *               description:
 *                 type: string
 *                 description: Descrição da tarefa
 *                 example: "Desenvolver sistema de login com JWT"
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *                 description: Status da tarefa
 *                 example: "in_progress"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 description: Prioridade da tarefa
 *                 example: "urgent"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Data de vencimento
 *                 example: "2025-10-07"
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Implementar autenticação JWT"
 *                 description:
 *                   type: string
 *                   example: "Desenvolver sistema de login com JWT"
 *                 status:
 *                   type: string
 *                   example: "in_progress"
 *                 priority:
 *                   type: string
 *                   example: "urgent"
 *                 dueDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-02-20"
 *                 projectId:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/tasks/:id', taskLimiter, TaskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Excluir tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
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
 *         description: Tarefa excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tarefa excluída com sucesso"
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/tasks/:id', TaskController.deleteTask);

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   get:
 *     summary: Listar tarefas de um projeto
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *         description: Lista de tarefas do projeto retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Implementar autenticação"
 *                   description:
 *                     type: string
 *                     example: "Desenvolver sistema de login e registro"
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   priority:
 *                     type: string
 *                     example: "high"
 *                   dueDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-02-15"
 *                   projectId:
 *                     type: integer
 *                     example: 1
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Projeto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/projects/:projectId/tasks', TaskController.getTasksByProject);

export default router;
