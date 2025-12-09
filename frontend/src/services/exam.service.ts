// services/exam.service.ts
const API_URL = "http://localhost:3000/exams";

export interface ExamQuestion {
  questionId: string;
  userAnswerIds?: string[];
  isCorrect?: boolean;
  answered?: boolean;
}

export interface ExamContent {
  questions: ExamQuestion[];
}

export interface Exam {
  id: { value: string };
  userId: string;
  startDate: string;
  finishDate: string | null;
  duration: number | null;
  score: number | null;
  content: ExamContent;
}

// DTO para guardar respuesta
export interface SaveAnswerDto {
  questionId: string;
  userAnswerIds: string[];
}

export interface ExamResultAnswer {
  id: string;
  text: string;
}

export interface ExamHistoryItemDto {
  examId: string;
  score: number | null;
  duration: number | null;
  correct: number;
  incorrect: number;
  finishDate: string | null;
}

export interface ExamResultQuestion {
  questionId: string;
  text: string;
  answers: ExamResultAnswer[];
  userAnswerIds: string[];
  isCorrect: boolean;
  answered: boolean;
}

export interface ExamResult {
  id: string;
  score: number | null;
  duration: number | null;
  questions: ExamResultQuestion[];
}

// -----------------------------------------
// Crear un nuevo examen
// -----------------------------------------
export async function createExam(userId: string): Promise<Exam> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }

  return res.json() as Promise<Exam>;
}

// -----------------------------------------
// Guardar respuesta de una pregunta
// -----------------------------------------
export async function saveAnswer(
  examId: string,
  dto: SaveAnswerDto
): Promise<Exam> {
  console.log("Saving answer for exam:", examId, dto);
  const res = await fetch(`${API_URL}/${examId}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }

  return res.json() as Promise<Exam>;
}

// -----------------------------------------
// Finalizar examen
// -----------------------------------------
export async function finishExam(examId: string): Promise<Exam> {
  const res = await fetch(`${API_URL}/${examId}/finish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }

  return res.json() as Promise<Exam>;
}

// -----------------------------------------
// Obtener examen por id (opcional)
// -----------------------------------------
export async function getExamById(examId: string): Promise<Exam> {
  const res = await fetch(`${API_URL}/${examId}`);
  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err);
  }
  return res.json() as Promise<Exam>;
}

// -----------------------------------------
// Helper para errores
// -----------------------------------------
async function safeParseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data && (data.message || data.error)) return data.message || data.error;
    return `HTTP ${res.status} ${res.statusText}`;
  } catch {
    return `HTTP ${res.status} ${res.statusText}`;
  }
}

/**
 * Obtener resultado de examen
 */
export async function getExamResult(examId: string): Promise<ExamResult> {
  const res = await fetch(`${API_URL}/${examId}/result`);
  if (!res.ok) {
    throw new Error(`Error fetching exam result: ${res.statusText}`);
  }
  return res.json() as Promise<ExamResult>;
}

export interface RankingEntry {
  username: string;
  score: number;
  duration: number;
}

export interface RankingDto {
  top: RankingEntry[];
}

export async function getTopRanking(): Promise<RankingDto> {
  const res = await fetch("http://localhost:3000/exams/ranking");
  if (!res.ok) throw new Error(`Error cargando ranking: ${res.statusText}`);
  return res.json() as Promise<RankingDto>;
}

export async function getUserExamHistory(
  userId: string,
  page: number,
  limit: number,
  token: string
) {
  console.log(
    "Fetching exam history for userId:",
    userId,
    "page:",
    page,
    "limit:",
    limit
  );
  const res = await fetch(
    `${API_URL}/history/${userId}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error cargando historial del usuario");
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
