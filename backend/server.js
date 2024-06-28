const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = 3000;
require("dotenv").config();
const nodemailer = require("nodemailer");

// Configurações de middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  const posts = await prisma.post.findMany();
  const comments = await prisma.comment.findMany();
  res.json({ users, posts, comments });
});

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

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

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

app.post("/posts", async (req, res) => {
  const { userId, title, content } = req.body;
  const post = await prisma.post.create({
    data: { userId, title, content },
  });
  res.json(post);
});

app.post("/comments", async (req, res) => {
  const { postId, userId, comment } = req.body;
  const newComment = await prisma.comment.create({
    data: { postId, userId, comment },
  });
  res.json(newComment);
});

app.listen(port, () => {
  console.log(
    `Servidor rodando em http://localhost:${port} -> banco de dados: ${process.env.DATABASE_URL}`
  );
});
