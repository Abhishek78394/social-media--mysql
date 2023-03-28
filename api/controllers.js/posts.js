import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const token = req.query.token || req.cookies.accessToken


  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");



    const q = `select p.*, u.id as userid, name, profilePic from social.posts p  join
  social.users u on (p.userid = u.id) left join social.relationships r on (p.userid = r.followerUserid) 
  where r.followedUserid = ? or p.userid = ? order by p.createdAt desc`;


    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
    console.log("done")
  });
};


export const addPost = (req, res) => {
  const token = req.body.token ||  req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!")
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!")
    const q =
      "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ]
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json("Post has been created.")
    })
  })
}


export const deletePost = (req, res) => {
  const token = req.body.token ||  req.cookies.accessToken
const id = req.params.id
  console.log(token ,"njhgvASDFGHJKLJMHNGFDSDFGHJ")
  // console.log(id)
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    console.log(userInfo ,"awawwwwaawaawawwawawaw")
    const q =
      "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};
