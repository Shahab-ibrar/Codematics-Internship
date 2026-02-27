// =============================================================
// LOCAL STORAGE API — Standalone Mode (No backend required)
// =============================================================

const DB_KEYS = {
    books: 'lms_books',
    members: 'lms_members',
    transactions: 'lms_transactions',
};

// ------ Seed Data (loaded once on first visit) ------
const SEED_BOOKS = [
    { id: 'BK001', title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', quantity: 5, available: true },
    { id: 'BK002', title: 'The Pragmatic Programmer', author: 'David Thomas', category: 'Programming', quantity: 3, available: true },
    { id: 'BK003', title: 'Design Patterns', author: 'Gang of Four', category: 'Software Engineering', quantity: 2, available: true },
    { id: 'BK004', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', quantity: 4, available: true },
    { id: 'BK005', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', quantity: 6, available: true },
    { id: 'BK006', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', quantity: 3, available: true },
];

const SEED_MEMBERS = [
    { id: 'MB001', name: 'Alice Johnson', department: 'Computer Science', contactInfo: 'alice@uni.edu', issuedBooks: [] },
    { id: 'MB002', name: 'Bob Smith', department: 'Mathematics', contactInfo: 'bob@uni.edu', issuedBooks: [] },
    { id: 'MB003', name: 'Carol White', department: 'Physics', contactInfo: 'carol@uni.edu', issuedBooks: [] },
    { id: 'MB004', name: 'David Brown', department: 'Literature', contactInfo: 'david@uni.edu', issuedBooks: [] },
];

const SEED_TRANSACTIONS = [];

// ------ DB Helper ------
function dbGet(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || null;
    } catch { return null; }
}

function dbSet(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function initDB() {
    if (!dbGet(DB_KEYS.books))        dbSet(DB_KEYS.books,        SEED_BOOKS);
    if (!dbGet(DB_KEYS.members))      dbSet(DB_KEYS.members,      SEED_MEMBERS);
    if (!dbGet(DB_KEYS.transactions)) dbSet(DB_KEYS.transactions, SEED_TRANSACTIONS);
}

// Initialise immediately
initDB();

// ------ ID Generator ------
function genTxId() {
    return 'TXN-' + Date.now().toString(36).toUpperCase();
}

// =============================================================
// API Class — same interface as the original so no other JS
// files need to change.
// =============================================================
class API {

    // ---- Books ----
    static getBooks() {
        return Promise.resolve(dbGet(DB_KEYS.books) || []);
    }

    static addBook(data) {
        const books = dbGet(DB_KEYS.books) || [];
        if (books.find(b => b.id === data.id)) {
            return Promise.reject(new Error(`Book ID "${data.id}" already exists.`));
        }
        books.push({ ...data, available: data.quantity > 0 });
        dbSet(DB_KEYS.books, books);
        return Promise.resolve(data);
    }

    static updateBook(id, data) {
        const books = dbGet(DB_KEYS.books) || [];
        const idx = books.findIndex(b => b.id === id);
        if (idx === -1) return Promise.reject(new Error('Book not found'));
        books[idx] = { ...books[idx], ...data, available: data.quantity > 0 };
        dbSet(DB_KEYS.books, books);
        return Promise.resolve(books[idx]);
    }

    static deleteBook(id) {
        let books = dbGet(DB_KEYS.books) || [];
        books = books.filter(b => b.id !== id);
        dbSet(DB_KEYS.books, books);
        return Promise.resolve({ success: true });
    }

    // ---- Members ----
    static getMembers() {
        return Promise.resolve(dbGet(DB_KEYS.members) || []);
    }

    static addMember(data) {
        const members = dbGet(DB_KEYS.members) || [];
        if (members.find(m => m.id === data.id)) {
            return Promise.reject(new Error(`Member ID "${data.id}" already exists.`));
        }
        members.push({ ...data, issuedBooks: [] });
        dbSet(DB_KEYS.members, members);
        return Promise.resolve(data);
    }

    static updateMember(id, data) {
        const members = dbGet(DB_KEYS.members) || [];
        const idx = members.findIndex(m => m.id === id);
        if (idx === -1) return Promise.reject(new Error('Member not found'));
        members[idx] = { ...members[idx], ...data };
        dbSet(DB_KEYS.members, members);
        return Promise.resolve(members[idx]);
    }

    static deleteMember(id) {
        let members = dbGet(DB_KEYS.members) || [];
        members = members.filter(m => m.id !== id);
        dbSet(DB_KEYS.members, members);
        return Promise.resolve({ success: true });
    }

    // ---- Transactions ----
    static getTransactions() {
        return Promise.resolve(dbGet(DB_KEYS.transactions) || []);
    }

    static issueBook({ bookId, memberId, issueDate }) {
        const books   = dbGet(DB_KEYS.books)   || [];
        const members = dbGet(DB_KEYS.members) || [];
        const txns    = dbGet(DB_KEYS.transactions) || [];

        const book   = books.find(b => b.id === bookId);
        const member = members.find(m => m.id === memberId);

        if (!book)   return Promise.reject(new Error('Book not found'));
        if (!member) return Promise.reject(new Error('Member not found'));
        if (book.quantity <= 0) return Promise.reject(new Error('No copies available'));

        // Decrement stock
        book.quantity -= 1;
        book.available = book.quantity > 0;
        dbSet(DB_KEYS.books, books);

        // Track on member
        member.issuedBooks = member.issuedBooks || [];
        member.issuedBooks.push(bookId);
        dbSet(DB_KEYS.members, members);

        // Create transaction
        const tx = {
            id:         genTxId(),
            bookId,
            memberId,
            issueDate:  issueDate || new Date().toISOString().split('T')[0],
            returnDate: null,
            status:     'issued',
        };
        txns.push(tx);
        dbSet(DB_KEYS.transactions, txns);

        return Promise.resolve(tx);
    }

    static returnBook({ transactionId, returnDate }) {
        const books   = dbGet(DB_KEYS.books)   || [];
        const members = dbGet(DB_KEYS.members) || [];
        const txns    = dbGet(DB_KEYS.transactions) || [];

        const tx = txns.find(t => t.id === transactionId);
        if (!tx)                    return Promise.reject(new Error('Transaction not found'));
        if (tx.status === 'returned') return Promise.reject(new Error('Book already returned'));

        // Restore stock
        const book = books.find(b => b.id === tx.bookId);
        if (book) {
            book.quantity += 1;
            book.available = true;
            dbSet(DB_KEYS.books, books);
        }

        // Remove from member's issued list
        const member = members.find(m => m.id === tx.memberId);
        if (member) {
            member.issuedBooks = (member.issuedBooks || []).filter(id => id !== tx.bookId);
            dbSet(DB_KEYS.members, members);
        }

        // Update transaction
        tx.returnDate = returnDate || new Date().toISOString().split('T')[0];
        tx.status = 'returned';
        dbSet(DB_KEYS.transactions, txns);

        return Promise.resolve(tx);
    }

    // ---- Stats (used by dashboard) ----
    static getStats() {
        const books   = dbGet(DB_KEYS.books)   || [];
        const members = dbGet(DB_KEYS.members) || [];
        const txns    = dbGet(DB_KEYS.transactions) || [];

        const totalBooks     = books.length;
        const totalMembers   = members.length;
        const issuedBooks    = txns.filter(t => t.status === 'issued').length;
        const returnedBooks  = txns.filter(t => t.status === 'returned').length;
        const availableBooks = books.filter(b => b.quantity > 0).length;
        const totalInventory = books.reduce((sum, b) => sum + (b.quantity || 0), 0);

        return Promise.resolve({
            totalBooks,
            totalInventory,
            totalMembers,
            issuedBooks,
            returnedBooks,
            availableBooks,
        });
    }
}

window.API = API;
