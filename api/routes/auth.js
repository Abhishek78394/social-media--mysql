import express from "express"; 
const router = express.Router();
import { logout,login,register } from "../controllers.js/auth.js";
router.get("/login", function (req, res, next) {
    res.render("signin");
  });
router.post ("/register",register,)
router.post ("/login",login)
router.post ("/logout",logout)



export default router