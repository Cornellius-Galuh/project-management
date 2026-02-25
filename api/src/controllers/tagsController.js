import Tags from "../models/Tags.js"

export const getAllTags = async (req, res) => {
 try{
    const tags = await Tags.find()
    res.status(200).json(tags)
 }catch(error){
    console.log(error)
    res.status(500).json({message: error.message})
 } 
}

export const createTags = async (req, res) => {
    try{
        const tags = ["development", "design", "marketing", "business", "productivity", "database", "backend", "frontend", "ui/ux", "mobile", "web", "software", "fullstack", "other"]

        const tag = tags.map((tag) => ({tag_name: tag}))
        await Tags.insertMany(tag, {ordered:false})
        res.status(201).json({message: "Tags created successfully"})
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
}