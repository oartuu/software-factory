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

# Suggested Development Flow

```text
main
 └── dev
      ├── feature/*
      ├── fix/*
      └── release/*
```

For emergency fixes:

```text
main
 └── hotfix/*
```
