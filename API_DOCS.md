# API Documentation for Legal Case Management System

## **Authentication**
### **1. User Registration**
**Endpoint:** `POST /register`

**Description:** Registers a new user (Lawyer, Expert, or Admin).

**Headers:**
```json
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "lawyer"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "lawyer"
}
```

---
### **2. User Login**
**Endpoint:** `POST /login`

**Description:** Logs in a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUz...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "lawyer"
  }
}
```

---
## **Case Management**
### **3. Create a New Case**
**Endpoint:** `POST /cases`

**Description:** Allows a lawyer to create a new legal case.

**Headers:**
```json
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Corporate Lawsuit",
  "description": "A major corporate dispute over intellectual property.",
  "lawyer_id": 6
}
```

**Response:**
```json
{
  "id": 7,
  "title": "Corporate Lawsuit",
  "description": "A major corporate dispute over intellectual property.",
  "lawyer_id": 6,
  "created_at": "2025-02-17T15:31:50.756Z"
}
```

---
### **4. Get All Cases**
**Endpoint:** `GET /cases`

**Description:** Retrieves all cases.

**Headers:**
```json
Authorization: Bearer JWT_TOKEN
```

**Response:**
```json
[
  {
    "id": 7,
    "title": "Corporate Lawsuit",
    "description": "A major corporate dispute over intellectual property.",
    "lawyer_id": 6,
    "created_at": "2025-02-17T15:31:50.756Z"
  },
  {
    "id": 8,
    "title": "Contract Breach",
    "description": "A case involving breach of contract.",
    "lawyer_id": 6,
    "created_at": "2025-02-17T15:31:50.756Z"
  }
]
```

---
## **Expert Matching**
### **5. Get Experts by Specialization**
**Endpoint:** `GET /experts?specialization=corporate`

**Description:** Retrieves experts based on their specialization.

**Response:**
```json
[
  {
    "id": 3,
    "name": "Dr. Alice Brown",
    "specialization": "Corporate Law",
    "location": "New York"
  }
]
```

---
## **Usage Notes**
- **Authentication is required** for all endpoints except `/register` and `/login`.
- Include **JWT token** in the `Authorization` header for protected routes.
- Responses may vary based on role-based access control.

### **For more details, refer to the GitHub repository.**

