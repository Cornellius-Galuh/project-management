import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import apiFrontend from '@/config/axios'
import delay from '@/lib/delay'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import z, { email } from 'zod'


const formSchema = z.object({
    name:z.string().min(1,{message:"Name is required"}),
    email:z.string().email().min(1,{message:"Email is required"}),
    password:z.string().min(1,{message:"Password is required"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    
    confirmPassword: z.string().min(1, {message: "Confirm password is required"}),
}).refine((data) => data.password === data.confirmPassword, {
    message:"Password do not match",
    path: ["confirmPassword"],
})
const SignUpPage = () => {
    const navigate = useNavigate()

   const  [loading, setLoading] = useState<boolean>(false)

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    },
   })

   const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try{
        await delay (500)
        const {data} = await apiFrontend.post('/auth/register', values)
        toast(data.message, {
            onAutoClose: () => {
                setLoading(false),
                navigate('/')
            }
        })
    }catch(error:any){
        toast(error.response.data.message, {
            onAutoClose: () => setLoading(false)
        })
    }
   }

  return (
    <div className='h-screen flex items-center justify-center bg-slate-100'>
      <div className='bg-white p-10 rounded-md max-w-lg'>
        <div className='text-center space-y-1'>
            <h1 className='text-2xl font-bold'>Welcome to Project Management App</h1>
            <p className='text-muted-foreground'>Signup with your account or create account first</p>
        </div>
        <div className='mt-5'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSignUp)} className='space-y-5'>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete='off' autoFocus/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete='off' type='email'/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete='off' type='password'/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete='off' type='password'/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div>
                        <Button type='submit' disabled={loading} className='w-full'>
                            {loading && (
                                <Loading/>
                            )}
                            SignUp
                        </Button>
                    </div>
                    <div>
                        <p className='text-muted-foreground text-center'>Already have an account? <Link to='/' className='text-primary font-medium'>Login</Link></p>
                    </div>
                </form>
            </Form>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
