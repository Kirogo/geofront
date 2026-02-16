import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import reportReducer from './slices/reportSlice'
import notificationReducer from './slices/notificationSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportReducer,
    notifications: notificationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['reports/uploadPhoto/fulfilled'],
        // Ignore these field paths in the state
        ignoredPaths: ['reports.uploadQueue'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch