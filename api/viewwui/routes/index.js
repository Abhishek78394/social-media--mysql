const { default: axios } = require("axios");
var express = require("express");
const { Cookie } = require("express-session");
var fs = require("fs");
var path = require("path");
var router = express.Router();
const Cookies = require('universal-cookie')
const multer = require('multer');
const { db } = require("../connect");


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

/** GET Signup page */
router.get("/", (req, res) => {
    res.render('signup')
});

router.post("/signup", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        axios.post("http://localhost:4700/api/auth/register", { name, username, email, password })
        res.redirect('signin')
    } catch (error) {
        console.log({ message: error.message, g: "dfg" })
    }
})



/** GET Signin page */
router.get("/signin", (req, res, next) => {
    res.render('signin')
});
router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("object")
        let data = await axios.post("http://localhost:4700/api/auth/login", { username, password })
        console.log("afetre login")
        const token = data.data.token
        res.setHeader('set-cookie', `token=${token}`)
        console.log("toekn gemrate");
        res.redirect('home')

    } catch (error) {
        console.log("object")
        console.log({ message: error.message, g: "dfg" })
    }
})
/** GET home page */
router.get("/home", async (req, res, next) => {
    const token = req.cookies.token
    const data = await axios.get(`http://localhost:4700/api/posts?token=${token}`, { token })
    const posts = data.data
    let postId = posts.map((e) => {
        return e.id
    })
    let [id] = postId
    console.log(postId)
    // const comments = await axios.get(`http://localhost:4700/api/comments?id=${id}`)

    //   const comment = comments.data

    //   console.log(comment);

    res.render('home', { posts: posts })

});

/** GET home page */
router.get("/createPost", (req, res, next) => {
    res.render('createPost')
});

router.post("/createPost", upload.single('img'), async (req, res) => {
    try {
        const token = req.cookies.token
        const { desc } = req.body;
        const img = req.file.filename
        const data = await axios.post("http://localhost:4700/api/posts", { desc, img, token })
        console.log("object")
        res.redirect('/home')
    } catch (error) {
        console.log({ message: error.message })
    }
})

router.get('/comments/:id', async (req, res, next) => {
    const token = req.cookies.token



    const data = await axios.get(`http://localhost:4700/api/posts?token=${token}`, { token })
    const posts = data.data
    const id = req.params.id
    console.log(posts)
    console.log(id)
    let post = posts.find(obj => obj.id == id);
    if (post !== undefined) {
        console.log("Found object:", post);
    } else {
        console.log("Object not found");
    }
    res.render('comments', { post: post })
})

router.post('/comments/:id', async (req, res) => {
    try {
        const token = req.cookies.token
        const id = req.params.id
        const { desc } = req.body;
        console.log(token, id, { desc });
        const data = await axios.post("http://localhost:4700/api/comments", { desc, token, id }, token)

        res.redirect('/home')
    } catch (error) {
        console.log({ message: error.message, err: error })
    }
})

module.exports = router;
