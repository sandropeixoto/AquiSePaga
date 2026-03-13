# Documentação Técnica: Sistema de Bancos de Dados

## Schema (SQLite)

### Tabela: `people`
Armazena os dados cadastrais das pessoas.

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| `id` | INTEGER | Chave primária autoincremento. |
| `name` | TEXT | Nome único da pessoa (Obrigatório). |
| `phone` | TEXT | WhatsApp/Telefone para contato. |
| `email` | TEXT | Endereço de e-mail. |
| `created_at` | DATETIME | Data de criação do registro. |

### Tabela: `transactions`
Registra toda a movimentação financeira (débitos e créditos).

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| `id` | INTEGER | Chave primária autoincremento. |
| `person_id` | INTEGER | FK para `people.id`. |
| `amount` | REAL | Valor da transação. |
| `type` | TEXT | 'debt' (Dívida +) ou 'payment' (Pagamento -). |
| `description` | TEXT | Detalhes sobre a transação. |
| `date` | DATETIME | Carimbo de tempo da transação. |

## Endpoints da API (REST)

### Pessoas
- `GET /api/people`: Retorna lista de pessoas com saldo calculado via SQL `SUM`.
- `POST /api/people`: Cadastra nova pessoa.
- `PUT /api/people/:id`: Atualiza dados cadastrais.

### Transações
- `GET /api/transactions/:person_id`: Retorna histórico individual.
- `POST /api/transactions`: Registra novo débito ou pagamento.

---
*Status do Projeto: Estável (V1.0)*
