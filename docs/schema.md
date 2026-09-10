# Modelo de Banco de Dados — Fábrica de Software

Modelo relacional extraído do diagrama ER do projeto. As tabelas usam `uuid` como chave primária padrão.

## Tabelas

### `plano`
Define os planos de assinatura disponíveis para os grupos.

| Campo | Tipo | Observação |
|-------|------|------------|
| plano_id | uuid | PK |
| nome | string | |
| max_membros | int | |
| preco_centavos | int | |
| periodo | string | |

### `user`
Usuários da plataforma.

| Campo | Tipo | Observação |
|-------|------|------------|
| usuario_id | uuid | PK |
| nome | string | |
| email | string | UK (único) |
| telefone | string | |
| senha_hash | string | |
| criado_em | timestamp | |

### `auth_token`
Tokens de autenticação/sessão vinculados a um usuário.

| Campo | Tipo | Observação |
|-------|------|------------|
| token_id | uuid | PK |
| usuario_id | uuid | FK → user |
| token_hash | string | |
| criado_em | timestamp | |
| expira_em | timestamp | |

### `grupos`
Grupos (bandas/organizações) criados na plataforma, vinculados a um plano.

| Campo | Tipo | Observação |
|-------|------|------------|
| grupo_id | uuid | PK |
| criador_id | uuid | FK → user |
| plano_id | uuid | FK → plano |
| nome | string | |
| status_pagamento | string | |
| criado_em | timestamp | |

### `membros_grupo`
Relação de associação entre usuários e grupos, incluindo papel/permissões.

| Campo | Tipo | Observação |
|-------|------|------------|
| id | uuid | PK |
| usuario_id | uuid | FK → user |
| grupo_id | uuid | FK → grupos |
| tipo_acesso | string | |
| status | string | |
| funcao | array[string] | instrumentos/vocal do membro |

### `musica`
Catálogo geral de músicas de um grupo.

| Campo | Tipo | Observação |
|-------|------|------------|
| musica_id | uuid | PK |
| grupo_id | uuid | FK → grupos |
| nome | string | |
| artista | string | |
| url_youtube | string | |
| url_spotify | string | |

### `evento`
Apresentações/eventos agendados por um grupo.

| Campo | Tipo | Observação |
|-------|------|------------|
| evento_id | uuid | PK |
| grupo_id | uuid | FK → grupos |
| nome | string | |
| inicia_em | timestamp | |
| local | string | |
| status_repertorio | string | |
| setlist_id | uuid | FK → setlist |
| playlist_spotify_id | string | gerado após aprovação do repertório |
| playlist_youtube_id | string | gerado após aprovação do repertório |

### `setlist`
Associação entre um evento e as músicas que compõem seu repertório.

| Campo | Tipo | Observação |
|-------|------|------------|
| setlist_id | uuid | PK |
| evento_id | uuid | FK → evento |
| musica_id | uuid | FK → musica |

### `votacao`
Votações abertas para sugestões de música em um repertório.

| Campo | Tipo | Observação |
|-------|------|------------|
| votacao_id | uuid | PK |
| evento_id | uuid | FK → evento |
| musica_id | uuid | FK → musica |
| sugerido_por | uuid | FK → user |
| status | string | |
| fecha_em | timestamp | |
| eleitores_elegiveis | int | base para cálculo do quórum de 50% (RF15) |

### `votos`
Registro individual de cada voto em uma votação.

| Campo | Tipo | Observação |
|-------|------|------------|
| voto_id | uuid | PK |
| votacao_id | uuid | FK → votacao |
| usuario_id | uuid | FK → user |
| criado_em | timestamp | |

## Relacionamentos principais

- **plano → grupos**: um plano é assinado por vários grupos (`assina`).
- **user → grupos**: um usuário cria um ou mais grupos (`cria`).
- **user → auth_token**: um usuário possui um ou mais tokens de autenticação (`possui`).
- **user ↔ grupos** (via `membros_grupo`): relação N:N — um usuário participa de múltiplos grupos e um grupo tem múltiplos membros (`participa`).
- **grupos → musica**: um grupo cadastra várias músicas no catálogo (`cadastra`).
- **grupos → evento**: um grupo agenda várias apresentações (`agenda`).
- **evento ↔ membros_grupo**: membros do grupo se reúnem em um evento (`reune`).
- **membros_grupo → votacao**: um membro sugere músicas, que geram uma votação (`sugere`).
- **musica ↔ setlist**: músicas aparecem em um ou mais setlists (`aparece`).
- **evento → setlist**: um evento contém um setlist com suas músicas (`contem`).
- **musica → votacao**: uma música pode ser indicada em uma votação (`indicada`).
- **evento → votacao**: um evento recebe votações de sugestões de repertório (`recebe`).
- **votacao → votos**: uma votação acumula votos individuais (`acumula`).
- **user → votos**: um usuário vota em uma votação (`vota`).

## Observações de modelagem

- O RBAC (RNF03) é sustentado principalmente pelos campos `tipo_acesso` e `funcao` em `membros_grupo`.
- A aprovação automática de música (RF15) depende do cálculo `votos favoráveis / eleitores_elegiveis > 50%`, usando o campo `eleitores_elegiveis` da tabela `votacao`.
- A integração com Spotify/YouTube (RF19, RNF07) é refletida nos campos `playlist_spotify_id` e `playlist_youtube_id` em `evento`, e `url_spotify`/`url_youtube` em `musica`.
