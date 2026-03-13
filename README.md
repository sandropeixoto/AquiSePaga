# 💰 AquiSePaga - Gestão de Dívidas Local

Sistema web local desenvolvido com Node.js e SQLite para controle de gastos compartilhados, empréstimos e amortização de dívidas.

## 🚀 Funcionalidades Principal

- **Gestão de Pessoas:** Cadastro de pessoas com campos opcionais de WhatsApp e Email.
- **Controle de Saldos:** Registro de dívidas (+) e pagamentos (-).
- **Cálculo Automático:** O sistema consolida o saldo líquido por pessoa, permitindo identificar rapidamente quem deve ou quem possui crédito.
- **Extrato Detalhado:** Visualização de todas as transações realizadas por cada indivíduo.
- **Exportação para PDF:** Geração de extratos profissionais formatados para envio via WhatsApp/Email.
- **Interface Responsiva:** Design moderno, limpo e adaptável a diferentes tamanhos de tela.
- **Privacidade Total:** Todos os dados são armazenados localmente em um banco de dados SQLite (`aquisepaga.db`).

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express.
- **Banco de Dados:** SQLite3.
- **Frontend:** HTML5, Vanilla JavaScript, CSS3.
- **Bibliotecas:** 
  - `jsPDF` & `jsPDF-AutoTable` (Exportação de PDF).
  - `IMask` (Máscaras de entrada).
  - `CORS` (Segurança local).

## 📋 Pré-requisitos

- Node.js instalado (v14 ou superior).

## 🔧 Instalação e Uso

1. Clone ou baixe o diretório do projeto.
2. No terminal, dentro da pasta raiz, instale as dependências:
   ```bash
   npm install
   ```
3. Inicialize o banco de dados (necessário apenas na primeira execução):
   ```bash
   node db.js --init
   ```
4. Inicie o servidor:
   ```bash
   node server.js
   ```
5. Acesse o sistema no navegador:
   [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

- `server.js`: Servidor API e rotas.
- `db.js`: Configuração e schema do banco de dados SQLite.
- `public/`: Arquivos estáticos do frontend.
  - `index.html`: Estrutura da interface.
  - `style.css`: Estilização e design system.
  - `app.js`: Lógica do cliente e integração com API.
- `docs/`: Documentação técnica e de requisitos (Metodologia AIOX).

---
*Gerado por Orion (AIOX Master Orchestrator) em 2026-03-13.*
