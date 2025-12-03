import { createUserDTO } from "../utils/domain.utils";

const API_URL = "http://localhost:3000/users";

export async function registerUser(data: createUserDTO): Promise<void> {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error during registration");
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<string> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error during login");
  }

  const data = await response.json();
  return data.access_token; // un simple string
}

// Obtener perfil de usuario
export async function getUserProfile(
  id: string
): Promise<{ id: string; email: string; username: string }> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error fetching user profile");
  }

  const data = await response.json();
  return data;
}

// Actualizar username (PATCH)
export async function updateUser(
  id: string,
  payload: { username: string }
): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error updating user");
  }
}
