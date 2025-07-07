"use client"
import { useTrpc } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query';
import React from 'react'

const page = () => {
  const trpc =useTrpc()
  const event = useMutation({
    mutationKey: ['test'],
    mutationFn:async()=>await trpc.invoke.mutate({value: 'test'})
  })
  return (
    <div>
        <button className='p-5 bg-red-500' onClick={()=>event.mutate()}>test inngest</button>
    </div>
  )
}

export default page