#include "Member.h"
#include <algorithm>

Member::Member() : id(""), name(""), department(""), contactInfo("") {}

Member::Member(std::string id, std::string name, std::string department, std::string contactInfo)
    : id(id), name(name), department(department), contactInfo(contactInfo) {}

std::string Member::getId() const { return id; }
std::string Member::getName() const { return name; }
std::string Member::getDepartment() const { return department; }
std::string Member::getContactInfo() const { return contactInfo; }
const std::vector<std::string>& Member::getIssuedBooks() const { return issuedBooks; }

void Member::setName(const std::string& name) { this->name = name; }
void Member::setDepartment(const std::string& department) { this->department = department; }
void Member::setContactInfo(const std::string& contactInfo) { this->contactInfo = contactInfo; }

void Member::addIssuedBook(const std::string& bookId) {
    if (!hasBook(bookId)) {
        issuedBooks.push_back(bookId);
    }
}

bool Member::removeIssuedBook(const std::string& bookId) {
    auto it = std::find(issuedBooks.begin(), issuedBooks.end(), bookId);
    if (it != issuedBooks.end()) {
        issuedBooks.erase(it);
        return true;
    }
    return false;
}

bool Member::hasBook(const std::string& bookId) const {
    return std::find(issuedBooks.begin(), issuedBooks.end(), bookId) != issuedBooks.end();
}
