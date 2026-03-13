const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conectar ao banco
const dbPath = path.resolve(__dirname, 'aquisepaga.db');
const db = new sqlite3.Database(dbPath);

// --- ROTAS DE PESSOAS ---

// Listar todas as pessoas com seus saldos
app.get('/api/people', (req, res) => {
    const query = `
        SELECT p.id, p.name, p.phone, p.email,
        COALESCE(SUM(CASE WHEN t.type = 'debt' THEN t.amount ELSE -t.amount END), 0) as balance
        FROM people p
        LEFT JOIN transactions t ON p.id = t.person_id
        GROUP BY p.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Cadastrar nova pessoa
app.post('/api/people', (req, res) => {
    const { name, phone, email } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

    db.run(`INSERT INTO people (name, phone, email) VALUES (?, ?, ?)`, [name, phone, email], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, phone, email });
    });
});

// Atualizar pessoa existente
app.put('/api/people/:id', (req, res) => {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

    db.run(
        `UPDATE people SET name = ?, phone = ?, email = ? WHERE id = ?`,
        [name, phone, email, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Atualizado com sucesso' });
        }
    );
});

// --- ROTAS DE TRANSAÇÕES ---

// Registrar transação (Débito ou Pagamento)
app.post('/api/transactions', (req, res) => {
    const { person_id, amount, type, description } = req.body;
    if (!person_id || !amount || !type) {
        return res.status(400).json({ error: 'Faltam dados obrigatórios' });
    }

    const query = `INSERT INTO transactions (person_id, amount, type, description) VALUES (?, ?, ?, ?)`;
    db.run(query, [person_id, amount, type, description], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

// Listar transações de uma pessoa específica
app.get('/api/transactions/:person_id', (req, res) => {
    db.all(`SELECT * FROM transactions WHERE person_id = ? ORDER BY date DESC`, [req.params.person_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
