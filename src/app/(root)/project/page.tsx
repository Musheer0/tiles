"use client"
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTrpc } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query';
import { AlertTriangleIcon, ArrowUp, BrainCog, Loader2Icon, SendIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {
    const trpc = useTrpc();
    const [value ,setValue] = useState('');
    const router = useRouter();
    const {mutate ,isPending ,isError }= useMutation({
        mutationKey: ['send-msg'],
        mutationFn: async()=>await trpc.project.create.mutate({value}).then((res)=>{
          router.push(`/project/${res.id}`)
        })
    });

  return (
    <div className=' w-full p-4 flex flex-col items-center justify-center flex-1 border border-muted-foreground/20 bg-muted-foreground/5 rounded-2xl'>
      <h1 className='font-bold text-4xl sm:text-5xl tracking-tight py-6'>
        What can I help you build?
      </h1>
        <div className='flex items-start  prompt flex flex-col w-full max-w-2xl relative'>
       {isError &&    <div className="error w-full p-2 bg-destructive/10 flex items-center gap-2 text-destructive rounded-t-2xl translate-y-3 pb-5">
          <AlertTriangleIcon size={14}/>
          <p className='text-sm'>Error sending request try again...</p>
          </div>}
           <Textarea
           placeholder='Ask tiles to build...'
           className='border shadow-sm rounded-xl bg-background   h-[130px] z-20 '
           value={value} onChange={(e)=>setValue(e.target.value)}
           />
            <div className="actions w-full pt-5 -translate-y-3 rounded-xl gap-2 rounded-t-none p-2 border border-muted-foreground/3 border-t-0 flex items-center justify-between bg-muted-foreground/10">
            <p className='text-xs text-muted-foreground'>Gemini 2.0 flash</p>
            <Button disabled={isPending} className='text-sm ml-auto ' title='enhance prompt using ai' size={'icon'} variant={'outline'}>
                {
                isPending ?
<Loader2Icon className='animate-spin'/>
:
 <BrainCog/>
              }
             </Button>
            <Button
            onClick={()=>mutate()} 
            disabled={isPending} className='text-sm ' size={'icon'} title='send prompt to ai' variant={'outline'}>
              {
                isPending ?
<Loader2Icon className='animate-spin'/>
:
<ArrowUp/>

              }
            </Button>
            </div>
        </div>
    </div>
  )
}

export default page