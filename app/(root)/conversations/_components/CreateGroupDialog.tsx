// "use client"
// import { api } from '@/convex/_generated/api'
// import { useMutationState } from '@/hooks/useMutationState'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useMutation, useQuery } from 'convex/react'
// import React, { useMemo } from 'react'
// import { useForm } from 'react-hook-form'
// import { z } from 'zod'

// type Props = {}

// const createGroupFormSchema = z.object({
//     name: z.string().min(1, { message: "This field can't be empty"}),
//     members: z.string().array().min(1, { message: "You must select atleast one friend"}
//     ),
// })

// const CreateGroupDialog = (props: Props) => {
//     const friends = useQuery(api.friends.get)
    
//     const {mutate: createGroup, pending} = useMutationState(api.conversation.createGroup)

//     const form = useForm<z.infer<typeof createGroupFormSchema>>({
//         resolver: zodResolver(createGroupFormSchema),
//         defaultValues : {
//             name: "",
//             members: [],
//         },
//     });

//     const members = form.watch("members",[])

//     const unselectedFriends = useMemo(()=>{
    
//     }, [])
//   return (
//     <div>CreateGroupDialog</div>
//   )
// }

// export default CreateGroupDialog