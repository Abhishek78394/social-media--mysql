import express from "express";
const router = express.Router();
import { getUser } from "../controllers.js/users.js";

router.get("/find/:userId", getUser)



export default router