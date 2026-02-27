# Library Management System Pro

A comprehensive Library Management System designed with a modern frontend architecture and a robust C++ backend. This project demonstrates Object-Oriented Programming (OOP), file-based data persistence (JSON), and seamless client-server integration.

## 🚀 Features

- **Book Management:** Add, Update, Search, and Delete books. Real-time availability tracking.
- **Member Management:** Register and manage library members. Track total books issued per member.
- **Issue & Return Module:** Handle book borrowing and returns with automated quantity updates and transaction histories.
- **Dashboard Overview:** High-level metrics at a glance using a sleek UI.
- **Modern Aesthetic:** Built with Tailwind CSS, featuring glassmorphism elements, micro-animations, and Dark/Light mode toggle.

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    subgraph Frontend [HTML / TailwindCSS / JS]
        UI[User Interface]
        JS[JavaScript Modules]
        API_Client[API Client fetch]

        UI <--> JS
        JS <--> API_Client
    end

    subgraph Backend [C++ Winsock HTTP Server]
        Server[HttpServer main.cpp]
        LM[LibraryManager class]
        Models[Models: Book, Member, Transaction]

        Server <--> LM
        LM <--> Models
    end

    subgraph Storage [JSON Persistence]
        BooksDB[(books.json)]
        MembersDB[(members.json)]
        TxDB[(transactions.json)]
    end

    API_Client <-->|REST APIs / HTTP| Server
    LM <--> BooksDB
    LM <--> MembersDB
    LM <--> TxDB
```

---

## 🔀 System Workflow Flowchart

```mermaid
flowchart TD
    Start([User Logs In / Opens Dashboard]) --> SelectAction{Choose Action}

    SelectAction -->|Manage Books| BooksPage(Books Management)
    SelectAction -->|Manage Members| MembersPage(Members Management)
    SelectAction -->|Issue/Return| TxPage(Transaction Management)

    BooksPage --> BookAction{Action?}
    BookAction -->|Add/Edit| UpdateBook[Save Data to Backend]
    BookAction -->|Delete| DeleteBook[Remove from Backend]

    MembersPage --> MemAction{Action?}
    MemAction -->|Add/Edit| UpdateMem[Save Data to Backend]
    MemAction -->|Delete| DeleteMem[Remove from Backend]

    TxPage --> TxAction{Action?}
    TxAction -->|Issue Book| Issue[Verify Stock & Issue]
    TxAction -->|Return Book| Return[Update Status to Returned]

    UpdateBook --> jsonDB[(JSON DB)]
    DeleteBook --> jsonDB
    UpdateMem --> jsonDB
    DeleteMem --> jsonDB
    Issue --> jsonDB
    Return --> jsonDB
```

---

## 🛠️ Installation & Running

### Requirements

- **OS:** Windows (For compiling the native Winsock C++ server)
- **Compiler:** g++ (MinGW)
- **Browser:** Any modern web browser (Edge, Chrome, Firefox)

### Step 1: Compile and Run the Backend

1. Open PowerShell or Command Prompt.
2. Navigate to the `backend` directory:
   ```cmd
   cd backend
   ```
3. Run the build script:
   ```cmd
   .\build.bat
   ```
4. If the build succeeds, start the server:
   ```cmd
   .\LibraryServer.exe
   ```
   _You should see `Server starting at http://localhost:8080`._

### Step 2: Open the Frontend

1. While the backend server is running, navigate to the `frontend` folder.
2. Open `index.html` directly in your web browser.
3. You will be redirected to the secure **Login Page**. Use the default Administrator credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
4. (Optional) For the best experience, host the frontend via a local static server like `Live Server` in VS Code, but opening the local file directly works fine because CORS is enabled.

---

## 💻 Tech Stack

- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript, FontAwesome
- **Backend:** C++11 (OOP), Raw Winsock API
- **Data Persistence:** JSON (`nlohmann::json`)

---

Developed for educational purposes to simulate a real-world client/server architecture.
