import { Router } from "express";
import { login, logout, register, whoami } from "../controllers/AuthenticationController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const route = Router()

route.post('/register', register)
route.post('/login', login)
route.post('/logout', verifyToken, logout)
route.get('/whoami', verifyToken, whoami)
export default route