# React chat application

This frontend works with [this NestJS backend](https://github.com/yuriiter/nest-chat).

![Screenshot](https://github.com/yuriiter/react-chat/blob/main/preview.png?raw=true)
![Preview](https://github.com/yuriiter/react-chat/blob/main/preview.gif?raw=true)

## Features

### 1. Send Files and Images
Chat application supports sending of files and images, enabling users to share various types of media seamlessly within the chat.

### 2. Secure Files
All files and images sent through the chat are securely stored and protected on the backend. Access to these files is restricted to authorized users only (any unauthorized request to the backend will fail to get the files as well as messages).

### 3. Real-Time Communication with WebSockets
The application utilizes WebSocket technology to provide real-time communication capabilities.

### 4. Real-Time Typing Indicator
When a user is typing a message or sending a file, other participant in the chat will see an animated 'sending a message...' indicator.

## Backend Features

### 1. Nest.js Framework
The backend of the chat application is built using Nest.js and TypeScript, a progressive Node.js framework.

### 2. Prisma ORM
To manage the database, my application uses Prisma - ORM (Object-Relational Mapper) for JavaScript.

### 3. Secure File and Image Handling
The backend ensures that all files and images sent through the chat are securely stored and protected. Access to these files is restricted, ensuring they are only available to authorized users.

### 4. Real-Time Communication with WebSockets
The backend employs WebSockets for real-time communication.

### 5. Authentication and Authorization
The backend includes authentication and authorization mechanisms.

## How to run

In the project directory, run:
```
npm i
npm run start
```
