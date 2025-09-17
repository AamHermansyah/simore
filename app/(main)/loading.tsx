import { LoaderCircle } from 'lucide-react'
import React from 'react'

function Loading() {
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4 justify-center items-center">
      <LoaderCircle className="size-5 mx-auto animate-spin" />
      <p>Sedang memuat...</p>
    </div>
  )
}

export default Loading;