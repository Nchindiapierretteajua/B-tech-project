export interface Service {
  id: string
  name: string
  shortDescription: string
  description: string
  category: string
  address: string
  area: string
  phone: string
  website: string
  hours: Record<string, string>
  requirements: string[]
  tags: string[]
  featured: boolean
  colorScheme: string
  icon: string
  accessibility: boolean
  onlineAvailable: boolean
  location?: {
    latitude: number
    longitude: number
  }
  steps?: Step[]
}

export interface Step {
  title: string
  description: string
  tips?: string[]
  documents?: string[]
}

