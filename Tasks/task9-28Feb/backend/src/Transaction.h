#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>

class Transaction {
private:
    std::string id;
    std::string bookId;
    std::string memberId;
    std::string issueDate;
    std::string returnDate; // Empty if not returned
    std::string status;     // "issued" or "returned"

public:
    // Constructors
    Transaction();
    Transaction(std::string id, std::string bookId, std::string memberId, std::string issueDate, std::string status = "issued");

    // Getters
    std::string getId() const;
    std::string getBookId() const;
    std::string getMemberId() const;
    std::string getIssueDate() const;
    std::string getReturnDate() const;
    std::string getStatus() const;

    // Methods
    void markAsReturned(const std::string& returnDate);
};

#endif // TRANSACTION_H
