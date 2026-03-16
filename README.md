# ZigNote 📝

ZigNote is a full-stack notes management application that allows users to securely create, organize, search, and manage notes. The application provides authentication, tagging, pinning, and keyword search to improve productivity.

## 🚀 Features
- User authentication using JWT
- Email verification during sign up
- Create, update, and delete notes
- Pin important notes
- Tag-based note organization
- Search notes by keywords
- Secure backend API with Express.js
- Responsive frontend UI with React and Tailwind CSS

## 🛠 Tech Stack

### Frontend
- React.js
- Axios for API calls
- Tailwind CSS for styling
- React Router for navigation
- React Icons for UI elements

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- CORS for cross-origin requests

## 📂 Project Structure

```
ZigNote/
├── backend/
│   ├── models/
│   │   └── user.model.js
│   ├── config.json
│   ├── index.js
│   ├── mailer.js
│   ├── package.json
│   ├── utilities.js
│   └── .env
├── frontend/
│   └── zigNote/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── utils/
│       │   └── assets/
│       ├── package.json
│       └── vite.config.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend folder with:
   ```
   ACCESS_TOKEN_SECRET=your_jwt_secret_here
   MONGO_URI=your_mongodb_connection_string
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:8000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend/zigNote
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`

## 📖 Usage

1. **Sign Up/Login**: Create an account or log in with existing credentials.
2. **Dashboard**: View all your notes. Use the search bar to find notes by keywords.
3. **Add Notes**: Click the "+" button to create new notes. Add title, content, and tags.
4. **Edit/Delete**: Click on a note to edit or delete it.
5. **Pin Notes**: Pin important notes to keep them at the top.
6. **Tags**: Organize notes with hashtags for better categorization.

## 🔌 API Endpoints

### Authentication
- `POST /create-account` - Register a new user
- `POST /login` - User login
- `GET /verify-email` - Verify a user's email address
- `POST /resend-verification` - Resend verification email

### Notes (Protected)
- `GET /get-user` - Get user info
- `POST /add-note` - Create a new note
- `PUT /edit-note/:noteId` - Update a note
- `GET /get-all-notes` - Retrieve all notes
- `DELETE /delete-note/:noteId` - Delete a note
- `PUT /update-note-pinned/:noteId` - Pin/unpin a note

All note endpoints require JWT authentication in the Authorization header.

## 🔐 Environment Variables

Create a `.env` file in the `backend/` folder:

```
ACCESS_TOKEN_SECRET=your_secure_jwt_secret_key
MONGO_URI=your_mongodb_connection_string
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FRONTEND_BASE_URL=http://localhost:5173
```

## 📌 Future Improvements
- Note version history
- Note sharing between users
- AI-powered note summarization
- Dark mode UI
- Note categories/folders
- Export notes to PDF

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👩‍💻 Author

**Atulya Chaturvedi**

- GitHub: [Atulya-arch](https://github.com/Atulya-arch)

---

⭐ If you found this project helpful, please give it a star!

    
