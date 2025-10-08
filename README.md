# LigueLead - Sistema de Gerenciamento de Projetos e Tarefas

Sistema completo de gerenciamento de projetos e tarefas com cache Redis profissional, desenvolvido em Node.js + Express + MySQL + Sequelize.

## 🚀 Execução Rápida com Docker Compose

### Pré-requisitos
- Docker
- Docker Compose

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd liguelead
```

### 2. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env-example .env

# Edite o arquivo .env se necessário (opcional)
nano .env
```

### 3. Execute o projeto
```bash
# Iniciar todos os serviços (aplicação + banco + cache + documentação)
docker-compose up app-dev mysql redis docs

# Ou em background
docker-compose up -d app-dev mysql redis docs
```

### 4. Acesse a aplicação
- **API**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api-docs (Teste interativo da API)
- **Documentação**: http://localhost:3001 (Mintlify)
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

## 🛠️ Comandos Úteis

### Gerenciamento de Containers
```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (limpar dados)
docker-compose down -v

# Ver logs em tempo real
docker-compose logs -f app-dev

# Ver logs de todos os serviços
docker-compose logs -f
```

### Desenvolvimento
```bash
# Rebuild da aplicação após mudanças
docker-compose up --build app-dev mysql redis

# Executar comandos dentro do container
docker-compose exec app-dev npm install
docker-compose exec app-dev npm run test
```

## 📋 Endpoints da API

### Projetos
```http
POST   /projects              # Criar projeto
GET    /projects              # Listar projetos
GET    /projects/:id          # Buscar projeto
PUT    /projects/:id          # Atualizar projeto
DELETE /projects/:id          # Excluir projeto
```

### Tarefas
```http
POST   /projects/:id/tasks     # Criar tarefa
GET    /tasks                 # Listar tarefas
GET    /tasks/:id             # Buscar tarefa
PUT    /tasks/:id             # Atualizar tarefa
DELETE /tasks/:id             # Excluir tarefa
GET    /projects/:id/tasks    # Tarefas do projeto
```

## 📚 Documentação e Testes

O projeto inclui **duas formas** de documentação e teste da API:

### 🔧 Swagger UI (Teste Direto da API)
- **URL**: http://localhost:3000/api-docs
- **Funcionalidade**: Teste interativo direto da API
- **Vantagem**: Testa a API real em tempo real
- **Uso**: Ideal para desenvolvedores testarem endpoints

### 📖 Mintlify (Documentação Completa)
- **URL**: http://localhost:3001
- **Funcionalidade**: Documentação completa e interativa
- **Vantagem**: Interface moderna com exemplos em múltiplas linguagens
- **Uso**: Ideal para documentação e onboarding

### Acessar Documentação

```bash
# Iniciar apenas a documentação
docker-compose up docs

# Ou iniciar tudo junto
docker-compose up app-dev mysql redis docs
```

Acesse: **http://localhost:3001**

### Comandos de Documentação

```bash
# Gerar arquivo OpenAPI a partir das rotas
npm run docs:generate

# Executar documentação em modo desenvolvimento
npm run docs:dev

# Build da documentação para produção
npm run docs:build
```

### Estrutura da Documentação

```
docs/
├── mint.json              # Configuração do Mintlify
├── openapi.yaml           # Especificação OpenAPI (gerada automaticamente)
├── introduction.mdx       # Página de introdução
├── quickstart.mdx         # Guia de início rápido
└── api-reference/         # Referência da API
    ├── projects.mdx       # Documentação de projetos
    └── tasks.mdx          # Documentação de tarefas
```

## 🧪 Testando a API

### Criar um projeto
```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meu Projeto",
    "description": "Descrição do projeto"
  }'
```

### Listar projetos
```bash
curl http://localhost:3000/projects
```

### Criar uma tarefa
```bash
curl -X POST http://localhost:3000/projects/1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Minha Tarefa",
    "description": "Descrição da tarefa",
    "priority": "high"
  }'
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente (.env)
```env
# Servidor
NODE_PORT=3000
NODE_ENV=development

# MySQL
MYSQL_ROOT_PASSWORD=root
DB_HOST=mysql
DB_PORT=3306
DB_NAME=liguelead
DB_USER=liguelead_user
DB_PASSWORD=liguelead_password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis_password
```

### Serviços Disponíveis
- **app-dev**: Aplicação Node.js em modo desenvolvimento
- **docs**: Documentação interativa com Mintlify
- **mysql**: Banco de dados MySQL 8.0
- **redis**: Cache Redis 7

## 🏗️ Arquitetura

### Camadas
- **Controllers** → Validação de entrada e controle de fluxo
- **Services** → Lógica de negócio e cache
- **Repositories** → Acesso aos dados (Sequelize)
- **Models** → Definição das entidades

### Cache Redis
- **TTL de 10 minutos** para todos os dados em cache
- **Invalidação inteligente** quando dados são modificados
- **Fallback graceful** se Redis estiver indisponível

## 🛠️ Tecnologias

- **Node.js** (>=22.0.0)
- **Express.js** - Framework web
- **MySQL** - Banco de dados
- **Sequelize** - ORM
- **Redis** - Cache
- **Zod** - Validação de dados
- **Express Rate Limit** - Controle de taxa

## 📊 Modelos de Dados

### Project
```javascript
{
  id: INTEGER (PK, Auto Increment),
  name: STRING (NOT NULL),
  description: STRING (NOT NULL),
  status: ENUM('active', 'inactive') DEFAULT 'active',
  createdAt: DATE,
  updatedAt: DATE
}
```

### Task
```javascript
{
  id: INTEGER (PK, Auto Increment),
  title: STRING (NOT NULL),
  description: TEXT,
  status: ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  priority: ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  dueDate: DATE,
  projectId: INTEGER (FK to projects.id),
  createdAt: DATE,
  updatedAt: DATE
}
```

## 🔒 Segurança

- **Rate Limiting** - Controle de taxa de requisições
- **Validação rigorosa** - Todos os inputs são validados
- **Sanitização** - Dados são sanitizados antes do processamento
- **Tratamento de erros** - Não exposição de informações sensíveis

## 📈 Performance

- **Cache Redis** - Reduz consultas ao banco de dados
- **Paginação** - Listas paginadas para melhor performance
- **Índices de banco** - Otimização de consultas
- **Connection pooling** - Gerenciamento eficiente de conexões

## 🚨 Solução de Problemas

### MySQL não inicia
```bash
# Limpar volumes e recriar
docker-compose down -v
docker-compose up mysql
```

### Aplicação não conecta ao banco
```bash
# Verificar se MySQL está rodando
docker-compose ps

# Ver logs do MySQL
docker-compose logs mysql
```

### Redis não conecta
```bash
# Verificar logs do Redis
docker-compose logs redis

# Testar conexão Redis
docker-compose exec redis redis-cli ping
```

## 📝 Logs

O sistema registra:
- Conexões com banco de dados e Redis
- Erros de validação e sistema
- Operações de cache (hit/miss)
- Requisições HTTP

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.