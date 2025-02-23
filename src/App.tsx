import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Session expired",
        description: "Please log in again to continue.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isLoading, toast]);

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
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        setAuthState({
          isAuthenticated: !!session,
          isLoading: false,
        });
      } catch (error) {
        console.error("Session check error:", error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }

      if (event === 'SIGNED_OUT') {
        // Clear any stored session data
        await supabase.auth.signOut();
      }

      setAuthState({
        isAuthenticated: !!session,
        isLoading: false,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authState}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TitleUpdater />
            <div className="min-h-screen flex">
              {authState.isAuthenticated && !authState.isLoading && <AppSidebar />}
              <main className="flex-1 bg-background">
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
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;