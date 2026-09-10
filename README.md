# Git Workflow & Commit Convention

## Branch Strategy (GitFlow)

This project follows a simplified GitFlow structure to organize development, testing, and production releases.

### Main Branches

| Branch      | Purpose                   |
| ----------- | ------------------------- |
| `main`      | Production-ready code     |
| `dev`       | Main development branch   |
| `feature/*` | New features              |
| `fix/*`     | Bug fixes                 |
| `hotfix/*`  | Critical production fixes |
| `release/*` | Release preparation       |

---

## Workflow

### 1. Create a Feature Branch

Every new functionality must start from `dev`.

```bash
git checkout dev
git pull origin dev

git checkout -b feature/create-attendance-list
```

### 2. Develop and Commit

Use standardized commits in English.

Example:

```bash
git commit -m "feat: add QR code attendance validation"
```

### 3. Push the Branch

```bash
git push origin feature/create-attendance-list
```

### 4. Open a Pull Request

* Target branch: `dev`
* Describe:

  * What was implemented
  * Why it was necessary
  * Possible impacts
  * Screenshots/examples if applicable

### 5. Merge Process

After approval:

```bash
feature/* -> dev
```

---

# Release Flow

When preparing a production version:

```bash
git checkout dev
git checkout -b release/v1.0.0
```

After validation:

```bash
release/v1.0.0 -> main
release/v1.0.0 -> dev
```

---

# Hotfix Flow

For urgent production bugs:

```bash
git checkout main
git checkout -b hotfix/fix-auth-token
```

After fixing:

```bash
hotfix/* -> main
hotfix/* -> dev
```

---

# Commit Convention (Conventional Commits)

This project uses the Conventional Commits standard.

## Commit Structure

```text
type(scope): description
```

Example:

```text
feat(auth): add JWT refresh token validation
```

---

# Commit Types

| Type       | Description                               |
| ---------- | ----------------------------------------- |
| `feat`     | New feature                               |
| `fix`      | Bug fix                                   |
| `docs`     | Documentation changes                     |
| `style`    | Formatting/style changes                  |
| `refactor` | Code refactoring without behavior changes |
| `perf`     | Performance improvements                  |
| `test`     | Adding/updating tests                     |
| `build`    | Build system or dependencies              |
| `ci`       | CI/CD configuration                       |
| `chore`    | Maintenance tasks                         |

---

# Commit Examples

## Features

```bash
git commit -m "feat(class): add class creation endpoint"
```

```bash
git commit -m "feat(qrcode): generate unique attendance tokens"
```

---

## Fixes

```bash
git commit -m "fix(auth): prevent expired token access"
```

```bash
git commit -m "fix(attendance): validate duplicated registration number"
```

---

## Documentation

```bash
git commit -m "docs(readme): update API setup instructions"
```

---

## Refactor

```bash
git commit -m "refactor(prisma): simplify attendance query"
```

---

# Recommended Rules

* Keep commits small and focused.
* Avoid generic commits like:

```text
update stuff
fix bug
changes
```

* Prefer clear and objective messages.
* Write commits in lowercase.
* Use English for all branches, commits, and pull requests.

---

# Branch Naming Examples

```text
feature/create-class-module
feature/add-attendance-export

fix/token-validation
fix/swagger-response

hotfix/login-crash

release/v1.1.0
```

---

# Pull Request Naming

Pattern:

```text
[type] Short description
```

Examples:

```text
[feat] Add attendance export endpoint
[fix] Correct JWT authentication middleware
[docs] Update deployment instructions
```

---

# Arquitetura do Projeto

## Estrutura de Pastas

```
src/
├── main.ts
├── app.module.ts
│
├── config/
│   ├── configuration.ts
│   └── env.validation.ts
│
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── dto/
│
├── database/
│   ├── database.module.ts
│   └── migrations/
│
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   └── dto/
│   │
│   └── users/
│       ├── users.module.ts
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── entities/
│       │   └── user.entity.ts
│       └── dto/
│           ├── create-user.dto.ts
│           └── update-user.dto.ts
│
└── shared/
    ├── services/
    └── utils/

test/
├── unit/
└── e2e/
```

## Explicação

### `main.ts`
Ponto de entrada da aplicação. Aqui é feito o bootstrap do NestJS, configuração de pipes globais, CORS, prefixo de rota (`/api`), Swagger, etc.

### `app.module.ts`
Módulo raiz. Importa `ConfigModule`, `DatabaseModule` e todos os módulos de domínio em `modules/`.

### `config/`
Centraliza variáveis de ambiente e configuração da aplicação, usando `@nestjs/config`. O `env.validation.ts` valida o `.env` com um schema (Joi ou Zod), evitando que a aplicação suba com variáveis faltando.

### `common/`
Tudo que é genérico e reutilizável em qualquer módulo, sem regra de negócio:
- **decorators**: decorators customizados (ex: `@CurrentUser()`)
- **filters**: exception filters globais (tratamento de erros padronizado)
- **guards**: guards de autenticação/autorização
- **interceptors**: logging, transformação de resposta, timeout
- **pipes**: validação e transformação de dados
- **dto**: DTOs compartilhados entre módulos (ex: paginação)

### `database/`
Configuração da conexão com o banco (TypeORM/Prisma) e migrations. Fica isolado do restante para facilitar troca de ORM ou banco no futuro.

### `modules/`
O coração da aplicação. Cada módulo representa um domínio de negócio e segue sempre o mesmo padrão interno:
- `*.module.ts` — declara o módulo e suas dependências
- `*.controller.ts` — camada de entrada HTTP (rotas)
- `*.service.ts` — regra de negócio
- `entities/` — modelos de dados/ORM
- `dto/` — contratos de entrada e saída da API

Essa separação por domínio (em vez de por tipo de arquivo) é o que torna a base escalável: para adicionar uma nova feature, basta criar uma nova pasta em `modules/` seguindo o mesmo padrão, sem tocar no resto do sistema.

### `shared/`
Serviços e utilitários usados por múltiplos módulos, mas que têm alguma lógica (diferente de `common/`, que é mais estrutural). Ex: serviço de envio de e-mail, serviço de upload de arquivos.

### `test/`
Testes separados por tipo: `unit/` para testes isolados de service/controller, `e2e/` para testes de fluxo completo da API.

## Por que essa estrutura escala bem

1. **Modularidade por domínio**: cada módulo é praticamente independente, facilitando manutenção e até uma futura extração para microsserviço.
2. **Baixo acoplamento**: `common/` e `shared/` não conhecem `modules/`, apenas o contrário.
3. **Fácil onboarding**: qualquer pessoa que conheça o padrão de um módulo (`users/`) sabe onde procurar em qualquer outro.
4. **Convenção previsível**: sempre `module → controller → service → entity/dto`, sem exceções.
