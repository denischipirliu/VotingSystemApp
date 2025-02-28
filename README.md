# Secure Online Voting System

## 📌 Overview
This project is a **secure online voting system** built using **Spring Boot** (backend) and **React** (frontend). The system ensures voter authentication, secure vote casting, and result management using cryptographic techniques.

## 🚀 Features
- **Voter & Admin Roles**: Voters can cast votes securely, while admins manage elections and monitor results.
- **Secure Authentication**: Login and token validation using Spring Security.
- **PRISM Security Model**: Ensures a verifiable, tamper-proof voting process.
- **React-Based UI**: Responsive and user-friendly interface for voting and administration.
- **Database Persistence**: Uses PostgreSQL for secure data storage.

## 🛠 Technologies Used
### Backend:
- **Spring Boot** (Java)
- **Spring Security**
- **PostgreSQL**
- **JWT Authentication**

### Frontend:
- **React.js**
- **React Router**
- **Axios** (for API calls)

## 🔧 Installation & Setup
### **1️⃣ Clone the repository**
```sh
git clone https://github.com/denischipirliu/VotingSystemApp.git
cd your-repo
```

### **2️⃣ Backend Setup (Spring Boot)**
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Configure the database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/voting_system
   spring.datasource.username=your_db_user
   spring.datasource.password=your_db_password
   ```
3. Build and run the backend:
   ```sh
   mvn clean install
   mvn spring-boot:run
   ```

### **3️⃣ Frontend Setup (React)**
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

## 🏃 How to Use
1. **Sign up/Login**: Users can register and log in securely.
2. **Vote Casting**: Voters receive a secure token to cast their vote.
3. **Admin Dashboard**: Admins manage elections, view results, and oversee the process.
4. **Result Calculation**: Votes are counted and displayed securely.


