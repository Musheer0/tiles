import { projectsRouter } from '@/modules/projects/server/procedures';
import {  createTRPCRouter } from '../init';
import { messageRouter } from '@/modules/messages/server/procedures';
export const appRouter = createTRPCRouter({
  message:messageRouter,
  project:projectsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;