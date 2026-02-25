import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema(
    {
        tag_name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Tags = mongoose.model("Tags", tagsSchema)
export default Tags