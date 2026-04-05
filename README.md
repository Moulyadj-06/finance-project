#  Finance Data Processing & Access Control Backend

##  Overview
This project is a backend system designed for a Finance Dashboard Application, enabling users with different roles to manage and analyze financial data securely.

The system focuses on:
- Clean backend architecture
- Role-based access control
- Financial data processing
- Scalable API design

---

##  Features

###  1. User & Role Management
- User registration and login
- Role-based access system:
  - Admin → Full control (CRUD + user management)
  - Analyst → Read records + view insights
  - Viewer → View-only access
- JWT-based authentication
- Password hashing using bcrypt

---

###  2. Financial Records Management
Supports complete CRUD operations:

- Create financial records
- View records
- Update records
- Delete records

Each record contains:
- Amount
- Type (Income / Expense)
- Category
- Date
- Notes
- Associated User

---

###  3. Dashboard Summary APIs
Provides aggregated financial insights:

- Total Income
- Total Expenses
- Net Balance
- Category-wise breakdown
- Recent transactions

---

###  4. Access Control (RBAC)

| Role     | Permissions |
|----------|------------|
| Admin    | Full access |
| Analyst  | Read + Insights |
| Viewer   | Read-only |

- Protected routes using JWT
- Role-based middleware

---

###  5. Validation & Error Handling
- Input validation
- Proper HTTP status codes
- Error handling using try-catch
- Secure API responses

---

###  6. Data Persistence
- MongoDB used as database
- Mongoose for schema modeling

---

##  Tech Stack

- Backend: Node.js, Express.js  
- Database: MongoDB  
- Authentication: JWT  
- Security: bcrypt.js  

---

##  Authentication Flow

1. User logs in
2. Server generates JWT token
3. Token is stored on client
4. Protected APIs require:


---

##  API Endpoints

###  Auth Routes
- POST /api/auth/register → Register user  
- POST /api/auth/login → Login user  

---

###  User (Admin Only)
- GET /api/dashboard/users → Get all users  

---

###  Records
- POST /api/records → Create record  
- GET /api/records → Get records  
- PUT /api/records/:id → Update record  
- DELETE /api/records/:id → Delete record  

---

###  Dashboard
- GET /api/dashboard/summary → Financial summary  
- GET /api/dashboard/analytics → Insights  

---

##  Access Control

Implemented using middleware:

- authMiddleware → verifies JWT token  
- roleMiddleware → restricts access based on role  

---

##  Setup Instructions

### 1. Clone Repository

git clone <your-repo-link>
cd backend


### 2. Install Dependencies

npm install


### 3. Create .env file

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key


### 4. Run Server

npm run dev

---

##  Testing

Use Postman or Thunder Client.

Make sure to include:

Authorization: Bearer <token>


---

##  Assumptions
- Each record belongs to a user
- Admin has full access
- Analyst and Viewer have limited permissions

---

##  Future Improvements
- Pagination
- Search & filtering
- Graph analytics
- Swagger API docs
- Unit testing

---

##  Conclusion
This project demonstrates backend design, role-based access control, and financial data processing in a clean and scalable way.

