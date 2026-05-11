# MeVêUm API

Backend do MeVêUm - Sistema operacional para restaurantes.

## Estrutura do Projeto

O backend segue uma arquitetura de **monolito modular por domínio**.

```
src/main/java/br/com/meveum/
├── cardapio/              ← Gestão de produtos e categorias
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── entity/
├── pedidos/               ← Fluxo de pedidos
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── entity/
├── pagamentos/            ← Processamento de pagamentos
│   ├── controller/
│   ├── service/
│   └── repository/
├── entrega/               ← Gestão de entregas
│   ├── controller/
│   └── service/
├── crm/                   ← Gestão de clientes
│   ├── controller/
│   └── service/
├── dashboard/             ← Analytics e dashboards
│   ├── controller/
│   └── service/
├── integracao_whatsapp/   ← Integração com WhatsApp
│   ├── controller/
│   └── service/
├── shared/                ← Código compartilhado entre domínios
│   ├── validator/         ← Validadores genéricos
│   ├── mapper/            ← Conversão de DTOs
│   ├── exception/         ← Exceções customizadas
│   ├── config/            ← Configurações da aplicação
│   └── security/          ← Segurança e autenticação
└── MeveumApplication.java ← Classe principal
```

## Padrões de Desenvolvimento

Consulte [AGENTS.md](./AGENTS.md) para os padrões obrigatórios de arquitetura.

## Como Rodar

### Pré-requisitos

- Java 21+
- Maven 3.8+
- Docker e Docker Compose

### Iniciar banco de dados

```bash
docker-compose up -d
```

### Rodar a aplicação

```bash
mvn spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

### Documentação da API

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Estrutura de Migração do Banco

As migrações SQL devem estar em `src/main/resources/db/migration/`.

O Flyway gerencia automaticamente a evolução do schema.

## Escalabilidade Futura

Esta estrutura de monolito modular permite fácil escalabilidade:

- Se um domínio crescer muito, pode ser extraído em um microserviço independente
- A separação clara por domínio facilita testes e manutenção
- Código compartilhado fica centralizado em `shared/`
