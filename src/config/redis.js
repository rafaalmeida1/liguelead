import { createClient } from 'redis';

class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;
            
            this.client = createClient({
                url: redisUrl,
                retry_strategy: (options) => {
                    if (options.error && options.error.code === 'ECONNREFUSED') {
                        console.error('Redis server connection refused');
                        return new Error('Redis server connection refused');
                    }
                    if (options.total_retry_time > 1000 * 60 * 60) {
                        console.error('Redis retry time exhausted');
                        return new Error('Redis retry time exhausted');
                    }
                    if (options.attempt > 10) {
                        console.error('Redis max retry attempts reached');
                        return undefined;
                    }
                    return Math.min(options.attempt * 100, 3000);
                }
            });

            this.client.on('error', (err) => {
                console.error('Redis Client Error:', err);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('Redis Client Connected');
                this.isConnected = true;
            });

            this.client.on('ready', () => {
                console.log('Redis Client Ready');
                this.isConnected = true;
            });

            this.client.on('end', () => {
                console.log('Redis Client Disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
            return this.client;
        } catch (error) {
            console.error('Erro ao conectar com Redis:', error);
            this.isConnected = false;
            throw error;
        }
    }

    async disconnect() {
        if (this.client && this.isConnected) {
            await this.client.quit();
            this.isConnected = false;
        }
    }

    async get(key) {
        if (!this.isConnected || !this.client) {
            return null;
        }
        try {
            const value = await this.client.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Erro ao buscar no Redis:', error);
            return null;
        }
    }

    async set(key, value, ttlSeconds = 600) { // 10 minutos por padrão
        if (!this.isConnected || !this.client) {
            return false;
        }
        try {
            await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no Redis:', error);
            return false;
        }
    }

    async del(key) {
        if (!this.isConnected || !this.client) {
            return false;
        }
        try {
            await this.client.del(key);
            return true;
        } catch (error) {
            console.error('Erro ao deletar do Redis:', error);
            return false;
        }
    }

    async delPattern(pattern) {
        if (!this.isConnected || !this.client) {
            return false;
        }
        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
            }
            return true;
        } catch (error) {
            console.error('Erro ao deletar padrão do Redis:', error);
            return false;
        }
    }

    async exists(key) {
        if (!this.isConnected || !this.client) {
            return false;
        }
        try {
            const result = await this.client.exists(key);
            return result === 1;
        } catch (error) {
            console.error('Erro ao verificar existência no Redis:', error);
            return false;
        }
    }

    // Métodos específicos para cache de projetos e tarefas
    generateProjectKey(id) {
        return `project:${id}`;
    }

    generateProjectsListKey(filters = {}) {
        const filterString = Object.keys(filters).length > 0 
            ? `:${JSON.stringify(filters)}` 
            : '';
        return `projects:list${filterString}`;
    }

    generateTaskKey(id) {
        return `task:${id}`;
    }

    generateProjectTasksKey(projectId) {
        return `project:${projectId}:tasks`;
    }

    async invalidateProjectCache(projectId) {
        const keys = [
            this.generateProjectKey(projectId),
            this.generateProjectsListKey(),
            this.generateProjectTasksKey(projectId)
        ];
        
        for (const key of keys) {
            await this.del(key);
        }
        
        // Invalidar todas as listas de projetos com filtros
        await this.delPattern('projects:list:*');
    }

    async invalidateTaskCache(taskId, projectId) {
        const keys = [
            this.generateTaskKey(taskId),
            this.generateProjectTasksKey(projectId)
        ];
        
        for (const key of keys) {
            await this.del(key);
        }
    }
}

export default new RedisClient();