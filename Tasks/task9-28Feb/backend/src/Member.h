#ifndef MEMBER_H
#define MEMBER_H

#include <string>
#include <vector>

class Member {
private:
    std::string id;
    std::string name;
    std::string department;
    std::string contactInfo;
    std::vector<std::string> issuedBooks; // Store Book IDs

public:
    // Constructors
    Member();
    Member(std::string id, std::string name, std::string department, std::string contactInfo);

    // Getters
    std::string getId() const;
    std::string getName() const;
    std::string getDepartment() const;
    std::string getContactInfo() const;
    const std::vector<std::string>& getIssuedBooks() const;

    // Setters
    void setName(const std::string& name);
    void setDepartment(const std::string& department);
    void setContactInfo(const std::string& contactInfo);

    // Methods
    void addIssuedBook(const std::string& bookId);
    bool removeIssuedBook(const std::string& bookId);
    bool hasBook(const std::string& bookId) const;
};

#endif // MEMBER_H
