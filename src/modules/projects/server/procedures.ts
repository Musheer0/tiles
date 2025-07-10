import prisma from "@/db";
import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { MsgRole, MsgType } from "@prisma/client";
import z from "zod";


export const projectsRouter = createTRPCRouter({
    create:baseProcedure
    .input(
        z.object({
            value: z.string().min(2)
        })
    )
    .mutation(async({input})=>{
      const project =   await prisma.project.create({
            data:{
                name: input.value,
                messages:{
                    create:{
                                    content:input.value,
                                    role: MsgRole.USER,
                                    type:MsgType.RESULT
                                }
                }
            }
        });
         await inngest.send({
                    name:"prod/create-ai",
                    data:{
                        prompt: input.value,
                        id: project.id
                    }
                });
        return project;
    }),
    getOne :baseProcedure.input(z.object({id:z.string()}))
    .query(async({input})=>{
        return await prisma.project.findFirst({where:{id:input.id}});
    }),
})