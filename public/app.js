const API = 'http://localhost:3000/api';
let selectedPersonId = null;
let selectedPersonName = '';

async function fetchPeople() {
    const res = await fetch(`${API}/people`);
    const data = await res.json();
    renderPeople(data);
}

function renderPeople(people) {
    const list = document.getElementById('peopleList');
    list.innerHTML = '';
    
    people.forEach(p => {
        const div = document.createElement('div');
        div.className = 'person-card';
        const isDebt = p.balance > 0;
        
        div.innerHTML = `
            <h3>${p.name}</h3>
            <div class="balance ${isDebt ? 'debt' : 'credit'}">
                R$ ${Math.abs(p.balance).toFixed(2)}
                <small style="display:block; font-size: 0.7rem;">${isDebt ? '(Deve você)' : '(Você deve/Crédito)'}</small>
            </div>
            <div class="actions">
                <button onclick="openTransaction(${p.id}, '${p.name}')">Lançar</button>
                <button class="btn-info" onclick="viewHistory(${p.id}, '${p.name}')">Extrato</button>
            </div>
        `;
        list.appendChild(div);
    });
}

async function addPerson() {
    const nameInput = document.getElementById('personName');
    const name = nameInput.value;
    if (!name) return;

    await fetch(`${API}/people`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });

    nameInput.value = '';
    fetchPeople();
}

function openTransaction(id, name) {
    selectedPersonId = id;
    document.getElementById('transTitle').querySelector('span').innerText = name;
    document.getElementById('transactionSection').classList.remove('hidden');
    window.scrollTo(0, document.body.scrollHeight);
}

function closeTransaction() {
    document.getElementById('transactionSection').classList.add('hidden');
    selectedPersonId = null;
}

async function saveTransaction() {
    const amount = parseFloat(document.getElementById('transAmount').value);
    const type = document.getElementById('transType').value;
    const description = document.getElementById('transDesc').value;

    if (!amount || !selectedPersonId) return;

    await fetch(`${API}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            person_id: selectedPersonId,
            amount,
            type,
            description
        })
    });

    document.getElementById('transAmount').value = '';
    document.getElementById('transDesc').value = '';
    closeTransaction();
    fetchPeople();
}

async function viewHistory(id, name) {
    selectedPersonId = id;
    selectedPersonName = name;
    
    document.getElementById('historyTitle').querySelector('span').innerText = name;
    document.getElementById('historySection').classList.remove('hidden');
    document.getElementById('transactionSection').classList.add('hidden'); // Fecha o lançar se aberto

    const res = await fetch(`${API}/transactions/${id}`);
    const transactions = await res.json();
    renderHistory(transactions);
    
    window.scrollTo(0, document.body.scrollHeight);
}

function renderHistory(transactions) {
    const list = document.getElementById('historyList');
    list.innerHTML = '';

    if (transactions.length === 0) {
        list.innerHTML = '<p style="text-align:center; color: #64748b;">Nenhuma transação registrada.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'history-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Valor</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    transactions.forEach(t => {
        const row = document.createElement('tr');
        const date = new Date(t.date).toLocaleDateString('pt-BR');
        const typeLabel = t.type === 'debt' ? 'Dívida' : 'Pago';
        const typeClass = t.type === 'debt' ? 'text-danger' : 'text-success';
        
        row.innerHTML = `
            <td>${date}</td>
            <td class="${typeClass}">${typeLabel}</td>
            <td>${t.description || '-'}</td>
            <td class="text-bold">R$ ${t.amount.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
    list.appendChild(table);
}

function closeHistory() {
    document.getElementById('historySection').classList.add('hidden');
    selectedPersonId = null;
}

async function exportToPDF() {
    if (!selectedPersonId) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurações do PDF
    const res = await fetch(`${API}/transactions/${selectedPersonId}`);
    const transactions = await res.json();
    
    // Título
    doc.setFontSize(18);
    doc.text(`Extrato de Conta - ${selectedPersonName}`, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`AquiSePaga - Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

    let totalBalance = 0;
    const tableData = transactions.map(t => {
        const isDebt = t.type === 'debt';
        totalBalance += isDebt ? t.amount : -t.amount;
        
        return [
            new Date(t.date).toLocaleDateString('pt-BR'),
            isDebt ? 'Dívida' : 'Pagamento',
            t.description || '-',
            `R$ ${t.amount.toFixed(2)}`
        ];
    });

    // Tabela
    doc.autoTable({
        startY: 35,
        head: [['Data', 'Tipo', 'Descrição', 'Valor']],
        body: tableData,
        headStyles: { fillColor: [99, 102, 241] }, // Cor primária do app
    });

    // Rodapé com Saldo
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont(undefined, 'bold');
    
    const balanceText = totalBalance > 0 
        ? `SALDO DEVEDOR TOTAL: R$ ${totalBalance.toFixed(2)}`
        : `SALDO CREDOR TOTAL: R$ ${Math.abs(totalBalance).toFixed(2)}`;
    
    doc.text(balanceText, 14, finalY);

    // Salvar
    doc.save(`extrato_${selectedPersonName.toLowerCase().replace(/\s/g, '_')}.pdf`);
}

// Init
fetchPeople();
