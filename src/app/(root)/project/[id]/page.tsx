import ProjectView from '@/components/project/project.view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react'
interface iparams{
    id:string
}
const page = async({params}:{params:Promise<iparams>}) => {
    const {id} = await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery({
    queryKey: ['message.getMany', { project_id: id }],
      queryFn:async()=>await trpc.message.getMany({project_id:id})
    });
     void queryClient.prefetchQuery({
    queryKey: ['project.getOne', id],
      queryFn:async()=>await trpc.project.getOne({id:id})
    });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}> 
      <Suspense fallback={"Loading..."}>
        <ProjectView id={id}/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page