import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useAuth } from "./hooks/useAuth";
import { EMMEEngageApp } from "./components/EMMEEngageApp";
import { useState } from "react";

function Router() {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Route directly to EMME Engage app
  return (
    <Switch>
      <Route path="/" component={EMMEEngageApp} />
      <Route path="/emme-engage/*" component={EMMEEngageApp} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Router />
      </div>
    </QueryClientProvider>
  );
}

export default App;