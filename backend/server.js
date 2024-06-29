const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = 3000;
require("dotenv").config();
const nodemailer = require("nodemailer");
const Joi = require("joi");

// Configurações de middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
// GET /
// Exibe as 3 tabelas no formato JSON
//
app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  const posts = await prisma.post.findMany();
  const comments = await prisma.comment.findMany();
  res.json({ users, posts, comments });
});

//
// GET /sendemail: envia um email
//
app.get("/sendemail", async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: "mailcatcher", //from docker dev
    port: 1025,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "", // MailCatcher doesn't require authentication
      pass: "",
    },
  });
  transporter.sendMail(
    {
      from: '"Example Team" <from@example.com>', // sender address
      to: "user@example.com", // list of receivers
      subject: "Hello", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    },
    (error, info) => {
      if (error) {
        return console.log(error);
      }
    }
  );
  res.json("Access http://localhost:1080 to view email");
});

///////////////////////////////////
// USERS
//////////////////////////////////

// Joi schema for user validation
const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  createdAt: Joi.date().optional(),
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const user = await prisma.user.create({
      data: { username, email },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a user
app.put("/users/:id", async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email } = req.body;
    const userId = parseInt(req.params.id);

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const conflictingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username, NOT: { id: userId } },
          { email, NOT: { id: userId } },
        ],
      },
    });

    if (conflictingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, email },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

///////////////////////////////////
// POSTS
//////////////////////////////////

app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

app.get("/comments", async (req, res) => {
  const comments = await prisma.comment.findMany();
  res.json(comments);
});

app.post("/users", async (req, res) => {
  const { username, email } = req.body;
  const user = await prisma.user.create({
    data: { username, email },
  });
  res.json(user);
});

///////////////////////////////////
// POSTS
//////////////////////////////////

// GET all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a post by ID
app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new post
app.post("/posts", async (req, res) => {
  const { userId, title, content } = req.body;
  try {
    const newPost = await prisma.post.create({
      data: {
        userId: parseInt(userId),
        title,
        content,
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

// PUT update a post by ID
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
      },
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

// DELETE a post by ID
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

// POST add a comment to a post
app.post("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { userId, comment } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: {
        postId: parseInt(id),
        userId: parseInt(userId),
        comment,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

// DELETE remove a comment from a post
app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

app.get("/commentsOfPost", async (req, res) => {
  const postId = parseInt(req.query.postId);
  const comments = await prisma.comment.findMany({ where: { postId: postId } });
  res.json(comments);
});

app.listen(port, () => {
  console.log(
    `Servidor rodando em http://localhost:${port} -> banco de dados: ${process.env.DATABASE_URL}`
  );
});
