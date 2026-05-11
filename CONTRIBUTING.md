# Contribuindo para o MeVêUm

## Padrões de Branch

O projeto segue **GitFlow** com as seguintes convenções:

### Tipos de Branch

| Tipo | Prefixo | Exemplo | Propósito |
|------|---------|---------|-----------|
| Feature | `feature/` | `feature/cardapio-digital` | Novas funcionalidades |
| Fix | `fix/` | `fix/pedido-duplicado` | Correção de bugs |
| Chore | `chore/` | `chore/atualizar-dependencias` | Tarefas, configs, reorganização |
| Docs | `docs/` | `docs/adicionar-api-docs` | Documentação |
| Refactor | `refactor/` | `refactor/simplificar-service` | Melhorias de código sem mudança de funcionalidade |
| Release | `release/` | `release/v1.0.0` | Preparação de release |
| Hotfix | `hotfix/` | `hotfix/corrigir-pagamento-pix` | Correções críticas em produção |

### Convenção de Nomes

- Use **kebab-case** (com hífens)
- Seja descritivo mas conciso
- Máximo 50 caracteres
- Exemplos bons:
  - `feature/integrar-whatsapp`
  - `fix/validacao-cpf`
  - `chore/renovar-certificados`

### Convenção de Commits

Siga o padrão **Conventional Commits**:

```
<tipo>: <descrição curta>

<corpo opcional com mais detalhes>

<footer opcional para referências>
```

#### Tipos de Commit

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alterações em documentação
- `style:` - Formatação de código
- `refactor:` - Refatoração
- `perf:` - Otimização de performance
- `test:` - Adição ou alteração de testes
- `chore:` - Alterações de build, configs, dependências
- `ci:` - Alterações em CI/CD

#### Exemplos

```
feat: adicionar cardapio digital com filtros

- Implementar busca por categoria
- Adicionar ordenação por preço
- Integrar com banco de dados

Closes #123
```

```
fix: corrigir calculo de taxa de entrega para CEP invalido

Antes estava retornando erro 500, agora retorna 400 com mensagem clara.
```

## Workflow de Desenvolvimento

### 1. Criar uma nova branch

```bash
git checkout main
git pull origin main
git checkout -b feature/sua-funcionalidade
```

### 2. Fazer commits pequenos e lógicos

```bash
# Sempre escreva boas mensagens de commit
git commit -m "feat: descrever mudança"
```

### 3. Push e abrir Pull Request

```bash
git push origin feature/sua-funcionalidade
```

### 4. Code Review

- Sempre requer aprovação antes de merge
- Respeite os padrões de arquitetura em [AGENTS.md](api/AGENTS.md)

### 5. Merge e Delete

```bash
# Após aprovação, fazer merge para main
# Deletar a branch local e remota
git checkout main
git branch -d feature/sua-funcionalidade
git push origin --delete feature/sua-funcionalidade
```

## Arquitetura

Todos os PRs devem respeitar a arquitetura definida em [api/AGENTS.md](api/AGENTS.md):

- Separação clara por camadas (Controller → Service → Repository)
- Validadores centralizados
- Mappers com `@Mapper`
- Organização modular por domínios

Veja [api/README.md](api/README.md) para a estrutura de domínios.

## Dúvidas?

Consulte:
- [api/AGENTS.md](api/AGENTS.md) - Padrões de código
- [api/README.md](api/README.md) - Estrutura do projeto
- [api/docs/database-model.md](api/docs/database-model.md) - Modelo de banco de dados
- [api/docs/rf.md](api/docs/rf.md) - Requisitos funcionais
