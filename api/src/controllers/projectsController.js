import Project from "../models/Projects.js"
import { formatJoiErrors } from "../utils/FormatJoiErrors.js"
import { createProjectSchema, updateProjectSchema } from "../validations/projectsValidation.js"

export const createProject = async (req, res) => {
    //1. validasi data
    const {error} = createProjectSchema.validate(req.body, {abortEarly: false})
    if(error){
        const errors = formatJoiErrors(error)
        return res.status(400).json({
            message:"Validation error",
            errors,
        })
    }

    //2. Create
    try{
        const{title, description, dueDate, tags, priority} = req.body
        const project = await Project.create({
            title,
            description,
            dueDate,
            tags,
            priority,
            owner: req.user._id,
            collaborators: [req.user._id],
        })

        res.status(201).json({
            message: "Project created successfully",
            project,
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            message:"Internal server error",
            error: error.message,
        })
    }
}

export const updateProject = async (req, res) => {
    const {error} = updateProjectSchema.validate(req.body, {abortEarly: false})
    if (error){
        const errors = formatJoiErrors(error)
        return res.status(400).json({
            message: "Validation error",
            errors,
        })
    }

    try{
        const {projectId, title, description, dueDate, tags, priority} = req.body
        const project = await Project.findByIdAndUpdate(projectId, {
            title,
            description,
            dueDate,
            tags,
            priority
        })
        res.status(200).json({
            message: "Project updated successfully",
            project,
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })
    }
}

export const getAllProjects = async (req, res) => {
    try{
        const projects = await Project.find({
            owner: req.user._id,
        }).sort({
            createdAt: -1,
        })

        res.status(200).json({
            message: "Projects fetched successfully",
            projects,
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            message:"Internal server error",
            error: error.message
        })
    }
}

export const deleteProjects = async (req, res) => {
    const {id} = req.params

    try{
        const project = await Project.findById(id)
        if (!project){
            return res.status(404).json({
                message: "Project not found"
            })
        }

        if (project.owner.toString() !== req.user._id.toString()){
            return res.status(401).json({
                message: "You are not authorized to delete this project"
            })
        }

        //delete semua jobsnya

        await project.deleteOne()
        res.status(200).json({
            message: "Project deleted successfully"
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}