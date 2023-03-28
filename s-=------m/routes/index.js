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
    res.redirect('/home')

  } catch (error) {
    console.log("object")
    console.log({ message: error.message, g: "dfg" })
  }
})
/** GET home page */
router.get("/home", async (req, res, next) => {
  console.log("hhhhh");
  const token = req.cookies.token
  const data = await axios.get(`http://localhost:4700/api/posts?token=${token}`)
  const posts = data.data

  let postId = posts.map((e) => { return e.id })

  let [id] = postId
  console.log(postId)
  
  res.render('home', { posts: posts})
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
    const data = await axios.post("http://localhost:4700/api/posts", { desc, img, token }, token)

    res.redirect('home')
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


    let url = `http://localhost:4700/api/comments?id=${id}`;
    const response = await axios.get(url);
    let comment = response.data;
   console.log(comment)

  res.render('comments', { post: post, comments: comment })
})

router.post('/comments/:id', async (req, res) => {
  try {
    const token = req.cookies.token
    const id = req.params.id
    const { desc } = req.body;
    console.log(token, id, { desc });
    const data = await axios.post("http://localhost:4700/api/comments", { desc, token, id }, token)

    res.redirect(`/comments/${id}`)
  } catch (error) {
    console.log({ message: error.message, err: error })
  }
})

router.get("/delete/:id", async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const id = req.params.id
    const data = await axios.get(`http://localhost:4700/api/posts?token=${token}`, { token })
    const posts = data.data
    let post = posts.find(obj => obj.id == id);
    if (post !== undefined) {
      console.log("Found object:", post);
    } else {
      console.log("Object not found");
    }
    const userId = post.userId
    const q =
      "DELETE FROM posts WHERE `id`=? AND `userid` = ?";

    db.query(q, [id, userId], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.status(200).redirect("/home")
      return res.status(403).json("You can delete only your post")
    });
  } catch (error) {
    console.log(error)
  }
});

router.get("/delete/comm/:id", async (req, res, next) => {
  try {
    const token = req.cookies.token
    const data = await axios.get(`http://localhost:4700/api/posts?token=${token}`)
    const posts = data.data
    let postId = posts.map((e) => {
      return e.id
    })
    
      var comments = await axios.get(`http://localhost:4700/api/comments?id=${postId}`)
      const id = req.params.id
      const commentz = comments.data
      console.log(id, commentz)
      let comment = commentz.find(obj => obj.id == id);
      console.log(comment)
      if (comment !== undefined) {
        console.log("Found object:", comment);
      } else {
        console.log("Object not found");
      }
      const userId = comment.userId
      const postID = comment.postId
console.log(userId)
      const q =
        "DELETE FROM comments WHERE `id`=? AND `userid` = ?";
      db.query(q, [id, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.status(200).redirect(`/comments/${postID}`)
      });
  
  } catch (error) {
    console.log(error);
  }
})
  






module.exports = router;
