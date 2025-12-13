import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { createExam, saveAnswer, finishExam } from "../services/exam.service";
import { getQuestion } from "../services/question.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { Exam as ExamType } from "../utils/exam.dto";
import { ConfirmModal } from "../components/ConfirmModal";

export function Exam() {
  const navigate = useNavigate();
  const { user, loading: authLoading, token } = useAuth();

  const [exam, setExam] = useState<ExamType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionData, setQuestionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const TOTAL_TIME = 60 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  // Crear exam
  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      navigate("/login");
      return;
    }

    async function loadExam() {
      try {
        const newExam = await createExam(user!.sub.value, token!);
        setExam(newExam);

        const first = newExam.content.questions[0];
        await loadQuestion(first.questionId, first.userAnswerIds ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadExam();
  }, [authLoading, user, token, navigate]);

  // cronómetro
  useEffect(() => {
    if (loading || !exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowConfirm(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, exam]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // cargar pregutnas
  const loadQuestion = async (questionId: string, userAnswerIds: string[]) => {
    if (!token) return;

    const q = await getQuestion(questionId, token);

    setQuestionData({
      id: q._id.value,
      text: q.props.text,
      type: q.props.questionType,
      answers: q.props.answers.map((a: any) => ({
        id: a._id.value,
        text: a.props.text,
      })),
      userAnswerIds,
    });
  };

  const handleChangeQuestion = async (index: number) => {
    if (!exam) return;

    setCurrentIndex(index);
    const q = exam.content.questions[index];
    await loadQuestion(q.questionId, q.userAnswerIds ?? []);
  };

  // seleccionar respuestas
  const handleAnswerSelect = async (answerId: string) => {
    if (!exam || !questionData || !token) return;

    const updated = { ...exam };
    const q = updated.content.questions[currentIndex];

    if (questionData.type === "single") {
      q.userAnswerIds = [answerId];
    } else {
      const exists = q.userAnswerIds?.includes(answerId);
      q.userAnswerIds = exists
        ? q.userAnswerIds!.filter((id) => id !== answerId)
        : [...(q.userAnswerIds ?? []), answerId];
    }

    setExam(updated);
    setQuestionData({ ...questionData, userAnswerIds: q.userAnswerIds });

    await saveAnswer(
      exam.id.value,
      {
        questionId: q.questionId,
        userAnswerIds: q.userAnswerIds ?? [],
      },
      token
    );
  };

  /* ================= ENVIAR EXAMEN ================= */
  const handleConfirmSendExam = async () => {
    if (!exam || !token) return;

    try {
      const finished = await finishExam(exam.id.value, token);
      navigate(`/games/exam/result/${finished.id.value}`);
    } catch (err) {
      console.error(err);
      alert("Error al enviar el examen");
    } finally {
      setShowConfirm(false);
    }
  };

  if (loading || !exam || !questionData) {
    return <div className="text-center p-5">Cargando…</div>;
  }

  const total = exam.content.questions.length;
  const answered = exam.content.questions.filter(
    (q) => (q.userAnswerIds?.length ?? 0) > 0
  ).length;

  return (
    <Container className="exam-container">
      {/* CRONÓMETRO */}
      <Row className="mb-3">
        <Col>
          <Card className="exam-card exam-timer">
            Tiempo restante: {formatTime(timeLeft)}
          </Card>
        </Col>
      </Row>

      <Row className="gx-4">
        {/* PANEL LATERAL */}
        <Col xs={12} md={3}>
          <Card className="exam-card exam-sidebar">
            <div className="exam-progress">
              {answered} / {total}
            </div>

            <div className="exam-question-grid">
              {exam.content.questions.map((q, index) => (
                <Button
                  key={index}
                  className={`question-index
                    ${index === currentIndex ? "active" : ""}
                    ${(q.userAnswerIds?.length ?? 0) > 0 ? "answered" : ""}
                  `}
                  onClick={() => handleChangeQuestion(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="success"
              className="exam-submit-button"
              onClick={() => setShowConfirm(true)}
            >
              Enviar examen
            </Button>
          </Card>
        </Col>

        {/* PANEL PREGUNTA */}
        <Col xs={12} md={9}>
          <Card className="exam-card exam-question-card">
            <h4 className="mb-3">{questionData.text}</h4>

            <Form>
              {questionData.answers.map((ans: any) => (
                <div key={ans.id} className="exam-answer">
                  <Form.Check
                    type={questionData.type === "single" ? "radio" : "checkbox"}
                    label={ans.text}
                    checked={questionData.userAnswerIds.includes(ans.id)}
                    onChange={() => handleAnswerSelect(ans.id)}
                  />
                </div>
              ))}
            </Form>

            <div className="exam-navigation">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentIndex === 0}
                onClick={() => handleChangeQuestion(currentIndex - 1)}
              >
                ← Anterior
              </Button>

              <Button
                variant="secondary"
                size="sm"
                disabled={currentIndex === total - 1}
                onClick={() => handleChangeQuestion(currentIndex + 1)}
              >
                Siguiente →
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* MODAL CONFIRMACIÓN */}
      <ConfirmModal
        show={showConfirm}
        title="Enviar examen"
        message="¿Quieres enviar el examen? No podrás modificarlo."
        onConfirm={handleConfirmSendExam}
        onCancel={() => setShowConfirm(false)}
      />
    </Container>
  );
}
