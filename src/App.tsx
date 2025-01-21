import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";
import Upload from "./pages/Upload";
import Categories from "./pages/analytics/Categories";
import Mappings from "./pages/Mappings";
import Reminders from "./pages/Reminders";
import { supabase } from "./integrations/supabase/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({ isAuthenticated: false, isLoading: true });

export const useAuth = () => useContext(AuthContext);

// Title mapping for routes
const routeTitles: Record<string, string> = {
  "/": "Dashboard | My Budget App",
  "/login": "Login | My Budget App",
  "/transactions": "Transactions | My Budget App",
  "/upload": "Upload | My Budget App",
  "/analytics/categories": "Categories | My Budget App",
  "/mappings": "Mappings | My Budget App",
  "/reminders": "Reminders | My Budget App",
};

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const title = routeTitles[location.pathname] || "My Budget App";
    document.title = title;
  }, [location]);

  return null;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => {
  const [authState, setAuthState] = useState<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        isAuthenticated: !!session,
        isLoading: false,
      });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        isAuthenticated: !!session,
        isLoading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authState}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TitleUpdater />
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                {authState.isAuthenticated && !authState.isLoading && <AppSidebar />}
                <main className="flex-1">
                  {authState.isAuthenticated && !authState.isLoading && <SidebarTrigger />}
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/transactions"
                      element={
                        <ProtectedRoute>
                          <Transactions />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/upload"
                      element={
                        <ProtectedRoute>
                          <Upload />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/mappings"
                      element={
                        <ProtectedRoute>
                          <Mappings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/analytics/categories"
                      element={
                        <ProtectedRoute>
                          <Categories />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reminders"
                      element={
                        <ProtectedRoute>
                          <Reminders />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;