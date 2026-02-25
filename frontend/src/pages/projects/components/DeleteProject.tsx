import Loading from "@/components/Loading"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import apiFrontend from "@/config/axios"
import { Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteProjectsProps{
    projectId: string
    getProjects: () => void
}

const DeleteProject = ({projectId, getProjects}: DeleteProjectsProps) => {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const handleDelete = async () => {
        try{
            const {data} = await apiFrontend.delete(`/projects/${projectId}/delete`)
            toast.success(data. message, {
                onAutoClose: () => {
                    setOpen(false)
                    getProjects()
                }
            })
            setLoading(false)
        }catch(error){
            console.log(error)
            toast.error("Error deleting project")
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size={"sm"} className="text-destructive hover:bg-white hover:text-destructive transition-all">
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-5">
                            <p>This action cannot be undone. This will permanently delete your projects</p>
                            <div>
                                <Button variant={"destructive"} onClick={handleDelete} disabled={loading} className="w-full">
                                    {loading && <Loading/>}
                                    <Trash/>
                                    Delete
                                </Button>
                            </div> 
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteProject
