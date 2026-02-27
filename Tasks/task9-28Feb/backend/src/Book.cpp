#include "Book.h"

Book::Book() : id(""), title(""), author(""), category(""), quantity(0) {}

Book::Book(std::string id, std::string title, std::string author, std::string category, int quantity)
    : id(id), title(title), author(author), category(category), quantity(quantity) {}

std::string Book::getId() const { return id; }
std::string Book::getTitle() const { return title; }
std::string Book::getAuthor() const { return author; }
std::string Book::getCategory() const { return category; }
int Book::getQuantity() const { return quantity; }

bool Book::isAvailable() const {
    return quantity > 0;
}

void Book::setTitle(const std::string& title) { this->title = title; }
void Book::setAuthor(const std::string& author) { this->author = author; }
void Book::setCategory(const std::string& category) { this->category = category; }
void Book::setQuantity(int quantity) { this->quantity = quantity; }

bool Book::issueBook() {
    if (quantity > 0) {
        quantity--;
        return true;
    }
    return false;
}

void Book::returnBook() {
    quantity++;
}
