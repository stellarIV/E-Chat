import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { equal } from "assert";
import { error } from "console";
import { currentUser } from "@clerk/nextjs/dist/types/server";

export const create = mutation({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) =>{
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new ConvexError
            ("unauthorized")
        }

        if(args.email === identity.email){
            throw new ConvexError("Hey you can't send a request to yourself")
        }

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        })

        if(!currentUser){
            throw new ConvexError("User not found")
        }

        const reciver = await ctx.db
        .query("users")
        .withIndex("by_email", (q)=>q.eq("email", args.email))
        .unique();

        if(!reciver){
            throw new ConvexError("user not found")
        }
        const requestAleadySent = await ctx.db.query("requests").withIndex("by_reciver_sender",q =>q.eq("reciver", reciver._id).eq("sender", currentUser._id)).unique()

        if(requestAleadySent){
            throw new ConvexError("Request already sent")
        }

        const requestAlreadyRecived = await ctx.db.query("requests")
        .withIndex("by_reciver_sender",q =>q.eq("reciver", currentUser._id).eq("sender", reciver._id)).unique()

        if(requestAlreadyRecived){
            throw new ConvexError("This user has already sent you a request");
        }

        const friends1 = await ctx.db.query("friends").withIndex("by_user1",q=>q.eq("user1", currentUser._id)).collect();

        const friends2 = await ctx.db.query("friends").withIndex("by_user2",q=>q.eq("user2", currentUser._id)).collect();

        if(friends1.some((friend)=> friend.user2 === reciver._id) || friends2.some((friend)=>friend.user1 === reciver._id)){
            throw new ConvexError("You are already friends with this user")
        }

        const request = await ctx.db.insert("requests",{
            sender: currentUser._id,
            reciver: reciver._id,
        })

        return request;
    },
})
export const deny = mutation({
    args: {
        id: v.id("requests"),
    },
    handler: async (ctx, args) =>{
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new ConvexError
            ("unauthorized")
        }


        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        })

        if(!currentUser){
            throw new ConvexError("User not found")
        }


       const request= await ctx.db.get(args.id)

       if(!request || request.reciver !== currentUser._id){
        throw new ConvexError("There was an error denying this request")
       }

       await ctx.db.delete(request._id)
    },
})
export const accept = mutation({
    args:{
        id: v.id("requests")
    },
        handler: async (ctx, args)=>{
            const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new ConvexError
            ("unauthorized")
        }


        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        })

        if(!currentUser){
            throw new ConvexError("User not found")
        }
        
        const request =await ctx.db.get(args.id)
        
        if( !request || request.reciver !== currentUser._id ){
            throw new ConvexError("There was an error accepting this request")
        }
        const conversationId = await ctx.db.insert("conversations",{
            isGroup: false
        })
        await ctx.db.insert("friends",{
            user1: currentUser._id,
            user2: request.sender,
            conversationId
        })
        await ctx.db.insert("conversationMembers",{
            memberId: currentUser._id,
            conversationId
        })
        await ctx.db.insert("conversationMembers",{
            memberId: request.sender,
            conversationId
        })

        await ctx.db.delete(request._id)

    }
})
