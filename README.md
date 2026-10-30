# ☁️ Cloud File Sharing Platform – Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

A RESTful backend for a **Google Drive-inspired Cloud File Sharing Platform**, built using Node.js, Express.js, MongoDB, and Mongoose.

The application allows users to securely register, authenticate, upload and manage files, organize files into folders, and share files through publicly accessible links with optional expiration.

## ✨ Features

- **User Authentication**
  - User registration and login.
  - JWT-based authentication.
  - Password hashing using bcrypt.

- **File Management**
  - Upload files using Multer.
  - Download uploaded files.
  - Rename and delete files.
  - View file metadata.
  - Paginated file listing.

- **Folder Management**
  - Create folders.
  - Organize files inside folders.
  - List folders.
  - Delete empty folders.

- **File Sharing**
  - Generate unique public sharing links.
  - Set optional link expiration.
  - Download files using public links.
  - Revoke existing sharing links.
  - Track download counts.

- **Security**
  - Protected API endpoints.
  - User-specific file and folder ownership.
  - Password hashing.
  - Helmet security headers.
  - API rate limiting.
  - CORS configuration.
  - Centralized error handling.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| JavaScript | Backend programming language |
| JWT | Authentication and authorization |
| bcryptjs | Password hashing |
| Multer | File upload handling |
| Helmet | HTTP security headers |
| Morgan | HTTP request logging |
| express-rate-limit | API rate limiting |
| dotenv | Environment variable management |

## 📁 Project Structure

```text
cloud-file-sharing-backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── file.controller.js
│   │   ├── folder.controller.js
│   │   └── share.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── File.js
│   │   ├── Folder.js
│   │   └── Share.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── file.routes.js
│   │   ├── folder.routes.js
│   │   └── share.routes.js
│   │
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   └── token.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ajinkya029/cloud-file-sharing-backend.git
```

```bash
cd cloud-file-sharing-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/cloud_file_sharing

JWT_SECRET=your_generated_random_secret
JWT_EXPIRES_IN=7d

CLIENT_ORIGIN=http://localhost:5173

UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=50
```

Generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Replace `your_generated_random_secret` with the generated value.

### 4. Start MongoDB

Make sure your MongoDB server is running, or configure your MongoDB Atlas connection string in `.env`.

### 5. Run the Development Server

```bash
npm run dev
```

For production:

```bash
npm start
```

The backend will run at:

```text
http://localhost:5000
```

### 6. Verify the Server

Visit:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "cloud-file-sharing-api"
}
```

## 🔗 API Documentation

Base URL:

```text
http://localhost:5000/api
```

### 🔐 Authentication APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |

### 📂 Folder APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/folders` | Create a folder | Private |
| GET | `/folders` | Get folders | Private |
| DELETE | `/folders/:id` | Delete an empty folder | Private |

### 📄 File APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/files/upload` | Upload a file | Private |
| GET | `/files` | Get uploaded files | Private |
| GET | `/files/:id` | Get file details | Private |
| GET | `/files/:id/download` | Download a file | Private |
| PATCH | `/files/:id` | Rename a file | Private |
| DELETE | `/files/:id` | Delete a file | Private |

### 🔗 File Sharing APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/shares/:fileId` | Generate sharing link | Private |
| GET | `/shares` | Get active sharing links | Private |
| DELETE | `/shares/:id` | Revoke sharing link | Private |
| GET | `/shares/:token` | Download shared file | Public |

## 🔑 Authentication

Protected endpoints require a JWT token in the request header.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Register or log in to receive an authentication token.

## 📤 File Upload Example

Files are uploaded using `multipart/form-data`.

Example using cURL:

```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@./sample.pdf"
```

To upload a file inside a folder, include the `folderId` field.

## 🔗 Generate a File Sharing Link

```bash
curl -X POST http://localhost:5000/api/shares/FILE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"expiresInHours":24}'
```

The API returns a unique public sharing URL that can be used to download the file.

## 🔒 Security Considerations

- Passwords are hashed before storing them in MongoDB.
- JWT tokens protect private endpoints.
- File and folder ownership is verified before allowing access.
- Public sharing links use cryptographically random tokens.
- Sharing links can be revoked or configured to expire.
- API requests are rate-limited.
- Environment variables are used for sensitive configuration.

## 🚀 Future Improvements

- AWS S3 or Cloudinary cloud storage integration.
- File previews for images, PDFs, and videos.
- Drag-and-drop file uploads.
- Storage quota management.
- Password-protected sharing links.
- File and folder search.
- Nested folder navigation.
- Email notifications for shared files.
- File version history.
- Admin dashboard.

## ⚠️ Storage Note

Currently, files are stored locally on the server using Multer.

For production deployment, cloud object storage such as AWS S3 is recommended for scalability, durability, and easier file management.

## 👨‍💻 Author

**Ajinkya Dhatrak**

GitHub: [@ajinkya029](https://github.com/ajinkya029)

---

⭐ If you find this project useful, consider giving it a star!
