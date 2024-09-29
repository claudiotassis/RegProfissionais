# Sistema de Gerenciamento de Profissionais

## Descrição
Este projeto é um sistema de gerenciamento de profissionais que permite cadastrar, listar, editar e excluir informações de profissionais, incluindo suas qualificações. O sistema é composto por um backend Node.js com Express e Prisma ORM, e um frontend React com Next.js e Material-UI.

## Funcionalidades
- Cadastro de profissionais
- Listagem de profissionais com filtro e ordenação
- Edição de informações de profissionais
- Exclusão de profissionais
- Gerenciamento de qualificações dos profissionais

## Pré-requisitos
- Node.js (versão 14.x ou superior)
- npm (geralmente vem com Node.js)
- PostgreSQL (versão 12.x ou superior)

## Instalação

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2. Instalar dependências do backend
```bash
cd src/backend
npm install
```

### 3. Instalar dependências do frontend
```bash
cd ../frontend
npm install
```

### 4. Configurar o banco de dados
- Crie um banco de dados PostgreSQL para o projeto
- Copie o arquivo `.env.example` para `.env` no diretório `src/backend`
- Edite o arquivo `.env` e configure a variável `DATABASE_URL` com as informações do seu banco de dados:
  ```
  DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
  ```

### 5. Executar migrações do banco de dados
No diretório `src/backend`, execute:
```bash
npx prisma migrate dev
```

## Configuração

### Backend
1. No diretório `src/backend`, crie um arquivo `.env` se ainda não existir
2. Adicione as seguintes variáveis de ambiente:
   ```
   PORT=3001
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
   ```

### Frontend
1. No diretório `src/frontend`, crie um arquivo `.env.local` se ainda não existir
2. Adicione a seguinte variável de ambiente:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

## Executando o projeto

### Backend
No diretório `src/backend`, execute:
```bash
npm start
```

O servidor backend estará rodando em `http://localhost:3001`.

### Frontend
No diretório `src/frontend`, execute:
```bash
npm run dev
```

O aplicativo frontend estará disponível em `http://localhost:3000`.

## Uso
1. Acesse `http://localhost:3000` no seu navegador
2. Faça login (use as credenciais padrão ou crie um novo usuário)
3. Use o sistema para gerenciar profissionais:
   - Cadastre novos profissionais
   - Liste, filtre e ordene profissionais
   - Edite informações dos profissionais
   - Exclua profissionais


## Tecnologias Utilizadas
- Backend:
  - Node.js
  - Express
  - Prisma ORM
  - PostgreSQL
- Frontend:
  - React
  - Next.js
  - Material-UI