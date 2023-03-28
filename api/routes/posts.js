import express from "express";
import path from "path"
import multer from "multer"


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file);
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        let modifiedName =
            file.originalname;
        cb(null, modifiedName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        let filetypes = /jpeg|jpg|png|gif|mp4|avif|webm|mp3/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(
            "Error: File upload only supports the following filetypes - " +
            filetypes
        );
    },
});




import { getPosts, addPost, deletePost,  } from "../controllers.js/posts.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/",  addPost);
router.delete("/:id", deletePost);

export default router