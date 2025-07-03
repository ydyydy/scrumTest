import { ScrumTestNavbar } from "./components/ScrumTestNavbar";
import { Footer } from "./components/Footer";
import { AppRoutes } from "./router/AppRoutes";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrumTestNavbar />
      <div className="flex-grow-1">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}

export default App;
