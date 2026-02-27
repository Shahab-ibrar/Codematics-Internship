@echo off
echo Building Library Management System Backend...
g++ -O2 -std=c++11 -DWIN32_LEAN_AND_MEAN -D_WIN32_WINNT=0x0601 src\*.cpp -o LibraryServer -lws2_32 -lwsock32 -lmswsock -ladvapi32
if %errorlevel% neq 0 (
    echo Build failed.
    exit /b %errorlevel%
)
echo Build succeeded! Run LibraryServer.exe to start the server.
