"use client"
import { useTrpc } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'

const page = () => {
    const trpc = useTrpc();
    const [value ,setValue] = useState('')
    const {mutate ,isPending ,isError ,isSuccess}= useMutation({
        mutationKey: ['send-msg'],
        mutationFn: async()=>await trpc.message.create.mutate({value})
    });

  return (
    <div className='h-full w-full p-2'>
        <div className='flex items-start gap-2'>
            <textarea value={value} onChange={(e)=>setValue(e.target.value)} className='h-20 w-full p-2 rounded-2xl bg-zinc-800' placeholder='Enter you prompt'></textarea>
        <button disabled={isPending} onClick={()=>mutate()} className='p-2 rounded-full bg-sky-500 px-10 py-3 cursor-pointer'>Send</button>
        {isSuccess && <p className='text-green-500'>message sent!</p>}
        {isError && <p className='text-red-500'>error</p>}
        </div>
    </div>
  )
}

export default page