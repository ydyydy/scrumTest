import { createUserDTO } from "../utils/domain.utils";
import { safeParseError } from "../utils/error-parser";

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
    const err = await safeParseError(response);
    throw new Error(err);
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
    const err = await safeParseError(response);
    throw new Error(err);
  }

  const data = await response.json();
  return data.access_token;
}

export async function getUserProfile(
  id: string,
  token: string
): Promise<{ id: string; email: string; username: string }> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await safeParseError(response);
    throw new Error(err);
  }

  const data = await response.json();
  return data;
}

export async function updateUser(
  id: string,
  payload: Partial<{ username: string; isAdmin: boolean }>,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await safeParseError(response);
    throw new Error(err);
  }
}

// Obtener lista de usuarios con paginación
export async function getUsers(page: number, limit: number, token: string) {
  const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await safeParseError(response);
    throw new Error(err);
  }

  return await response.json();
}

// Eliminar usuario
export async function deleteUser(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await safeParseError(response);
    throw new Error(err);
  }
}
