#ifndef BOOK_H
#define BOOK_H

#include <string>

class Book {
private:
    std::string id;
    std::string title;
    std::string author;
    std::string category;
    int quantity;

public:
    // Constructors
    Book();
    Book(std::string id, std::string title, std::string author, std::string category, int quantity);

    // Getters
    std::string getId() const;
    std::string getTitle() const;
    std::string getAuthor() const;
    std::string getCategory() const;
    int getQuantity() const;
    bool isAvailable() const;

    // Setters
    void setTitle(const std::string& title);
    void setAuthor(const std::string& author);
    void setCategory(const std::string& category);
    void setQuantity(int quantity);

    // Methods
    bool issueBook();
    void returnBook();
};

#endif // BOOK_H
