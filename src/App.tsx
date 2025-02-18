import { JSX } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { SpeedInsights } from "@vercel/speed-insights/react";
import HomePage from "./pages/Home.tsx";
import LoginPage from "./pages/Login.tsx";
import ToastContainer from "./components/ToastContainer.tsx";
import { useAuthStore } from "./stores/auth";

const Private = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <Router>
    <div className="relative">
      <Routes>
        <Route
          path="/"
          element={
            <Private>
              <HomePage />
            </Private>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <ToastContainer />
      <SpeedInsights />
    </div>
  </Router>
);

export default App;
