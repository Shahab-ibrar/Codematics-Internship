#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <sstream>
#include <winsock2.h>
#include "../include/json.hpp"
#include "LibraryManager.h"

#pragma comment(lib, "ws2_32.lib")

using json = nlohmann::json;

void handleOptions(SOCKET clientSocket) {
    std::string response = "HTTP/1.1 200 OK\r\n"
                           "Access-Control-Allow-Origin: *\r\n"
                           "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n"
                           "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
                           "Content-Length: 0\r\n\r\n";
    send(clientSocket, response.c_str(), response.length(), 0);
}

void sendJsonResponse(SOCKET clientSocket, int statusCode, const std::string& statusText, const std::string& jsonBody) {
    std::ostringstream response;
    response << "HTTP/1.1 " << statusCode << " " << statusText << "\r\n"
             << "Access-Control-Allow-Origin: *\r\n"
             << "Content-Type: application/json\r\n"
             << "Content-Length: " << jsonBody.length() << "\r\n"
             << "\r\n"
             << jsonBody;
    std::string respStr = response.str();
    send(clientSocket, respStr.c_str(), respStr.length(), 0);
}

void processRequest(SOCKET clientSocket, const std::string& method, const std::string& path, const std::string& body, LibraryManager& manager) {
    if (method == "OPTIONS") {
        handleOptions(clientSocket);
        return;
    }

    if (path == "/api/books") {
        if (method == "GET") {
            json j = json::array();
            for (const auto& book : manager.getBooks()) {
                j.push_back({
                    {"id", book.getId()}, {"title", book.getTitle()}, 
                    {"author", book.getAuthor()}, {"category", book.getCategory()}, 
                    {"quantity", book.getQuantity()}, {"available", book.isAvailable()}
                });
            }
            sendJsonResponse(clientSocket, 200, "OK", j.dump());
        } else if (method == "POST") {
            try {
                auto j = json::parse(body);
                Book book(j["id"], j["title"], j["author"], j["category"], j["quantity"]);
                if (manager.addBook(book)) sendJsonResponse(clientSocket, 201, "Created", R"({"message": "Successfully added"})");
                else sendJsonResponse(clientSocket, 400, "Bad Request", R"({"error": "ID already exists"})");
            } catch(...) { sendJsonResponse(clientSocket, 400, "Bad Request", R"({"error": "Invalid JSON"})"); }
        }
    }
    else if (path.find("/api/books/") == 0) {
        std::string id = path.substr(11); // len("/api/books/")
        if (method == "PUT") {
            try {
                auto j = json::parse(body);
                Book book(id, j["title"], j["author"], j["category"], j["quantity"]);
                if (manager.updateBook(book)) sendJsonResponse(clientSocket, 200, "OK", R"({"message": "Updated"})");
                else sendJsonResponse(clientSocket, 404, "Not Found", R"({"error": "Not Found"})");
            } catch(...) { sendJsonResponse(clientSocket, 400, "Bad Request", R"({"error": "Invalid JSON"})"); }
        } else if (method == "DELETE") {
            if (manager.deleteBook(id)) sendJsonResponse(clientSocket, 200, "OK", R"({"message": "Deleted"})");
            else sendJsonResponse(clientSocket, 404, "Not Found", R"({"error": "Not Found"})");
        }
    }
    else if (path == "/api/members") {
        if (method == "GET") {
            json j = json::array();
            for (const auto& m : manager.getMembers()) {
                j.push_back({
                    {"id", m.getId()}, {"name", m.getName()}, 
                    {"department", m.getDepartment()}, {"contactInfo", m.getContactInfo()}, 
                    {"issuedBooks", m.getIssuedBooks()}
                });
            }
            sendJsonResponse(clientSocket, 200, "OK", j.dump());
        } else if (method == "POST") {
            try {
                auto j = json::parse(body);
                Member m(j["id"], j["name"], j["department"], j["contactInfo"]);
                if (manager.addMember(m)) sendJsonResponse(clientSocket, 201, "Created", R"({"message": "Created"})");
                else sendJsonResponse(clientSocket, 400, "Bad Request", R"({"error": "Exists"})");
            } catch(...) { sendJsonResponse(clientSocket, 400, "Bad Request", R"({"error": "Invalid JSON"})"); }
        }
    }
    else if (path.find("/api/members/") == 0) {
        std::string id = path.substr(13); // len("/api/members/")
        if (method == "PUT") {
            try {
                auto j = json::parse(body);
                Member m(id, j["name"], j["department"], j["contactInfo"]);
                if (manager.updateMember(m)) sendJsonResponse(clientSocket, 200, "OK", R"({"message": "Updated"})");
                else sendJsonResponse(clientSocket, 404, "Not Found", R"({"error": "Not Found"})");
            } catch(...) { sendJsonResponse(clientSocket, 400, "Bad Request", R"({"error": "Invalid JSON"})"); }
        } else if (method == "DELETE") {
            if (manager.deleteMember(id)) sendJsonResponse(clientSocket, 200, "OK", R"({"message": "Deleted"})");
            else sendJsonResponse(clientSocket, 404, "Not Found", R"({"error": "Not Found"})");
        }
    }
    else if (path == "/api/transactions") {
        if (method == "GET") {
            json j = json::array();
            for (const auto& t : manager.getTransactions()) {
                j.push_back({
                    {"id", t.getId()}, {"bookId", t.getBookId()}, 
                    {"memberId", t.getMemberId()}, {"issueDate", t.getIssueDate()}, 
                    {"returnDate", t.getReturnDate()}, {"status", t.getStatus()}
                });
            }
            sendJsonResponse(clientSocket, 200, "OK", j.dump());
        }
    }
    else if (path == "/api/transactions/issue") {
        if (method == "POST") {
            try {
                auto j = json::parse(body);
                if (manager.issueBook(j["bookId"], j["memberId"], j["issueDate"])) 
                    sendJsonResponse(clientSocket, 201, "Created", R"({"message": "Issued"})");
                else sendJsonResponse(clientSocket, 400, "Bad Request", R"({"error": "Failed"})");
            } catch(...) { sendJsonResponse(clientSocket, 400, "Bad Request", R"({"error": "Invalid JSON"})"); }
        }
    }
    else if (path == "/api/transactions/return") {
        if (method == "POST") {
            try {
                auto j = json::parse(body);
                if (manager.returnBook(j["transactionId"], j["returnDate"])) 
                    sendJsonResponse(clientSocket, 200, "OK", R"({"message": "Returned"})");
                else sendJsonResponse(clientSocket, 400, "Bad Request", R"({"error": "Failed"})");
            } catch(...) { sendJsonResponse(clientSocket, 400, "Bad Request", R"({"error": "Invalid JSON"})"); }
        }
    }
    else if (path == "/api/stats") {
        if (method == "GET") {
            int totalBooks = 0;
            for (const auto& b : manager.getBooks()) totalBooks += b.getQuantity();
            int issuedBooks = 0;
            for (const auto& t : manager.getTransactions()) if (t.getStatus() == "issued") issuedBooks++;
            json stats = {
                {"totalBooks", manager.getBooks().size()},
                {"totalInventory", totalBooks + issuedBooks},
                {"totalMembers", manager.getMembers().size()},
                {"issuedBooks", issuedBooks}
            };
            sendJsonResponse(clientSocket, 200, "OK", stats.dump());
        }
    }
    else if (path == "/api/login") {
        if (method == "POST") {
            try {
                auto j = json::parse(body);
                if (j["username"] == "admin" && j["password"] == "admin123") {
                    sendJsonResponse(clientSocket, 200, "OK", R"({"token": "fake-jwt-token-123", "user": "admin"})");
                } else {
                    sendJsonResponse(clientSocket, 401, "Unauthorized", R"({"error": "Invalid credentials"})");
                }
            } catch(...) {
                sendJsonResponse(clientSocket, 400, "Bad Request", R"({"error": "Invalid JSON"})");
            }
        }
    }
    else {
        sendJsonResponse(clientSocket, 404, "Not Found", R"({"error": "Endpoint not found"})");
    }
}

