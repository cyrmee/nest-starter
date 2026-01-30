# NestJS Starter Project

## Prerequisites
- Node.js
- pnpm
- Docker and Docker Compose

## Setup
1. Clone the repository.
2. Copy `.env.example` to `.env` and configure environment variables (database credentials, etc.).
3. Start the database and Redis:
   ```bash
   docker compose up -d
   ```
4. Install dependencies:
   ```bash
   pnpm install
   ```
5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
6. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
7. Start the application:
   ```bash
   pnpm dev
   ```

## Available Scripts
- `pnpm dev` - Start in development mode
- `pnpm build` - Build the project
- `pnpm test` - Run tests
- `pnpm db:reset` - Reset database and seed
- `pnpm db:reset` - Reset database and seed