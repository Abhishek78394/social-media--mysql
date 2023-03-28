import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {  
    const postid = 'select c.postid  from social.comments as c';
    var postId = req.query.id 

const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
WHERE c.postId IN (${postId}) ORDER BY c.createdAt DESC`;

db.query(postid,(err,id)=>{
  if(err) return res.status(500).json(err);
console.log(postId)
  const filteredData = id.filter((e) => {
    return postId.includes(e.postid);
  });
 let postid = filteredData.map(e =>{
    return e.postid
  })
  console.log(postId)

    db.query(q, [postId], (err, data) => {
      console.log(postId)
      console.log(q)
        if (err) return res.status(500).json(err)
        console.log(data)
        return res.status(200).json(data);
      });
})

};

export const addComment = (req, res) => {  

    const token =req.body.token ||  req.cookies.accessToken
    const postid = req.body.id;
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      const q = "INSERT INTO comments(`desc`, `createdAt`, `userid`, `postid`) VALUES (?)";
      const values = [
        req.body.desc,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id,
        postid
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Comment has been created.");
      });
    });


 };


export const deleteComment = (req, res) => { 
    const token = req.cookies.access_token  ||  req.body.token
    console.log(token)
    if (!token) return res.status(401).json("Not authenticated!");
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const commentId = req.params.id;
      console.log(commentId)
      const q = "DELETE FROM comments WHERE `id` = ? AND `userid` = ?";
  
      db.query(q, [commentid, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Comment has been deleted!");
        return res.status(403).json("You can delete only your comment!");
      });
    });


};
