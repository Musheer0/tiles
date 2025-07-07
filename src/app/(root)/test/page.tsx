"use client"
import { useTrpc } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const page = () => {
    const trcp = useTrpc()
    const {data} = useQuery({
        queryKey: ['test'],
        queryFn:async()=>await trcp.hello.query({text: 'wolrd'})
    });
  return (
    <div>
        {JSON.stringify(data)}
    </div>
  )
}

export default page