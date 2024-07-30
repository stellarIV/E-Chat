"use client"
import React from 'react'
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { Tooltip, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { UserPlus } from 'lucide-react';
import { TooltipContent } from '@/components/ui/tooltip';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '@/convex/_generated/api';
import { error } from 'console';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';



const addFriendFormSchema = z.object({
    email: z.string().min(1,{message:"This field can't be empty"})
    .email("Please enter a valid email"),
})

const AddFriendDialog = () => {
    const { mutate: createRequest, pending }= useMutationState(api.request.create);

    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver(addFriendFormSchema),
        defaultValues:{
            email:"",
        },
    })

    const handleSubmit = async(values: z.infer<typeof addFriendFormSchema>)=>{
        await createRequest({email: values.email})
        .then (()=> {
        form.reset();
        toast.success("Friend request sent!")
        }).catch(error =>{
            toast.error(error instanceof ConvexError ? error.data : "Unexpected error occured")
        })
    }

  return (
    <Dialog>
        <Tooltip>
            <TooltipTrigger>
                <Button size="icon" variant="outline">
                    <DialogTrigger>
                        <UserPlus/>
                    </DialogTrigger>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add friend</p>
            </TooltipContent>
        </Tooltip>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Add friend
                </DialogTitle>
                <DialogDescription>
                    send a request to connect with your friends!
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                    <FormField control={form.control} name='email' 
                    render={({field})=> (
                    <FormItem>
                        <FormLabel className='pr-3'>
                            Email
                        </FormLabel>
                        <FormControl>
                            <input placeholder='Email...'{...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}/>
                    <DialogFooter>
                        <Button disabled={pending} type='submit'>
                            send
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default AddFriendDialog