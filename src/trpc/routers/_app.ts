import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
    invoke: baseProcedure
    .input(
      z.object({
        value : z.string()
      })
    )
    .mutation(async({input})=>{
      console.log('hello')
    await inngest.send({
      name:'test/hello.world',
      data:{
        email: input.value
      }
    })
    }),
    create_ai : baseProcedure
    .input(
      z.object({
        prompt: z.string()
      })
    )
    .mutation(async({input})=>{
      await inngest.send({
        name: 'prod/create-ai',
        data:{
          prompt:input.prompt
        }
      })
    })
});
// export type definition of API
export type AppRouter = typeof appRouter;