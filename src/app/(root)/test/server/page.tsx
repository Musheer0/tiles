
import { caller } from '@/trpc/server'
import React from 'react'

const page =async () => {
    const data =await caller.hello({text: 'server'})
  return (
    <div>
        {JSON.stringify(data)}
    </div>
  )
}

export default page