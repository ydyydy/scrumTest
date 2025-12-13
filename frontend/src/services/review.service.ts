import { AnswerQuestionDto, AnswerQuestionResult } from "../utils/review.dto";
import { safeParseError } from "../utils/error-parser";

const API_URL = "http://localhost:3000/reviews";

// Obtener review existente de un usuario
export async function getReviewByUser(userId: string, token: string) {
  const response = await fetch(`${API_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    // Si no existe no lanza un error
    return null;
  }
  if (!response.ok) {
    const err = await safeParseError(response);
    throw new Error(err);
  }
  return await response.json();
}

export async function createReview(userId: string, token: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const err = await safeParseError(response);
    throw new Error(err);
  }

  return response.json();
}

export async function resetReview(
  reviewId: string,
  token: string
): Promise<void> {
  const res = await fetch(`${API_URL}/${reviewId}/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }
}

export async function answerQuestion(
  reviewId: string,
  dto: AnswerQuestionDto,
  token: string
): Promise<AnswerQuestionResult> {
  const res = await fetch(`${API_URL}/${reviewId}/answer`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }

  return res.json() as Promise<AnswerQuestionResult>;
}

export async function deleteReview(
  reviewId: string,
  token: string
): Promise<void> {
  const res = await fetch(`${API_URL}/${reviewId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }
}

export async function deleteReviewByUser(
  userId: string,
  token: string
): Promise<void> {
  const res = await fetch(`${API_URL}/user/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }
}
