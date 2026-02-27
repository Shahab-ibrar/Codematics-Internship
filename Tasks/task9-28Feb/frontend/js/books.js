let booksData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = booksData.filter(b => 
            b.title.toLowerCase().includes(term) || 
            b.author.toLowerCase().includes(term) || 
            b.id.toLowerCase().includes(term)
        );
        renderBooks(filtered);
    });

    // Form submission
    document.getElementById('bookForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const mode = document.getElementById('formMode').value;
        const bookData = {
            id: document.getElementById('bookId').value,
            title: document.getElementById('bookTitle').value,
            author: document.getElementById('bookAuthor').value,
            category: document.getElementById('bookCategory').value,
            quantity: parseInt(document.getElementById('bookQuantity').value),
            available: true
        };

        try {
            if (mode === 'add') {
                await API.addBook(bookData);
                window.showToast('Book added successfully');
            } else {
                await API.updateBook(bookData.id, bookData);
                window.showToast('Book updated successfully');
            }
            closeModal();
            loadBooks();
        } catch (err) {
            window.showToast(err.message, 'error');
        }
    });

    // Modal click outside to close
    document.getElementById('bookModalOverlay').addEventListener('click', (e) => {
        if(e.target.id === 'bookModalOverlay') closeModal();
    });
});

async function loadBooks() {
    try {
        booksData = await API.getBooks();
        renderBooks(booksData);
    } catch (err) {
        document.getElementById('booksTableBody').innerHTML = 
            `<tr><td colspan="7" class="p-8 text-center text-red-500">Failed to load books: ${err.message}</td></tr>`;
    }
}

function renderBooks(books) {
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = '';

    if (books.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-slate-500">No books found.</td></tr>';
        return;
    }

    books.forEach(book => {
        const statusClass = book.quantity > 0 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        const statusText = book.quantity > 0 ? 'Available' : 'Out of Stock';

        // Storing data for editing
        const bookJson = encodeURIComponent(JSON.stringify(book));

        tbody.innerHTML += `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                <td class="p-4 font-medium text-slate-900 dark:text-slate-200">#${book.id}</td>
                <td class="p-4 text-slate-800 dark:text-slate-300 font-semibold">${book.title}</td>
                <td class="p-4 text-slate-600 dark:text-slate-400">${book.author}</td>
                <td class="p-4 text-slate-600 dark:text-slate-400"><span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs">${book.category}</span></td>
                <td class="p-4 font-medium">${book.quantity}</td>
                <td class="p-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide inline-flex items-center gap-1 ${statusClass}">
                        ${book.quantity > 0 ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-times"></i>'} ${statusText}
                    </span>
                </td>
                <td class="p-4 text-right space-x-2">
                    <button onclick="openEditModal('${bookJson}')" class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-colors" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="deleteBook('${book.id}')" class="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-colors" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function openAddModal() {
    document.getElementById('formMode').value = 'add';
    document.getElementById('modalTitle').textContent = 'Add New Book';
    document.getElementById('bookId').disabled = false;
    document.getElementById('bookForm').reset();
    showModal();
}

function openEditModal(bookJsonStr) {
    const book = JSON.parse(decodeURIComponent(bookJsonStr));
    document.getElementById('formMode').value = 'edit';
    document.getElementById('modalTitle').textContent = 'Edit Book';
    
    document.getElementById('bookId').value = book.id;
    document.getElementById('bookId').disabled = true; // Cannot edit ID
    
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookCategory').value = book.category;
    document.getElementById('bookQuantity').value = book.quantity;
    
    showModal();
}

async function deleteBook(id) {
    if(confirm(`Are you sure you want to delete book #${id}?`)) {
        try {
            await API.deleteBook(id);
            window.showToast('Book deleted successfully');
            loadBooks();
        } catch(err) {
            window.showToast(err.message, 'error');
        }
    }
}

function showModal() {
    const overlay = document.getElementById('bookModalOverlay');
    const modal = document.getElementById('bookModal');
    
    overlay.classList.remove('hidden');
    // small delay for transition
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        modal.classList.remove('scale-95');
    }, 10);
}

function closeModal() {
    const overlay = document.getElementById('bookModalOverlay');
    const modal = document.getElementById('bookModal');
    
    overlay.classList.add('opacity-0');
    modal.classList.add('scale-95');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300);
}
