'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button, LoadingButton } from '@/components/ui/button'

export default function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (location) {
      setIsLoading(true)
      router.push(`/search?state=${encodeURIComponent(location)}`)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl">
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white/10 backdrop-blur-md rounded-lg">
        <input
          type="text"
          placeholder="Search by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 h-14 px-4 rounded-md bg-white/20 backdrop-blur-md text-white placeholder-white/70 text-lg"
        />
        <LoadingButton 
          type="submit"
          disabled={!location}
          loading={isLoading}
          className="w-full md:w-auto h-14 px-8 text-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white active:bg-black"
        >
          <Search className="w-5 h-5 mr-2" />
          Search
        </LoadingButton>
      </div>
    </form>
  )
}

