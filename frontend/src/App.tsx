import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import PublicRoute from "./presentation/routes/PublicRoute";
import AuthGateway from "./presentation/pages/auth/AuthGateway";
import { useAuth } from "./hooks/useAuth";
import UserProtectedRoute from "./presentation/routes/UserProtectedRoute";
const Dashboard = lazy(() => import('./presentation/pages/dashboard/Dashboard'));
const Tasks = lazy(() => import('./presentation/pages/task/Task'));

const App = () => {

  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
        </div>
      }>

        <Routes>
          <Route path="/register"
            element={
              <PublicRoute>
                <AuthGateway mode="signup" />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthGateway mode="login" />
              </PublicRoute>
            }
          />

          <Route element={<UserProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
          </Route>


        </Routes>
      </Suspense>
    </>
  )
}

export default App;
