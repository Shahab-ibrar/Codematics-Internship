#ifndef LIBRARYMANAGER_H
#define LIBRARYMANAGER_H

#include "Book.h"
#include "Member.h"
#include "Transaction.h"
#include <vector>
#include <string>

class LibraryManager {
private:
    std::vector<Book> books;
    std::vector<Member> members;
    std::vector<Transaction> transactions;

    std::string booksFile;
    std::string membersFile;
    std::string transactionsFile;

    void loadBooks();
    void saveBooks();
    
    void loadMembers();
    void saveMembers();

    void loadTransactions();
    void saveTransactions();

public:
    LibraryManager(std::string booksFile, std::string membersFile, std::string transactionsFile);

    // Book Management
    std::vector<Book>& getBooks();
    bool addBook(const Book& book);
    bool updateBook(const Book& book);
    bool deleteBook(const std::string& id);
    Book* getBookById(const std::string& id);

    // Member Management
    std::vector<Member>& getMembers();
    bool addMember(const Member& member);
    bool updateMember(const Member& member);
    bool deleteMember(const std::string& id);
    Member* getMemberById(const std::string& id);

    // Issue/Return Module
    std::vector<Transaction>& getTransactions();
    bool issueBook(const std::string& bookId, const std::string& memberId, const std::string& issueDate);
    bool returnBook(const std::string& transactionId, const std::string& returnDate);
    
    // Utilities for ID generation
    std::string generateTransactionId();
};

#endif // LIBRARYMANAGER_H
