"use client"
import { trpc } from '@/trpc/client';
import React from 'react'
import MessageCard from './message.card';

const MessageView = ({id}:{id:string}) => {
        const [data] = trpc.message.getMany.useSuspenseQuery({project_id:id});
    
  return (
    <div className='p-1 flex flex-col w-full h-full overflow-y-scroll  gap-2 max-w-xl px-1.5'>
        {data.map(({fragment, ...rest})=><React.Fragment key={rest.id}><MessageCard message={rest} fragment={fragment} type={rest.type}/></React.Fragment>)}
    </div>
  )
}

export default MessageView