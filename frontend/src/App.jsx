import { ScrumTestNavbar } from "./components/ScrumTestNavbar";
import { Footer } from "./components/Footer";
import { AppRoutes } from "./router/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { useLocation } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

function Layout() {
  const location = useLocation();

  // Ocultar Navbar y Footer solo en /games/exam
  const isExamMode = location.pathname === "/games/exam";

  return (
    <div className={`d-flex flex-column min-vh-100`}>
      {!isExamMode && <ScrumTestNavbar />}
      <main
        className={`flex-grow-1 global-background ${isExamMode ? "min-vh-100" : ""}`}
      >
        <AppRoutes />
      </main>
      {!isExamMode && <Footer />}
    </div>
  );
}

export default App;
