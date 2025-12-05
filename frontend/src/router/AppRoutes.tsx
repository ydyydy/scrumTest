import { Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Games } from "../pages/Games";
import { useAuth } from "../context/AuthContext";
import { Review } from "../pages/Review";
import { UserProfile } from "../pages/profile";
import { AdminHome } from "../pages/AdminHome";
import { CreateQuestion } from "../pages/CreateQuestion";
import { ManageQuestions } from "../pages/ManageQuestions";
import { ManageUsers } from "../pages/ManageUsers";

export function AppRoutes() {
  const { isLoggedIn, isAdmin } = useAuth();
  return (
    <Routes>
      {/* General */}
      <Route
        path="/"
        element={isLoggedIn ? isAdmin ? <AdminHome /> : <Games /> : <Home />}
      />
      <Route
        path="/home"
        element={isLoggedIn ? isAdmin ? <AdminHome /> : <Games /> : <Home />}
      />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/profile"
        element={isLoggedIn ? <UserProfile /> : <Login />}
      />

      {/* games */}
      <Route path="/games" element={<Games />} />
      <Route path="/games/review" element={<Review />} />
      <Route path="/games/exam" element={<Home />} />
      <Route path="/games/ranking" element={<Home />} />

      {/* Admin */}
      <Route path="/create-question" element={<CreateQuestion />} />
      <Route path="/manage-questions" element={<ManageQuestions />} />
      <Route path="/manage-users" element={<ManageUsers />} />
    </Routes>
  );
}
