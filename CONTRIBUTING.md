# Guia de Contribuição — Nerta Brasil

## Fluxo de Branches (Gitflow)

```
feature/* ─┐
fix/*      ├──► develop ──► release/* ──► main
chore/*    ┘
hotfix/* ──────────────────────────────► main (emergência)
```

### Branches permanentes

| Branch    | Finalidade |
|-----------|-----------|
| `main`    | Código em produção. Só recebe merge de `release/*` ou `hotfix/*`. |
| `develop` | Integração contínua do desenvolvimento. Toda feature/fix vai para cá primeiro. |

### Branches temporárias

| Prefixo       | Quando usar | Exemplo |
|---------------|-------------|---------|
| `feature/`    | Nova funcionalidade | `feature/cadastro-usuario` |
| `fix/`        | Correção de bug não urgente | `fix/login-senha-especial` |
| `hotfix/`     | Correção urgente em produção | `hotfix/pagamento-bloqueado` |
| `release/`    | Preparação de uma versão para produção | `release/1.2.0` |
| `chore/`      | Manutenção: deps, config, build | `chore/atualizar-dependencias` |
| `docs/`       | Apenas documentação | `docs/readme-api` |
| `refactor/`   | Refatoração sem mudança de comportamento | `refactor/servico-auth` |
| `test/`       | Adição ou ajuste de testes | `test/cobertura-pagamento` |

## Regras de nomenclatura

- Sempre minúsculo, palavras separadas por hífen
- Descrição curta e objetiva (máx. 4 palavras)
- Exemplos corretos: `feature/onboarding-email`, `fix/crash-android`
- Exemplos errados: `Feature/OnboardingEmail`, `branch1`, `minha-branch`

## Passo a passo para contribuir

```bash
# 1. Atualize o develop local
git checkout develop
git pull origin develop

# 2. Crie sua branch a partir do develop
git checkout -b feature/minha-funcionalidade

# 3. Faça seus commits
git commit -m "feat: adiciona tela de onboarding"

# 4. Envie para o repositório remoto
git push origin feature/minha-funcionalidade

# 5. Abra um Pull Request no GitHub: feature/* → develop
```

## Abertura de Release

Quando o `develop` estiver estável e pronto para ir a produção:

```bash
git checkout develop
git pull origin develop
git checkout -b release/1.0.0
# Ajustes finais, bump de versão, changelog
git push origin release/1.0.0
# Abra PR: release/* → main
```

Após o merge em `main`, faça também o merge da release de volta em `develop` para manter sincronizado.

## Convenção de commits (Conventional Commits)

```
tipo(escopo): descrição curta

feat:     nova funcionalidade
fix:      correção de bug
docs:     documentação
style:    formatação (sem mudança de lógica)
refactor: refatoração
test:     testes
chore:    tarefas de manutenção
```

## Pull Requests

- Todo PR precisa de ao menos **1 aprovação** antes do merge
- Nenhum push direto em `main` ou `develop`
- Delete a branch após o merge
- Linke a issue relacionada com `Closes #numero`
