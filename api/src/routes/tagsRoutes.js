import {Router} from "express"
import { createTags, getAllTags } from "../controllers/tagsController.js"

const route = Router()

route.get("/", getAllTags)
// route.get("/create", createTags)

export default route