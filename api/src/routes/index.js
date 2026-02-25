import { Router } from "express";
import AuthenticationRoutes from "./AuthenticationRoutes.js"
import tagsRoutes from "./tagsRoutes.js"
import projectRoutes from "./projectRoutes.js"
import { verifyToken } from "../middleware/verifyToken.js";

const route = Router()

//http://localhost:3000/api/auth/

route.use("/auth", AuthenticationRoutes)
route.use("/tags", tagsRoutes)
route.use("/projects", verifyToken, projectRoutes)
export default route