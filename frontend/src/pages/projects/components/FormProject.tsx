import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import z, { boolean } from 'zod'
import { data, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Loading from '@/components/Loading'
import apiFrontend from '@/config/axios'
import { toast } from 'sonner'
import ReactSelect from "react-select"
import delay from '@/lib/delay'
import type { Project } from '@/types/type'

interface TagsOption{
  label: string;
  value: string;
}

const formSchema = z.object({
  projectId: z.string().optional().nullable(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  priority: z.string().min(1, { message: "Priority is required" }),
  tags: z.array(z.string().min(1, { message: "Tags is required" })),
  dueDate: z.string().min(1, { message: "Due Date is required" })
}).superRefine((data, ctx) => {
  const today = new Date().toISOString().split('T')[0];
  // misalkan [2026-02-24]T[239209834]
  if (data.dueDate < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Due Date must be greater than today",
      path: ["dueDate"]
    })
  }
})

interface FormProjectProps{
  project?: Project,
  getProjects: () => void
}

const FormProject = ({project, getProjects}: FormProjectProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [tags, setTags] = useState<TagsOption[]>([])
  const navigate = useNavigate()

  const priorityOptions = [
    {
      label: "Low",
      value: "Low",
    },
    {
      label: "Medium",
      value: "Medium",
    },
    {
      label: "High",
      value: "High",
    },
  ]

  const getTags = async () => {
    try{
      const {data} = await apiFrontend.get("/tags")
      const result = data.map((tag: {tag_name:string})=>{
        return{
          label: tag.tag_name,
          value: tag.tag_name
        }
      })
      setTags(result)
    }catch(error){
      toast.error("Error getting tags")
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: project?._id || null,
      title: project?.title || "",
      description: project?.description || "",
      priority: project?.priority || "",
      tags: project?.tags || [],
      dueDate: project?.dueDate.slice(0, 10) || "",
    }
  })

  const url = project ? `/projects/${project._id}/update` : "/projects"
  const method = project ? "put" : "post"

  const handleForm = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try{
      await delay(500)
      const {data} = await apiFrontend[method](url, values)
      toast.success(data.message, {
        onAutoClose: () => {
          setOpen(false)
          getProjects()
        }
      })
      setLoading(false)
    }catch(error){
      console.log(error);
      toast.error("Error creating project")
    }
  }

  useEffect(() => {
    if (open) getTags()
  }, [open])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className={project ? 'text-blue-800 hover:bg-white transition-all' : ''}>{project ? "Edit" : "Create Project"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Form Project</DialogTitle>
          <DialogDescription asChild>
            <div>
              <Form {...form}>
                <form className='space-y-4' onSubmit={form.handleSubmit(handleForm)}>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='dueDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input {...field} type='date' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='priority'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorityOptions.map((option: {label:string, value:string}, index: number) => (
                                <SelectItem value={option.value} key={index}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='tags'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <ReactSelect 
                            options={tags}
                            isMulti
                            isClearable
                            placeholder="Select tags"
                            value={tags.filter(tag => field.value.includes(tag.value))}
                            onChange={(value) => {
                              field.onChange(value ? value.map((item: {value:string}) => item.value) : [])
                            }}
                            className='capitalize'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <Button disabled={loading} className='w-full'>
                      {loading && <Loading/>}
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default FormProject
