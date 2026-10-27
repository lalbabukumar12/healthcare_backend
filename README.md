# Healthcare Backend API

A production-grade Healthcare Management REST API built with **Node.js**, **Express.js**, **PostgreSQL**, **Sequelize ORM**, and **JWT Authentication**.

---

## 1. Project Overview
The **Healthcare Backend API** provides secure management for healthcare clinics, doctors, and patients. It features role-aware access controls, robust relational mappings between patients and doctors, centralized operational error handling, and declarative Joi schema validation.

---

## 2. Tech Stack
- **Runtime Environment**: [Node.js](https://nodejs.org/) (v18+)
- **Web Framework**: [Express.js](https://expressjs.com/) (v5)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (v14+)
- **Object-Relational Mapping (ORM)**: [Sequelize](https://sequelize.org/) (`pg`, `pg-hstore`)
- **Authentication & Security**: [JSON Web Tokens (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken), [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors)
- **Request Validation**: [Joi](https://joi.dev/)
- **Logging & Monitoring**: [Morgan](https://github.com/expressjs/morgan)
- **Development Tooling**: [Nodemon](https://nodemon.io/)

---

## 3. Features
- **User Authentication**: Secure user registration and login with bcrypt password hashing (10 salt rounds) and JWT expiration.
- **Patient Management**: Full CRUD operations for patient records scoped strictly to the authenticated user who created them.
- **Doctor Directory**: Global doctor directory accessible to all authenticated providers; updates and deletions restricted to the doctor's creator.
- **Patient-Doctor Mapping**: Assign multiple doctors to patients through an associative model with composite unique constraints and database-level cascade deletes.
- **Input Validation**: Strict request sanitization and validation with descriptive error reporting using Joi schemas.
- **Operational Error Handling**: Centralized error interceptor providing structured JSON responses for validation errors, duplicate keys, foreign-key violations, token expirations, and malformed payloads.

---

## 4. Project Structure
```text
healthcare-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection & Sequelize initialization
│   ├── controllers/
│   │   ├── authController.js     # User registration and JWT login handlers
│   │   ├── patientController.js  # Patient CRUD and ownership enforcement
│   │   ├── doctorController.js   # Doctor management and creator permissions
│   │   └── mappingController.js  # Patient-Doctor association handlers
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & req.user injection
│   │   ├── errorHandler.js       # Centralized 404 & global error handling
│   │   └── validate.js           # Joi schema validation middleware
│   ├── models/
│   │   ├── index.js              # Model associations & exports
│   │   ├── User.js               # User model with password serialization redaction
│   │   ├── Patient.js            # Patient model definition
│   │   ├── Doctor.js             # Doctor model definition
│   │   └── Mapping.js            # Junction model with composite unique index
│   ├── routes/
│   │   ├── index.js              # Master API router (/api)
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── patientRoutes.js      # /api/patients routes
│   │   ├── doctorRoutes.js       # /api/doctors routes
│   │   └── mappingRoutes.js      # /api/mappings routes
│   ├── utils/
│   │   ├── ApiError.js           # Custom operational error class
│   │   ├── asyncHandler.js       # Async wrapper for route handlers
│   │   └── response.js           # Standardized API response utility
│   ├── app.js                    # Express application and middleware configuration
│   └── server.js                 # Server entry point with graceful startup/shutdown
├── .env                          # Local environment variables (ignored by git)
├── .env.example                  # Environment configuration template
├── .gitignore
├── nodemon.json                  # Nodemon watch configuration & debounce settings
├── package.json
├── postman_collection.json       # Postman Collection v2.1 with automated scripts
└── README.md
```

---

## 5. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **PostgreSQL**: `v14.0` or higher installed and running locally or remotely

---

## 6. Setup Instructions

### Step 1: Clone Repository & Install Dependencies
```bash
git clone <repository_url>
cd healthcare-backend
npm install
```

### Step 2: Create PostgreSQL Database
Connect to PostgreSQL via `psql` or pgAdmin:
```sql
CREATE DATABASE healthcare_db;
```
*(Note: The server also contains built-in self-provisioning logic that will attempt to create the database automatically on startup if it does not yet exist).*

### Step 3: Configure Environment Variables
Copy the template `.env.example` to `.env`:
```bash
cp .env.example .env
```

Generate a secure 256-bit JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Fill in your database credentials and secret in `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_generated_secret
JWT_EXPIRES_IN=1d
```

### Step 4: Run the Application
- **Development Mode** (auto-reload via nodemon):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

---

## 7. Environment Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Integer | `5000` | Port on which Express server listens |
| `DB_HOST` | String | `localhost` | PostgreSQL host address |
| `DB_PORT` | Integer | `5432` | PostgreSQL port |
| `DB_NAME` | String | `healthcare_db` | PostgreSQL database name |
| `DB_USER` | String | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | String | — | PostgreSQL password |
| `JWT_SECRET` | String | — | Secret key used for signing and verifying JWTs |
| `JWT_EXPIRES_IN`| String | `1d` | Token expiration duration (e.g., `1d`, `7d`, `12h`) |

---

## 8. Authentication
Protected routes require a valid JSON Web Token supplied in the HTTP request header:
```http
Authorization: Bearer <your_jwt_token>
```
If the header is missing, malformed, or the token is expired/invalid, the API returns `401 Unauthorized`.

---

## 9. Standard Response Formats

### Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response (`400`, `401`, `403`, `404`, `409`, `500`)
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

---

## 10. Authorization Rules
1. **Patients**: Private to the user who created them. Only the owner can view (`GET`), update (`PUT`), or delete (`DELETE`) their own patients.
2. **Doctors**: Public directory. All authenticated users can list (`GET /api/doctors`) and view doctor profiles (`GET /api/doctors/:id`). Only the doctor's creator can update (`PUT`) or delete (`DELETE`) that doctor.
3. **Mappings**: Restricted to the owner of the patient. Only the user who created the patient can assign doctors, list mappings for that patient, or remove doctor mappings.

---

## 11. API Documentation

### Auth Endpoints

#### 1. Register User
- **Method & URL**: `POST /api/auth/register`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "Dr. John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": 1,
      "name": "Dr. John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2026-10-27T17:25:07.930Z",
      "updatedAt": "2026-10-27T17:25:07.930Z"
    }
  }
  ```
- **Errors**:
  - `400 Bad Request`: Validation failure (name < 2 chars, invalid email, password < 6 chars).
  - `409 Conflict`: `{"success": false, "message": "Email already registered"}`.

#### 2. Login User
- **Method & URL**: `POST /api/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "name": "Dr. John Doe",
        "email": "john.doe@example.com"
      }
    }
  }
  ```
- **Errors**:
  - `401 Unauthorized`: `{"success": false, "message": "Invalid email or password"}`.

---

### Patient Endpoints

#### 3. Create Patient
- **Method & URL**: `POST /api/patients`
- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
  ```json
  {
    "name": "Michael Scott",
    "age": 45,
    "gender": "male",
    "phone": "+1-555-1234567",
    "address": "1725 Slough Avenue, Scranton, PA",
    "medical_history": "Seasonal allergies, mild asthma"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Patient created successfully",
    "data": {
      "id": 1,
      "name": "Michael Scott",
      "age": 45,
      "gender": "male",
      "phone": "+1-555-1234567",
      "address": "1725 Slough Avenue, Scranton, PA",
      "medical_history": "Seasonal allergies, mild asthma",
      "createdBy": 1,
      "createdAt": "2026-10-27T17:33:36.180Z",
      "updatedAt": "2026-10-27T17:33:36.180Z"
    }
  }
  ```
- **Errors**:
  - `400 Bad Request`: Validation failure (missing required fields, negative age, invalid gender).
  - `401 Unauthorized`: Token missing or invalid.

#### 4. List Own Patients
- **Method & URL**: `GET /api/patients`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Patients retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "Michael Scott",
        "age": 45,
        "gender": "male",
        "phone": "+1-555-1234567",
        "address": "1725 Slough Avenue, Scranton, PA",
        "medical_history": "Seasonal allergies, mild asthma",
        "createdBy": 1,
        "createdAt": "2026-10-27T17:33:36.180Z",
        "updatedAt": "2026-10-27T17:33:36.180Z"
      }
    ]
  }
  ```

#### 5. Get Patient by ID
- **Method & URL**: `GET /api/patients/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Patient retrieved successfully",
    "data": {
      "id": 1,
      "name": "Michael Scott",
      "age": 45,
      "gender": "male",
      "phone": "+1-555-1234567",
      "address": "1725 Slough Avenue, Scranton, PA",
      "medical_history": "Seasonal allergies, mild asthma",
      "createdBy": 1,
      "doctors": [
        {
          "id": 1,
          "name": "Dr. Gregory House",
          "specialization": "Diagnostic Medicine"
        }
      ]
    }
  }
  ```
- **Errors**:
  - `403 Forbidden`: `{"success": false, "message": "You do not have access to this patient"}`.
  - `404 Not Found`: `{"success": false, "message": "Patient not found"}`.

#### 6. Update Patient
- **Method & URL**: `PUT /api/patients/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body** (at least one field required):
  ```json
  {
    "age": 46,
    "address": "Scranton Business Park, PA"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Patient updated successfully",
    "data": {
      "id": 1,
      "name": "Michael Scott",
      "age": 46,
      "gender": "male",
      "phone": "+1-555-1234567",
      "address": "Scranton Business Park, PA",
      "medical_history": "Seasonal allergies, mild asthma",
      "createdBy": 1,
      "updatedAt": "2026-10-27T17:35:10.120Z"
    }
  }
  ```
- **Errors**:
  - `400 Bad Request`: Empty update body or invalid data types.
  - `403 Forbidden`: Attempting to edit another user's patient.
  - `404 Not Found`: Patient does not exist.

#### 7. Delete Patient
- **Method & URL**: `DELETE /api/patients/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Patient deleted successfully",
    "data": null
  }
  ```
- **Errors**:
  - `403 Forbidden`: Attempting to delete another user's patient.
  - `404 Not Found`: Patient does not exist.

---

### Doctor Endpoints

#### 8. Create Doctor
- **Method & URL**: `POST /api/doctors`
- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
  ```json
  {
    "name": "Dr. Gregory House",
    "specialization": "Diagnostic Medicine",
    "email": "house@example.com",
    "phone": "+1-555-9876543",
    "experience_years": 20
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Doctor created successfully",
    "data": {
      "id": 1,
      "name": "Dr. Gregory House",
      "specialization": "Diagnostic Medicine",
      "email": "house@example.com",
      "phone": "+1-555-9876543",
      "experience_years": 20,
      "createdBy": 1,
      "createdAt": "2026-10-27T17:37:17.974Z",
      "updatedAt": "2026-10-27T17:37:17.974Z"
    }
  }
  ```
- **Errors**:
  - `400 Bad Request`: Missing specialization, invalid email, experience < 0.
  - `409 Conflict`: `{"success": false, "message": "Doctor with this email already exists"}`.

#### 9. List All Doctors
- **Method & URL**: `GET /api/doctors`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Doctors retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "Dr. Gregory House",
        "specialization": "Diagnostic Medicine",
        "email": "house@example.com",
        "phone": "+1-555-9876543",
        "experience_years": 20,
        "createdBy": 1
      }
    ]
  }
  ```

#### 10. Get Doctor by ID
- **Method & URL**: `GET /api/doctors/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Doctor retrieved successfully",
    "data": {
      "id": 1,
      "name": "Dr. Gregory House",
      "specialization": "Diagnostic Medicine",
      "email": "house@example.com",
      "phone": "+1-555-9876543",
      "experience_years": 20,
      "createdBy": 1
    }
  }
  ```
- **Errors**:
  - `404 Not Found`: `{"success": false, "message": "Doctor not found"}`.

#### 11. Update Doctor
- **Method & URL**: `PUT /api/doctors/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body** (at least one field required):
  ```json
  {
    "experience_years": 21,
    "phone": "+1-555-9876544"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Doctor updated successfully",
    "data": {
      "id": 1,
      "name": "Dr. Gregory House",
      "specialization": "Diagnostic Medicine",
      "email": "house@example.com",
      "phone": "+1-555-9876544",
      "experience_years": 21,
      "createdBy": 1
    }
  }
  ```
- **Errors**:
  - `403 Forbidden`: `{"success": false, "message": "You can only modify doctors you created"}`.
  - `404 Not Found`: Doctor not found.
  - `409 Conflict`: New email is already used by another doctor.

#### 12. Delete Doctor
- **Method & URL**: `DELETE /api/doctors/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Doctor deleted successfully",
    "data": null
  }
  ```
- **Errors**:
  - `403 Forbidden`: `{"success": false, "message": "You can only modify doctors you created"}`.
  - `404 Not Found`: Doctor not found.

---

### Patient-Doctor Mapping Endpoints

#### 13. Assign Doctor to Patient
- **Method & URL**: `POST /api/mappings`
- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
  ```json
  {
    "patientId": 1,
    "doctorId": 1
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Doctor assigned to patient successfully",
    "data": {
      "id": 1,
      "patientId": 1,
      "doctorId": 1,
      "createdAt": "2026-10-27T17:39:00.000Z",
      "patient": {
        "id": 1,
        "name": "Michael Scott"
      },
      "doctor": {
        "id": 1,
        "name": "Dr. Gregory House",
        "specialization": "Diagnostic Medicine"
      }
    }
  }
  ```
- **Errors**:
  - `400 Bad Request`: Validation failure on non-integer or missing IDs.
  - `403 Forbidden`: `{"success": false, "message": "You can only assign doctors to your own patients"}`.
  - `404 Not Found`: Patient or Doctor record does not exist.
  - `409 Conflict`: `{"success": false, "message": "This doctor is already assigned to this patient"}`.

#### 14. List All User's Mappings
- **Method & URL**: `GET /api/mappings`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Mappings retrieved successfully",
    "data": [
      {
        "id": 1,
        "patientId": 1,
        "doctorId": 1,
        "createdAt": "2026-10-27T17:39:00.000Z",
        "patient": {
          "id": 1,
          "name": "Michael Scott"
        },
        "doctor": {
          "id": 1,
          "name": "Dr. Gregory House",
          "specialization": "Diagnostic Medicine"
        }
      }
    ]
  }
  ```

#### 15. Get Doctors Assigned to Patient
- **Method & URL**: `GET /api/mappings/:patient_id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Doctors retrieved successfully",
    "data": {
      "id": 1,
      "name": "Michael Scott",
      "patient": {
        "id": 1,
        "name": "Michael Scott"
      },
      "doctors": [
        {
          "mappingId": 1,
          "id": 1,
          "name": "Dr. Gregory House",
          "specialization": "Diagnostic Medicine",
          "email": "house@example.com",
          "phone": "+1-555-9876543",
          "experience_years": 20
        }
      ]
    }
  }
  ```
- **Errors**:
  - `403 Forbidden`: Attempting to query doctors for another user's patient.
  - `404 Not Found`: Patient does not exist.

#### 16. Remove Doctor from Patient
- **Method & URL**: `DELETE /api/mappings/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Doctor removed from patient successfully",
    "data": null
  }
  ```
- **Errors**:
  - `403 Forbidden`: `{"success": false, "message": "You can only modify mappings of your own patients"}`.
  - `404 Not Found`: Mapping not found.

---

## 12. Testing with Postman
A pre-configured Postman collection is included in the project root: `postman_collection.json`.

### How to Import & Use:
1. Open Postman and click **Import** in the upper left.
2. Select or drag-and-drop [postman_collection.json](file:///c:/Users/lalu6/Desktop/Healthcare_Backend/healthcare-backend/postman_collection.json).
3. The collection is organized into a sequential flow:
   - **Auth**: Register User -> Login User (automatically extracts and sets the `{{token}}` variable).
   - **Patients**: Create Patient (saves `{{patientId}}`) -> Get Patients -> Get by ID -> Update -> Delete.
   - **Doctors**: Create Doctor (saves `{{doctorId}}`) -> Get Doctors -> Get by ID -> Update -> Delete.
   - **Mappings**: Assign Doctor (saves `{{mappingId}}`) -> List All Mappings -> Get Doctors by Patient -> Remove Doctor.
4. All child requests inherit collection-level Bearer token authentication automatically.

---

## 13. HTTP Status Codes

| Code | Status | Meaning in this API |
| :--- | :--- | :--- |
| `200` | OK | Successful retrieval, update, or deletion |
| `201` | Created | Successfully created user, patient, doctor, or mapping |
| `400` | Bad Request | Validation error, malformed JSON, or missing required fields |
| `401` | Unauthorized | Missing, invalid, or expired JWT token, or incorrect login credentials |
| `403` | Forbidden | Authenticated, but user does not own the requested resource |
| `404` | Not Found | Route or requested resource ID does not exist |
| `409` | Conflict | Duplicate record (email or patient-doctor pair already registered) |
| `500` | Internal Server Error | Unhandled server exception (stack trace included in dev mode only) |

---

## License
ISC
