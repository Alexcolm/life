import { HashRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { LoginPage } from './auth/LoginPage'
import { RequireAuth } from './auth/RequireAuth'
import { CalendarPage } from './features/calendar/CalendarPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { GoalsPage } from './features/goals/GoalsPage'
import { NutritionPage } from './features/nutrition/NutritionPage'
import { RoutinesPage } from './features/routines/RoutinesPage'
import { TasksPage } from './features/tasks/TasksPage'
import { AppShell } from './layout/AppShell'

export function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <AppShell>
                  <DashboardPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/tareas"
            element={
              <RequireAuth>
                <AppShell>
                  <TasksPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/metas"
            element={
              <RequireAuth>
                <AppShell>
                  <GoalsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/rutinas"
            element={
              <RequireAuth>
                <AppShell>
                  <RoutinesPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/calendario"
            element={
              <RequireAuth>
                <AppShell>
                  <CalendarPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/nutricion"
            element={
              <RequireAuth>
                <AppShell>
                  <NutritionPage />
                </AppShell>
              </RequireAuth>
            }
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
