"use client"
import { useTrpc } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'

const page = () => {
    const trpc = useTrpc();

    const [prompt , setPrompt] = useState('');
    const {isPending:isLoading,mutate}= useMutation({
        mutationKey:['create-ai'],
        mutationFn:async()=>await trpc.create_ai.mutate({prompt})
    })
    
    const HandleInput = (e:React.ChangeEvent<HTMLTextAreaElement>)=>setPrompt(e.target.value);
  return (
    <div className='p-10 flex flex-col gap-2'>
        <textarea disabled={isLoading} onChange={HandleInput} placeholder='Enter prompt' className='p-3 bg-zinc-200 text-zinc-900 border rounded'></textarea>
        <button disabled={isLoading} onClick={()=>mutate()} className='px-5 disabled:opacity-50 py-2 bg-green-600 rounded-full'>Generate</button>
    </div>
  )
}

export default page