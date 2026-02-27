let transactionsData = [];
let booksList = [];
let membersList = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Load dropdowns first
    await loadDropdowns();
    // Then load transactions
    await loadTransactions();

    // Issue Form Submit
    document.getElementById('issueForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookId = document.getElementById('issueBookSelect').value;
        const memberId = document.getElementById('issueMemberSelect').value;
        
        if (!bookId || !memberId) {
            window.showToast("Please select both a book and a member", "error");
            return;
        }

        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        try {
            await API.issueBook({ bookId, memberId, issueDate: date });
            window.showToast("Book issued successfully!");
            document.getElementById('issueForm').reset();
            loadTransactions();
            loadDropdowns(); // Refresh availabilities
        } catch (err) {
            window.showToast(err.message, "error");
        }
    });

    // Return Form Submit
    document.getElementById('returnForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const txId = document.getElementById('returnTransactionId').value.trim();
        if (!txId) return;

        const date = new Date().toISOString().split('T')[0];
        
        try {
            await API.returnBook({ transactionId: txId, returnDate: date });
            window.showToast("Book returned successfully!");
            document.getElementById('returnForm').reset();
            loadTransactions();
            loadDropdowns(); // Refresh availabilities
        } catch (err) {
            window.showToast(err.message, "error");
        }
    });

    // Search functionality
    document.getElementById('searchTxInput').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = transactionsData.filter(t => 
            t.id.toLowerCase().includes(term) || 
            t.bookId.toLowerCase().includes(term) || 
            t.memberId.toLowerCase().includes(term)
        );
        renderTransactions(filtered);
    });
});

async function loadDropdowns() {
    try {
        booksList = await API.getBooks();
        membersList = await API.getMembers();

        const bookSelect = document.getElementById('issueBookSelect');
        bookSelect.innerHTML = '<option value="">-- Select Book --</option>';
        booksList.filter(b => b.available).forEach(b => {
            bookSelect.innerHTML += `<option value="${b.id}">${b.title} (${b.id}) - Qty: ${b.quantity}</option>`;
        });

        const memberSelect = document.getElementById('issueMemberSelect');
        memberSelect.innerHTML = '<option value="">-- Select Member --</option>';
        membersList.forEach(m => {
            memberSelect.innerHTML += `<option value="${m.id}">${m.name} (${m.id})</option>`;
        });
    } catch (e) {
        console.error("Error loading dropdown data", e);
    }
}

async function loadTransactions() {
    try {
        transactionsData = await API.getTransactions();
        // Sort by newest first based on ID length or just reverse
        transactionsData.reverse();
        renderTransactions(transactionsData);
    } catch (err) {
        document.getElementById('transactionsTableBody').innerHTML = 
            `<tr><td colspan="6" class="p-8 text-center text-red-500">Failed to load transactions: ${err.message}</td></tr>`;
    }
}

function renderTransactions(transactions) {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';

    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-500">No transactions recorded yet.</td></tr>';
        return;
    }

    transactions.forEach(tx => {
        const isReturned = tx.status === 'returned';
        
        tbody.innerHTML += `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="p-4 font-medium text-slate-900 dark:text-slate-200">
                    <span class="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">${tx.id}</span>
                </td>
                <td class="p-4 text-center">
                    ${isReturned 
                        ? '<span class="inline-flex w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 items-center justify-center" title="Returned"><i class="fa-solid fa-arrow-left"></i></span>' 
                        : '<span class="inline-flex w-8 h-8 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 items-center justify-center" title="Issued"><i class="fa-solid fa-arrow-right"></i></span>'}
                </td>
                <td class="p-4 text-slate-800 dark:text-slate-300 font-medium">${tx.bookId}</td>
                <td class="p-4 text-slate-600 dark:text-slate-400">${tx.memberId}</td>
                <td class="p-4 text-slate-600 dark:text-slate-400">${tx.issueDate}</td>
                <td class="p-4 text-slate-600 dark:text-slate-400">
                    ${isReturned ? `<span class="text-green-600 dark:text-green-400 font-medium"><i class="fa-solid fa-check mr-1"></i> ${tx.returnDate}</span>` : '<span class="text-slate-400 italic">Pending...</span>'}
                </td>
            </tr>
        `;
    });
}
