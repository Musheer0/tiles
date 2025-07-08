import prisma from "@/db";
import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { MsgRole, MsgType } from "@prisma/client";
import z from "zod";


export const messageRouter = createTRPCRouter({
    create:baseProcedure
    .input(
        z.object({
            value: z.string().min(2)
        })
    )
    .mutation(async({input})=>{
      const message =   await prisma.message.create({
            data:{
                content:input.value,
                role: MsgRole.USER,
                type:MsgType.RESULT
            }
        });
        await inngest.send({
            name:"prod/create-ai",
            data:{
                prompt: message.content
            }
        });
        return message;
    })
})