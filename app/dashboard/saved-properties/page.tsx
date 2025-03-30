'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PropertyCard } from '../components/property-card'
import { useSavedProperties } from '@/app/contexts/saved-properties-context'
import { useGetUserLikedProperties } from '@/services/property/propertyFn'
import { Skeleton } from '@/components/ui/skeleton'

const demoProperties = [
  {
    id: 1,
    image: "https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg",
    title: "Rosewood Apartments",
    price: "₦280,000",
    location: "12 Oak Lane, Lagos, Nigeria",
    specs: {
      beds: 6,
      baths: 4,
    }
  },
  {
    id: 2,
    image: "https://cdn.pixabay.com/photo/2017/11/16/19/29/cottage-2955582_960_720.jpg",
    title: "Maple Ridge Homes",
    price: "₦320,000",
    location: "15 Maple Road, Lagos, Nigeria",
    specs: {
      beds: 5,
      baths: 3,
    }
  }
]

export default function SavedPropertiesPage() {
  const { savedProperties } = useSavedProperties()
  const [showDemo] = useState(savedProperties.length === 0)

  const { data: properties, isFetching: isFetchingProperties } = useGetUserLikedProperties()

  console.log(properties)

  if (isFetchingProperties || !properties) {
    return (
      <div className="layout">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="layout">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Saved properties</span>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Saved properties</h1>
        <p className="text-gray-500">
          {properties?.length} {properties?.length === 1 ? 'property' : 'properties'} saved
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {properties?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties?.map((property: any, index: number) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <PropertyCard
                  {...property}
                  showViewProperty
                  property={property}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-lg font-semibold mb-2">No saved properties</h3>
            <p className="text-gray-500 mb-4">
              You haven't saved any properties yet. Browse our listings to find your perfect home.
            </p>
            <Link 
              href="/dashboard/search"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Browse properties
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {showDemo && properties?.length === 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            👆 Try clicking the heart icon on any property card above to save it to your list!
          </p>
        </div>
      )}
    </div>
  )
}

