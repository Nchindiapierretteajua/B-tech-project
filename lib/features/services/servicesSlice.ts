import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Service } from "@/lib/types"
import { mockServices } from "@/lib/mock-data"

interface SearchFilters {
  query?: string
  location?: string
  category?: string
}

interface Filters {
  categories?: string[]
  locations?: string[]
  accessibility?: boolean
  onlineAvailable?: boolean
}

interface ServicesState {
  services: Service[]
  featuredServices: Service[]
  filteredServices: Service[]
  searchFilters: SearchFilters
  filters: Filters
  loading: boolean
  error: string | null
}

const initialState: ServicesState = {
  services: mockServices,
  featuredServices: mockServices.filter((service) => service.featured).slice(0, 3),
  filteredServices: mockServices,
  searchFilters: {},
  filters: {},
  loading: false,
  error: null,
}

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setSearchFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.searchFilters = action.payload
      state.filteredServices = filterServices(state.services, state.searchFilters, state.filters)
    },
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload
      state.filteredServices = filterServices(state.services, state.searchFilters, state.filters)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

// Helper function to filter services based on search filters and filters
function filterServices(services: Service[], searchFilters: SearchFilters, filters: Filters): Service[] {
  let filtered = [...services]

  // Apply search filters
  if (searchFilters.query) {
    const query = searchFilters.query.toLowerCase()
    filtered = filtered.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  if (searchFilters.location) {
    const location = searchFilters.location.toLowerCase()
    filtered = filtered.filter(
      (service) => service.address.toLowerCase().includes(location) || service.area.toLowerCase().includes(location),
    )
  }

  if (searchFilters.category) {
    filtered = filtered.filter((service) => service.category.toLowerCase() === searchFilters.category?.toLowerCase())
  }

  // Apply additional filters
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((service) => filters.categories?.includes(service.category.toLowerCase()))
  }

  if (filters.locations && filters.locations.length > 0) {
    filtered = filtered.filter((service) => filters.locations?.some((loc) => service.area.toLowerCase().includes(loc)))
  }

  if (filters.accessibility) {
    filtered = filtered.filter((service) => service.accessibility)
  }

  if (filters.onlineAvailable) {
    filtered = filtered.filter((service) => service.onlineAvailable)
  }

  return filtered
}

export const { setSearchFilters, setFilters, setLoading, setError } = servicesSlice.actions

export default servicesSlice.reducer

