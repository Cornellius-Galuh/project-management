import { Router } from "express";
import { createProject, deleteProjects, getAllProjects, updateProject } from "../controllers/projectsController.js";

const route = Router();

route.get("/", getAllProjects)
route.post("/", createProject)
route.put("/:projectId/update", updateProject)
route.delete("/:id/delete", deleteProjects)

export default route