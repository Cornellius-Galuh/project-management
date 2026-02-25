import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        completed:{
            type:Boolean,
            default:false
        },
        dueDate:{
            type: Date,
            required: true
        },
        tags:{
            type:[String],
            required:true
        },
        priority:{
            type:String,
            enum: ["Low", "Medium", "High"],
            required: true
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        collaborators:{
            type:[mongoose.Schema.Types.ObjectId],
            ref:"User"
        }
    },
    {
        timestamps: true,
    }
)
const Project = mongoose.model("Project", projectSchema)
export default Project