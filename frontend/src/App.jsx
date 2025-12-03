import { ScrumTestNavbar } from "./components/ScrumTestNavbar";
import { Footer } from "./components/Footer";
import { AppRoutes } from "./router/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AuthProvider>
      <ScrumTestNavbar />
      <div className="global-background min-vh-80">
        <AppRoutes />
      </div>
      <Footer />
    </AuthProvider>
  );
}

export default App;
