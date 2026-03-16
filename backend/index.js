require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err?.message || err));

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');
const bcrypt = require("bcrypt");
const { sendVerificationEmail } = require("./mailer");

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.use((req, res, next) => {
    if (req.path === "/") return next();
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            error: true,
            message: "Database not connected. Please try again in a moment.",
        });
    }
    next();
});

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {

    const { fullName, email, password } = req.body;

    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).json({ error: true, message: "Server misconfigured" });
    }

    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Full Name is required" });
    }

    if(!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is required" });
    }

    if(!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exists",
        });

    }
     
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign(
        { email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    const user = new User ({
        fullName,
        email,
        password: passwordHash,
        isVerified: false,
        verificationToken,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await user.save();

    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:5173";
    const verificationLink = `${frontendBaseUrl}/verify-email?token=${verificationToken}`;

    const mailResult = await sendVerificationEmail({
        to: email,
        verificationUrl: verificationLink,
    });

    if (!mailResult.sent) {
        console.log("Email not sent. Reason:", mailResult.reason, mailResult.error ? `| ${mailResult.error}` : "");
        console.log("Email verification link:", verificationLink);
    }

    return res.json({
        error: false,
        message: mailResult.sent
            ? "Verification email sent. Please check your inbox."
            : "Account created, but verification email could not be sent. Please use the link below.",
        emailSent: mailResult.sent,
        ...(mailResult.sent ? {} : { verificationLink }),
    });
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).json({ error: true, message: "Server misconfigured" });
    }

    if(!email) {
        return res
            .status(400)
            .json({ message: "Email is required" });
    }

    if(!password) {
        return res
            .status(400)
            .json({ message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res
            .status(400)
            .json({ message: "User not found" });
    }

    if (userInfo.isVerified === false) {
        return res.status(403).json({
            error: true,
            message: "Please verify your email before logging in.",
        });
    }

    // Support legacy plaintext passwords (one-time upgrade)
    const storedPassword = userInfo.password || "";
    const looksHashed = typeof storedPassword === "string" && storedPassword.startsWith("$2");
    console.log("[login]", {
        email,
        isVerified: userInfo.isVerified,
        passwordStored: storedPassword ? (looksHashed ? "bcrypt" : "plaintext") : "missing",
    });

    if (!storedPassword) {
        return res.status(500).json({
            error: true,
            message: "Account password is not set. Please reset your password.",
        });
    }

    let isValidPassword = false;
    if (looksHashed) {
        try {
            isValidPassword = await bcrypt.compare(password, storedPassword);
        } catch (err) {
            return res.status(500).json({
                error: true,
                message: "Stored password is invalid. Please reset your password.",
            });
        }
    } else {
        isValidPassword = storedPassword === password;
        if (isValidPassword) {
            userInfo.password = await bcrypt.hash(password, 10);
            await userInfo.save();
        }
    }

    if(isValidPassword) {
        const accessToken = jwt.sign({ userId: userInfo._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });

    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        });
    }
});

// Verify Email
app.get("/verify-email", async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: true, message: "Verification token is required" });
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).json({ error: true, message: "Server misconfigured" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const email = decoded.email;

        const user = await User.findOne({ email });

        // If the user is already verified, this endpoint is idempotent.
        if (user && user.isVerified) {
            return res.json({
                error: false,
                message: "Email already verified. You can now log in.",
            });
        }

        // Only accept the token if it matches the stored verification token.
        if (!user || user.verificationToken !== token) {
            return res.status(400).json({ error: true, message: "Invalid or already used verification token" });
        }

        if (user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < new Date()) {
            return res.status(400).json({ error: true, message: "Verification token has expired" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        return res.json({
            error: false,
            message: "Email verified successfully. You can now log in.",
        });
    } catch (err) {
        return res.status(400).json({ error: true, message: "Invalid or expired verification token" });
    }
});

// Resend Verification Email
app.post("/resend-verification", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).json({ error: true, message: "Server misconfigured" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        // Avoid leaking which emails exist
        return res.json({
            error: false,
            message: "If an account exists for this email, a verification email has been sent.",
        });
    }

    if (user.isVerified) {
        return res.json({
            error: false,
            message: "Your email is already verified. Please log in.",
        });
    }

    const verificationToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:5173";
    const verificationLink = `${frontendBaseUrl}/verify-email?token=${verificationToken}`;

    const mailResult = await sendVerificationEmail({
        to: email,
        verificationUrl: verificationLink,
    });

    if (!mailResult.sent) {
        console.log("Email not sent. Reason:", mailResult.reason);
        console.log("Email verification link:", verificationLink);
    }

    return res.json({
        error: false,
        message: "Verification email sent. Please check your inbox.",
        ...(mailResult.sent ? {} : { verificationLink }),
    });
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    const { userId } = req.user;

    const isUser = await User.findOne({ _id: userId });

    if(!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn,
        },
        message: "",
    });
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { userId } = req.user;

    if(!title) {
        return res
            .status(400)
            .json({ error: true, message: "Title is required" });
    }

    if(!content) {
        return res
            .status(400)
            .json({ error: true, message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned} = req.body;
    const { userId } = req.user;

    if(!title && !content && !tags) {
        return res
            .status(400)
            .json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId });

        if(!note) {
            return res
                .status(404)
                .json({ error: true, message: "Note not found" });
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if (isPinned !== undefined) {
            note.isPinned = isPinned
        }

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Get All Notes
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { userId } = req.user;

    try {
        const notes = await Note.find({ userId }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "All Notes retrieved successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { userId } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId });

        if(!note) {
            return res.status(404).json({ 
                error: true, 
                message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Update Pinned Status
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { userId } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId });

        if(!note) {
            return res
                .status(404)
                .json({ error: true, message: "Note not found" });
        }

        if(isPinned !== undefined) {
            note.isPinned = isPinned;
       }

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Search Notes
app.get("/search-notes", authenticateToken, async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;

    if(!query) {
        return res
            .status(400)
            .json({ error: true, message: "Search query is required" });
    }

    try {
        const matchingNotes = await Note.find({
            userId,
            $or: [
                { title: { $regex: new RegExp(query, "i") } }, 
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search retrieved successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;