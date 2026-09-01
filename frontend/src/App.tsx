import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Spinner from "./presentation/components/common/Spinner";

import PublicRoute from "./presentation/routes/PublicRoute";
import AuthGateway from "./presentation/pages/auth/AuthGateway";
import { useAuth } from "./hooks/useAuth";

const App = () => {

  const {checkAuth} = useAuth();

  useEffect(() => {
    checkAuth();
  },[checkAuth])

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
        </Routes>
      </Suspense>
    </>
  )
}

export default App;
