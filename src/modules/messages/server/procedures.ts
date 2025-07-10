import prisma from "@/db";
import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { MsgRole, MsgType } from "@prisma/client";
import z from "zod";


export const messageRouter = createTRPCRouter({
    create:baseProcedure
    .input(
        z.object({
            value: z.string().min(2),
            projectId:z.string()
        })
    )
    .mutation(async({input})=>{
      const message =   await prisma.message.create({
            data:{
                content:input.value,
                role: MsgRole.USER,
                type:MsgType.RESULT,
                project_id:input.projectId
            }
        });
        await inngest.send({
            name:"prod/create-ai",
            data:{
                prompt: message.content,
                  id:input.projectId
            }
        });
        return message;
    }),
    getMany :baseProcedure
    .input(
        z.object({
            project_id:z.string()
        })
    )
    .query(async({input})=>{
        const messages = await prisma.message.findMany({
            where:{
                project_id:input.project_id
            },
            include:{
                fragment:true
            },
            orderBy:{
                updatedAt:'asc'
            }
        });
        return messages
    }),
    
})