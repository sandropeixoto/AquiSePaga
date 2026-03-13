const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'aquisepaga.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

function initDb() {
    db.serialize(() => {
        // Tabela de Pessoas
        db.run(`CREATE TABLE IF NOT EXISTS people (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            phone TEXT,
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) console.error('Erro ao criar tabela people:', err.message);
            else console.log('Tabela "people" pronta.');
        });

        // Tabela de Transações (Dívidas e Pagamentos)
        // type: 'debt' (dívida) ou 'payment' (pagamento)
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            person_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            type TEXT CHECK(type IN ('debt', 'payment')) NOT NULL,
            description TEXT,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (person_id) REFERENCES people (id)
        )`, (err) => {
            if (err) console.error('Erro ao criar tabela transactions:', err.message);
            else console.log('Tabela "transactions" pronta.');
        });
    });
}

// Se o script for executado com --init, ele cria as tabelas
if (process.argv.includes('--init')) {
    initDb();
    // Fechar DB após init se for execução direta
    setTimeout(() => db.close(), 1000);
}

module.exports = db;
