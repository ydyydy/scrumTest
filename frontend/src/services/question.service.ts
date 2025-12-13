import { CreateQuestionDto } from "../utils/question.dto";
import { safeParseError } from "../utils/error-parser";

const API_URL = "http://localhost:3000/questions";

export async function getQuestion(id: string, token: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await safeParseError(response);
    throw new Error(err);
  }

  return response.json();
}

export async function createQuestion(
  dto: CreateQuestionDto,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const err = await safeParseError(response);
    throw new Error(err);
  }
}

export async function getQuestions(page: number, limit: number, token: string) {
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

export async function deleteQuestion(id: string, token: string) {
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

  return true;
}
