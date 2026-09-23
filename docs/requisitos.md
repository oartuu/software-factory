# Requisitos — Fábrica de Software

## Requisitos Funcionais

| ID | Requisito | Admin | User Padrão | Dono |
|----|-----------|:---:|:---:|:---:|
| RF01 | Permitir o autocadastro de novos usuários na plataforma. | ✓ | ✓ | ✓ |
| RF02 | Autenticar usuários cadastrados por meio de e-mail e senha. | ✓ | ✓ | ✓ |
| RF03 | Permitir a criação e a edição de grupos. | ✓ | — | ✓ |
| RF04 | Permitir a exclusão de grupos cadastrados. | ✓ | — | ✓ |
| RF05 | Permitir a associação de usuários a múltiplos grupos. | ✓ | ✓ | ✓ |
| RF06 | Permitir a definição e edição de permissões customizadas de usuários dentro de um grupo. | ✓ | — | ✓ |
| RF07 | Permitir a promoção de um usuário padrão para a função de Administrador do grupo. | ✓ | — | ✓ |
| RF08 | Permitir a criação e edição de apresentações (únicas ou com recorrência definida). | ✓ | — | ✓ |
| RF09 | Permitir a exclusão e o cancelamento de apresentações agendadas. | ✓ | — | ✓ |
| RF10 | Permitir o cadastro e edição de músicas, vinculando versões, tons e links externos (letras/cifras). | ✓ | ✓ | ✓ |
| RF11 | Permitir a exclusão de músicas do catálogo geral. | ✓ | ✓ | ✓ |
| RF12 | Permitir a criação, edição e fechamento de repertórios associados a uma apresentação específica. | ✓ | — | ✓ |
| RF13 | Permitir que os usuários enviem sugestões de músicas para compor um repertório em aberto. | ✓ | ✓ | ✓ |
| RF14 | Permitir a votação em músicas sugeridas para o repertório (um voto por usuário). | ✓ | ✓ | ✓ |
| RF15 | Aprovar automaticamente uma música sugerida quando ela atingir mais de 50% de votos favoráveis dos membros ativos do grupo. | ✓ | ✓ | ✓ |
| RF16 | Permitir a escalação e definição das funções (instrumentos/vocal) dos músicos para cada música do repertório. | ✓ | — | ✓ |
| RF17 | Registrar e armazenar o histórico de apresentações realizadas, incluindo nome, data e a lista de músicas tocadas. | ✓ | ✓ | ✓ |
| RF18 | Permitir a consulta e visualização de repertórios e apresentações finalizadas. | ✓ | ✓ | ✓ |
| RF19 | Gerar automaticamente uma playlist externa no Spotify e no YouTube a partir dos links salvos no repertório aprovado. | ✓ | — | ✓ |
| RF20 | Enviar notificações push e por e-mail sobre novas apresentações, alterações de repertório ou atualizações críticas do grupo. | ✓ | ✓ | ✓ |
| RF21 | Permitir a alteração de plano, inserção de dados de pagamento e gerenciamento da assinatura da organização. | — | — | — |

> **Nota sobre RF21:** o documento original não define explicitamente quais papéis têm acesso a esse requisito. Recomenda-se confirmar se é exclusivo do Dono (padrão esperado para gestão de assinatura/pagamento).

## Requisitos Não Funcionais

| ID | Categoria | Requisito Não Funcional (O sistema deve...) |
|----|-----------|----------------------------------------------|
| RNF01 | Usabilidade | Possuir interface responsiva adaptável a resoluções de Desktop (mínimo 1280×720) e Mobile (mínimo 360×640), mantendo a integridade visual. |
| RNF02 | Segurança | Criptografar as senhas dos usuários no banco de dados utilizando algoritmos de hash seguros (ex: `BCrypt` ou `Argon2`) e trafegar dados via protocolo HTTPS. |
| RNF03 | Segurança | Implementar controle de acesso baseado em escopo por grupo (mecanismo de *RBAC - Role-Based Access Control*) validado em cada requisição de API. |
| RNF04 | Confiabilidade | Utilizar um banco de dados relacional persistente com rotinas de backup diárias e automáticas para evitar a perda de dados históricos. |
| RNF05 | Desempenho | Responder a requisições de consulta de repertórios e apresentações em um tempo máximo de **2 segundos** sob condições normais de uso. |
| RNF06 | Desempenho | Suportar a arquitetura técnica a concorrência de até **100 usuários ativos simultâneos** por organização sem degradação perceptível de performance. |
| RNF07 | Escalabilidade | Ser estruturado para integrar APIs REST externas (Spotify e YouTube v3) por meio de módulos isolados, facilitando manutenções futuras na integração. |
