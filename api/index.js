import express, { Router } from "express";
const app = express();
const port = 4700;
import multer from 'multer'
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import commentsRoutes from "./routes/comments.js"
import postsRoutes from "./routes/posts.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import { addPost } from "./controllers.js/posts.js";

const router = Router();
import bodyParser from 'body-parser' 

app.listen(port, () => {
    console.log(`server is runnning on https://localhost${port}`);
  });
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
app.use(express.urlencoded({extended:false}))
// app.use(bodyParser.json())
app.use(express.json());

app.use(cors());
app.use(cookieParser());

app.use("/api/users",userRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/comments",commentsRoutes)
  // router.post("/api/posts",upload.single("img"),addPost);
app.use("/api/posts",postsRoutes)
