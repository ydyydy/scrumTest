const API_URL = "http://localhost:3000/reviews";

export interface AnswerQuestionDto {
  questionId: string;
  userAnswerIds: string[]; // en tu caso siempre 1 elemento para single
}

export interface AnswerQuestionResult {
  isCorrect: boolean;
  correctAnswerIds: string[];
  progress: {
    answered: number;
    total: number;
  };
}

// Obtener review existente de un usuario
export async function getReviewByUser(userId: string) {
  const response = await fetch(`${API_URL}/user/${userId}`);
  if (response.status === 404) {
    // No existe review → devolver null y NO lanzar error
    return null;
  }
  if (!response.ok) {
    throw new Error("Error fetching review");
  }
  return await response.json();
}

// Crear review nuevo
export async function createReview(userId: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Error creating review");
  }

  return response.json();
}

export async function resetReview(reviewId: string): Promise<void> {
  const res = await fetch(`${API_URL}/${reviewId}/reset`, {
    method: "POST",
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }
}

export async function answerQuestion(
  reviewId: string,
  dto: AnswerQuestionDto
): Promise<AnswerQuestionResult> {
  const res = await fetch(`${API_URL}/${reviewId}/answer`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
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

/** Helper para sacar mensaje de error del body si existe */
async function safeParseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data && (data.message || data.error)) return data.message || data.error;
    return `HTTP ${res.status} ${res.statusText}`;
  } catch {
    return `HTTP ${res.status} ${res.statusText}`;
  }
}
