import { createClient } from 'redis';

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

redisClient.on('error', (err) => {
  console.error('Erro ao conectar ao Redis:', err);
});

redisClient.on('connect', () => {
  console.log('Redis conectado com sucesso');
});

export default redisClient;
