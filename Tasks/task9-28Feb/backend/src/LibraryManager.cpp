#include "LibraryManager.h"
#include "../include/json.hpp"
#include <fstream>
#include <iostream>
#include <random>

using json = nlohmann::json;

LibraryManager::LibraryManager(std::string booksFile, std::string membersFile, std::string transactionsFile)
    : booksFile(booksFile), membersFile(membersFile), transactionsFile(transactionsFile) {
    loadBooks();
    loadMembers();
    loadTransactions();
}

void LibraryManager::loadBooks() {
    std::ifstream file(booksFile);
    if (!file.is_open()) return;
    
    json j;
    try {
        file >> j;
        for (const auto& item : j) {
            Book book(item["id"], item["title"], item["author"], item["category"], item["quantity"]);
            books.push_back(book);
        }
    } catch (...) {
        std::cerr << "Error loading books.json\n";
    }
}

void LibraryManager::saveBooks() {
    json j = json::array();
    for (const auto& book : books) {
        j.push_back({
            {"id", book.getId()},
            {"title", book.getTitle()},
            {"author", book.getAuthor()},
            {"category", book.getCategory()},
            {"quantity", book.getQuantity()}
        });
    }
    std::ofstream file(booksFile);
    file << j.dump(4);
}

void LibraryManager::loadMembers() {
    std::ifstream file(membersFile);
    if (!file.is_open()) return;

    json j;
    try {
        file >> j;
        for (const auto& item : j) {
            Member member(item["id"], item["name"], item["department"], item["contactInfo"]);
            if (item.contains("issuedBooks")) {
                for (const auto& bookId : item["issuedBooks"]) {
                    member.addIssuedBook(bookId);
                }
            }
            members.push_back(member);
        }
    } catch (...) {
        std::cerr << "Error loading members.json\n";
    }
}

void LibraryManager::saveMembers() {
    json j = json::array();
    for (const auto& member : members) {
        j.push_back({
            {"id", member.getId()},
            {"name", member.getName()},
            {"department", member.getDepartment()},
            {"contactInfo", member.getContactInfo()},
            {"issuedBooks", member.getIssuedBooks()}
        });
    }
    std::ofstream file(membersFile);
    file << j.dump(4);
}

void LibraryManager::loadTransactions() {
    std::ifstream file(transactionsFile);
    if (!file.is_open()) return;

    json j;
    try {
        file >> j;
        for (const auto& item : j) {
            Transaction t(item["id"], item["bookId"], item["memberId"], item["issueDate"], item["status"]);
            if (item.contains("returnDate") && item["returnDate"] != "") {
                t.markAsReturned(item["returnDate"]);
            }
            transactions.push_back(t);
        }
    } catch (...) {
        std::cerr << "Error loading transactions.json\n";
    }
}

void LibraryManager::saveTransactions() {
    json j = json::array();
    for (const auto& t : transactions) {
        j.push_back({
            {"id", t.getId()},
            {"bookId", t.getBookId()},
            {"memberId", t.getMemberId()},
            {"issueDate", t.getIssueDate()},
            {"returnDate", t.getReturnDate()},
            {"status", t.getStatus()}
        });
    }
    std::ofstream file(transactionsFile);
    file << j.dump(4);
}

std::vector<Book>& LibraryManager::getBooks() { return books; }

bool LibraryManager::addBook(const Book& book) {
    if (getBookById(book.getId()) != nullptr) return false; // Already exists
    books.push_back(book);
    saveBooks();
    return true;
}

bool LibraryManager::updateBook(const Book& updatedBook) {
    for (auto& book : books) {
        if (book.getId() == updatedBook.getId()) {
            book.setTitle(updatedBook.getTitle());
            book.setAuthor(updatedBook.getAuthor());
            book.setCategory(updatedBook.getCategory());
            book.setQuantity(updatedBook.getQuantity());
            saveBooks();
            return true;
        }
    }
    return false;
}

bool LibraryManager::deleteBook(const std::string& id) {
    for (auto it = books.begin(); it != books.end(); ++it) {
        if (it->getId() == id) {
            books.erase(it);
            saveBooks();
            return true;
        }
    }
    return false;
}

Book* LibraryManager::getBookById(const std::string& id) {
    for (auto& book : books) {
        if (book.getId() == id) return &book;
    }
    return nullptr;
}

std::vector<Member>& LibraryManager::getMembers() { return members; }

bool LibraryManager::addMember(const Member& member) {
    if (getMemberById(member.getId()) != nullptr) return false; // Already exists
    members.push_back(member);
    saveMembers();
    return true;
}

bool LibraryManager::updateMember(const Member& updatedMember) {
    for (auto& member : members) {
        if (member.getId() == updatedMember.getId()) {
            member.setName(updatedMember.getName());
            member.setDepartment(updatedMember.getDepartment());
            member.setContactInfo(updatedMember.getContactInfo());
            saveMembers();
            return true;
        }
    }
    return false;
}

bool LibraryManager::deleteMember(const std::string& id) {
    for (auto it = members.begin(); it != members.end(); ++it) {
        if (it->getId() == id) {
            members.erase(it);
            saveMembers();
            return true;
        }
    }
    return false;
}

Member* LibraryManager::getMemberById(const std::string& id) {
    for (auto& member : members) {
        if (member.getId() == id) return &member;
    }
    return nullptr;
}

std::vector<Transaction>& LibraryManager::getTransactions() { return transactions; }

std::string LibraryManager::generateTransactionId() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(10000, 99999);
    return "TXN-" + std::to_string(dis(gen));
}

bool LibraryManager::issueBook(const std::string& bookId, const std::string& memberId, const std::string& issueDate) {
    Book* book = getBookById(bookId);
    Member* member = getMemberById(memberId);

    if (book != nullptr && member != nullptr && book->isAvailable()) {
        book->issueBook();
        member->addIssuedBook(bookId);
        
        Transaction t(generateTransactionId(), bookId, memberId, issueDate);
        transactions.push_back(t);

        saveBooks();
        saveMembers();
        saveTransactions();
        return true;
    }
    return false;
}

bool LibraryManager::returnBook(const std::string& transactionId, const std::string& returnDate) {
    for (auto& t : transactions) {
        if (t.getId() == transactionId && t.getStatus() == "issued") {
            t.markAsReturned(returnDate);
            
            Book* book = getBookById(t.getBookId());
            Member* member = getMemberById(t.getMemberId());
            
            if (book) book->returnBook();
            if (member) member->removeIssuedBook(t.getBookId());
            
            saveBooks();
            saveMembers();
            saveTransactions();
            return true;
        }
    }
    return false;
}
