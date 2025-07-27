'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Property {
  id: number
  image: string
  title: string
  price: string
  location: string
  specs: {
    beds: number
    baths: number
  }
}

interface SavedPropertiesContextType {
  savedProperties: Property[]
  toggleSaveProperty: (property: Property) => void
  isPropertySaved: (propertyId: number) => boolean
}

const SavedPropertiesContext = createContext<SavedPropertiesContextType | undefined>(undefined)

export function SavedPropertiesProvider({ children }: { children: ReactNode }) {
  const [savedProperties, setSavedProperties] = useState<Property[]>([])

  // Load saved properties from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedProperties')
      if (saved) {
        setSavedProperties(JSON.parse(saved))
      }
    }
  }, [])

  // Save to localStorage whenever savedProperties changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedProperties', JSON.stringify(savedProperties))
    }
  }, [savedProperties])

  const toggleSaveProperty = (property: Property) => {
    setSavedProperties(prev => {
      const isAlreadySaved = prev.some(p => p.id === property.id)
      if (isAlreadySaved) {
        return prev.filter(p => p.id !== property.id)
      } else {
        return [...prev, property]
      }
    })
  }

  const isPropertySaved = (propertyId: number) => {
    return savedProperties.some(property => property.id === propertyId)
  }

  return (
    <SavedPropertiesContext.Provider value={{ savedProperties, toggleSaveProperty, isPropertySaved }}>
      {children}
    </SavedPropertiesContext.Provider>
  )
}

export function useSavedProperties() {
  const context = useContext(SavedPropertiesContext)
  if (context === undefined) {
    throw new Error('useSavedProperties must be used within a SavedPropertiesProvider')
  }
  return context
}

