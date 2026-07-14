# 🎓 Mission Academy CMS

A production-oriented **School Website & Content Management System (CMS)** built using the **MERN Stack**. The project provides a modern public-facing school website along with a secure administrative dashboard for managing all website content dynamically without modifying the source code.

---

## 🌐 Live Demo

🚧 Public website deployment is currently in progress.

> The CMS Admin Portal is intentionally private and accessible only to authorized school administrators.

---

# 📌 Project Overview

Mission Academy CMS is designed to replace traditional static school websites with a fully dynamic content management platform.

The system enables administrators to manage banners, leadership, achievements, galleries, admissions, mandatory disclosures, enquiries, and website settings through an intuitive CMS while automatically reflecting changes on the public website.

---

# 🚀 Features

## Public Website

- Dynamic Home Page
- Hero Banner Carousel
- Leadership Messages
- Gallery & Albums
- Board Achievers
- Other Achievements
- Mandatory Disclosure Documents
- Admission Registration Form
- Contact / Enquiry Form
- School Contact Information
- Social Media Links

---

## Admin CMS

### Dashboard

- Secure Login
- Role Based Access
- JWT Authentication

### Content Management

- Banner Management
- Leadership Management
- Gallery Management
- Board Achievers
- Other Achievements
- Mandatory Disclosure
- Website Settings
- User Management
- Registration Management
- Enquiry Management

---

# 🔐 User Roles

## Super Admin

Has complete control over the CMS.

Can manage:

- Users
- Leaders
- Board Achievers
- Other Achievements
- Mandatory Disclosure
- Banners
- Albums
- Registrations
- Enquiries
- Website Settings

---

## Principal

Can manage:

- Banners
- Albums
- Registrations
- Enquiries
- Website Settings

Cannot manage:

- Users
- Leaders
- Board Achievers
- Other Achievements
- Mandatory Disclosure

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Tailwind CSS
- Context API
- Axios

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- Cloudinary

---

## Database

- MongoDB Atlas

---

## Cloud Storage

- Cloudinary

---

# 📂 Project Structure

```
Mission Academy CMS
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── context
│   ├── services
│   └── assets
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── utils
│   ├── config
│   └── server.js
│
└── README.md
```

---

# 📊 Project Statistics

| Metric | Count |
|---------|------:|
| Backend Modules | 11+ |
| REST API Endpoints | 55+ |
| MongoDB Models | 10 |
| Public APIs | 9 |
| Upload Enabled Modules | 6 |
| User Roles | 2 |
| Middleware Components | 5+ |

---

# 📦 Backend Modules

- Authentication
- User Management
- Banner Management
- Leadership Management
- Album Management
- Board Achievers
- Other Achievements
- Mandatory Disclosure
- Registration
- Enquiry
- Website Settings

---

# 🔑 Authentication

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role Based Authorization (RBAC)
- Secure Session Validation

---

# ☁ File Uploads

Supports:

- Image Upload
- PDF Upload

Integrated with:

- Cloudinary
- Multer Memory Storage

Features:

- Secure Upload
- File Replacement
- Automatic Cloud Cleanup
- File Type Validation
- File Size Validation

---

# 🗄 Database Design

MongoDB Collections

- Users
- Banners
- Leaders
- Albums
- Board Achievers
- Other Achievements
- Mandatory Disclosures
- Registrations
- Enquiries
- Settings

---

# 🔍 Features Implemented

## Authentication

- Login
- JWT Verification
- Role Validation

---

## User Management

- Create Principal
- View Users
- Toggle Status
- Reset Password
- Delete User

---

## Banner Management

- Create Banner
- Update Banner
- Delete Banner
- Reorder Banner
- Toggle Active Status

---

## Leadership Management

- Add Leader
- Update Leader
- Delete Leader
- Reorder Leader

---

## Album Management

- Create Album
- Upload Cover Image
- Upload Gallery Images
- Delete Images
- Delete Album

---

## Board Achievers

- Create
- Update
- Delete
- Public Display

---

## Other Achievements

- Create
- Update
- Delete
- Homepage Visibility Toggle

---

## Mandatory Disclosure

- Upload PDF
- Replace PDF
- Delete PDF
- Category Filter

---

## Registration

- Public Admission Form
- Status Update
- Search
- Filters

---

## Enquiry

- Public Contact Form
- Status Update
- Delete

---

## Settings

- School Contact Information
- Social Links
- CTA Visibility

---

# 🔒 Security Features

- JWT Authentication
- Role Based Access Control
- Password Hashing
- Input Validation
- ObjectId Validation
- Protected Routes
- File Type Validation
- File Size Validation

---

# 📁 Cloudinary Integration

The application stores all uploaded assets on Cloudinary.

Supported:

- Banner Images
- Leader Photos
- Album Images
- Achievement Images
- PDF Documents

Includes automatic deletion of old files during updates and record deletion to prevent orphaned cloud storage.

---

# 🚀 REST APIs

The backend exposes **55+ RESTful API endpoints** covering:

- Authentication
- Users
- Banners
- Leaders
- Albums
- Board Achievers
- Other Achievements
- Mandatory Disclosures
- Registrations
- Enquiries
- Settings

---

# 📌 API Response Format

Success

```json
{
    "success": true,
    "message": "Operation completed successfully.",
    "data": {}
}
```

Error

```json
{
    "success": false,
    "message": "Something went wrong."
}
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/mission-academy-cms.git
```

---

## Backend

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🌐 Environment Variables

Backend

```env
PORT

MONGO_URI

JWT_SECRET

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET
```

---

# 📈 Future Improvements

- Email Notifications
- Password Reset via Email
- Activity Logs
- Analytics Dashboard
- Backup & Restore
- Multi-School Support

---

# 👨‍💻 Author

**Priyanshu Gangwar**

B.Tech Computer Science Engineering

Full Stack Developer (MERN)

GitHub: https://github.com/Priyanshu-1705

LinkedIn: https://linkedin.com/in/priyanshu-gangwar


---

# 📄 License

This project is developed for educational and portfolio purposes.

---

# ⭐ Highlights

- Production-oriented MERN Stack Application
- 55+ REST APIs
- JWT Authentication
- Role Based Access Control
- Cloudinary File Storage
- Dynamic CMS
- Secure Admin Dashboard
- Modular MVC Architecture
- Public & Admin APIs
- Reusable Middleware
- Responsive UI
- Industry-standard Backend Design