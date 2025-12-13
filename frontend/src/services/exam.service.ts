import { Exam, ExamResult, SaveAnswerDto, RankingDto } from "../utils/exam.dto";
import { safeParseError } from "../utils/error-parser";

const API_URL = "http://localhost:3000/exams";

// Crear un nuevo examen
export async function createExam(userId: string, token: string): Promise<Exam> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }

  return res.json() as Promise<Exam>;
}

// Guardar respuesta de una pregunta
export async function saveAnswer(
  examId: string,
  dto: SaveAnswerDto,
  token: string
): Promise<Exam> {
  const res = await fetch(`${API_URL}/${examId}/answer`, {
    method: "POST",
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

  return res.json() as Promise<Exam>;
}

// Finalizar examen
export async function finishExam(examId: string, token: string): Promise<Exam> {
  const res = await fetch(`${API_URL}/${examId}/finish`, {
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

  return res.json() as Promise<Exam>;
}

// Obtener resultado de examen
export async function getExamResult(
  examId: string,
  token: string
): Promise<ExamResult> {
  const res = await fetch(`${API_URL}/${examId}/result`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }
  return res.json() as Promise<ExamResult>;
}

export async function getTopRanking(token: string): Promise<RankingDto> {
  const res = await fetch(`${API_URL}/ranking`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }

  return res.json() as Promise<RankingDto>;
}

export async function getUserExamHistory(
  userId: string,
  page: number,
  limit: number,
  token: string
) {
  const res = await fetch(
    `${API_URL}/history/${userId}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }

  return res.json();
}

export async function deleteExam(examId: string, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/${examId}`, {
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

export async function deleteAllExamsOfUser(
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
