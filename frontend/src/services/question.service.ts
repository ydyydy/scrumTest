const API_URL = "http://localhost:3000/questions";

export interface AnswerDto {
  text: string;
  isCorrect?: boolean;
}

export interface CreateQuestionDto {
  text: string;
  answers: AnswerDto[];
  category: string;
  questionType: "single" | "multiple";
}

export async function getQuestion(id: string) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) throw new Error("Error al cargar pregunta");

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
    const error = await response.json();
    throw new Error(error.message || "Error creating question");
  }
}
