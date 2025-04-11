import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type UserRole = "citizen" | "service-provider"

interface User {
  id: string
  name: string
  phoneNumber: string
  role: UserRole
  organization?: string
  favorites: string[] // Array of service IDs
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      if (state.user) {
        const serviceId = action.payload
        const favorites = [...state.user.favorites]
        const index = favorites.indexOf(serviceId)

        if (index === -1) {
          // Add to favorites
          favorites.push(serviceId)
        } else {
          // Remove from favorites
          favorites.splice(index, 1)
        }

        state.user.favorites = favorites
      }
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, updateUserProfile, toggleFavorite } = authSlice.actions

export default authSlice.reducer

