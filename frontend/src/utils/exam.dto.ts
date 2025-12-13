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

// Ranking
export interface RankingEntry {
  username: string;
  score: number;
  duration: number;
}

export interface RankingDto {
  top: RankingEntry[];
}
