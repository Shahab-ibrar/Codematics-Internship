#include "Transaction.h"

Transaction::Transaction() : id(""), bookId(""), memberId(""), issueDate(""), returnDate(""), status("") {}

Transaction::Transaction(std::string id, std::string bookId, std::string memberId, std::string issueDate, std::string status)
    : id(id), bookId(bookId), memberId(memberId), issueDate(issueDate), returnDate(""), status(status) {}

std::string Transaction::getId() const { return id; }
std::string Transaction::getBookId() const { return bookId; }
std::string Transaction::getMemberId() const { return memberId; }
std::string Transaction::getIssueDate() const { return issueDate; }
std::string Transaction::getReturnDate() const { return returnDate; }
std::string Transaction::getStatus() const { return status; }

void Transaction::markAsReturned(const std::string& returnDate) {
    this->returnDate = returnDate;
    this->status = "returned";
}