int main() {
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        std::cerr << "WSAStartup failed.\n";
        return 1;
    }

    SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket == INVALID_SOCKET) {
        std::cerr << "Socket creation failed.\n";
        WSACleanup();
        return 1;
    }

    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(8080);
    serverAddr.sin_addr.s_addr = INADDR_ANY;

    if (bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        std::cerr << "Bind failed.\n";
        closesocket(serverSocket);
        WSACleanup();
        return 1;
    }

    if (listen(serverSocket, SOMAXCONN) == SOCKET_ERROR) {
        std::cerr << "Listen failed.\n";
        closesocket(serverSocket);
        WSACleanup();
        return 1;
    }

    LibraryManager manager("data/books.json", "data/members.json", "data/transactions.json");
    std::cout << "Server starting at http://localhost:8080\n";

    while (true) {
        SOCKET clientSocket = accept(serverSocket, NULL, NULL);
        if (clientSocket == INVALID_SOCKET) {
            continue;
        }

        // Read the full HTTP request (headers + body)
        std::string request = "";
        char buffer[4096];
        
        // Step 1: Keep reading until we have all headers (\r\n\r\n)
        while (true) {
            memset(buffer, 0, sizeof(buffer));
            int bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
            if (bytesReceived <= 0) break;
            request.append(buffer, bytesReceived);
            if (request.find("\r\n\r\n") != std::string::npos) break;
        }

        if (request.empty()) {
            closesocket(clientSocket);
            continue;
        }

        // Parse the request line
        std::istringstream requestStream(request);
        std::string method, path, version;
        requestStream >> method >> path >> version;

        // Find headers end
        size_t headerEnd = request.find("\r\n\r\n");
        std::string body = "";

        if (headerEnd != std::string::npos) {
            // Step 2: Extract Content-Length from headers
            int contentLength = 0;
            std::string headers = request.substr(0, headerEnd);
            std::string clHeader = "Content-Length:";
            size_t clPos = headers.find(clHeader);
            if (clPos == std::string::npos) {
                clHeader = "content-length:";
                clPos = headers.find(clHeader);
            }
            if (clPos != std::string::npos) {
                size_t valStart = clPos + clHeader.length();
                size_t valEnd = headers.find("\r\n", valStart);
                if (valEnd == std::string::npos) valEnd = headers.length();
                std::string clValue = headers.substr(valStart, valEnd - valStart);
                // Trim whitespace
                size_t first = clValue.find_first_not_of(" \t");
                if (first != std::string::npos) {
                    contentLength = std::atoi(clValue.substr(first).c_str());
                }
            }

            // Step 3: Get body we already have
            body = request.substr(headerEnd + 4);

            // Step 4: Keep reading until we have the full body
            while ((int)body.length() < contentLength) {
                memset(buffer, 0, sizeof(buffer));
                int bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
                if (bytesReceived <= 0) break;
                body.append(buffer, bytesReceived);
            }

            // Trim body to exact content length
            if (contentLength > 0 && (int)body.length() > contentLength) {
                body = body.substr(0, contentLength);
            }
        }

        std::cout << method << " " << path << " body=[" << body << "]" << std::endl;
        processRequest(clientSocket, method, path, body, manager);
        closesocket(clientSocket);
    }

    closesocket(serverSocket);
    WSACleanup();
    return 0;
}
