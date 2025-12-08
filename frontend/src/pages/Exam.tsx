import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ProgressBar,
} from "react-bootstrap";
import {
  createExam,
  saveAnswer,
  finishExam,
  Exam as ExamType,
} from "../services/exam.service";
import { getQuestion } from "../services/question.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export function Exam() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [exam, setExam] = useState<ExamType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionData, setQuestionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cronómetro 60 min
  const TOTAL_TIME = 60 * 60; // 3600 segundos
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  // -------------------------
  // CREAR EXAMEN + PRIMERA PREGUNTA
  // -------------------------
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    async function loadExam() {
      try {
        const newExam = await createExam(user!.sub.value);
        setExam(newExam);

        const firstQuestionId = newExam.content.questions[0].questionId;
        const q = await getQuestion(firstQuestionId);

        const userAnswerIds = newExam.content.questions[0].userAnswerIds ?? [];

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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadExam();
  }, [authLoading, user, navigate]);

  // -------------------------
  // CRONÓMETRO
  // -------------------------
  useEffect(() => {
    if (loading || !exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSendExam(); // enviar automáticamente
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

  // -------------------------
  // CAMBIAR PREGUNTA
  // -------------------------
  const handleChangeQuestion = async (newIndex: number) => {
    if (!exam) return;
    setCurrentIndex(newIndex);

    const questionId = exam.content.questions[newIndex].questionId;
    const q = await getQuestion(questionId);

    const userAnswerIds = exam.content.questions[newIndex].userAnswerIds ?? [];

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

  // -------------------------
  // GUARDAR RESPUESTA AUTOMÁTICAMENTE
  // -------------------------
  const handleAnswerSelect = async (answerId: string) => {
    if (!exam || !questionData) return;

    const updated = { ...exam };
    const q = updated.content.questions[currentIndex];

    if (questionData.type === "single") {
      q.userAnswerIds = [answerId];
    } else {
      const exists = q.userAnswerIds?.includes(answerId) ?? false;
      q.userAnswerIds = exists
        ? q.userAnswerIds?.filter((id: string) => id !== answerId) ?? []
        : [...(q.userAnswerIds ?? []), answerId];
    }

    setExam(updated);
    setQuestionData({ ...questionData, userAnswerIds: q.userAnswerIds });

    await saveAnswer(exam.id.value, {
      questionId: q.questionId,
      userAnswerIds: q.userAnswerIds ?? [],
    });
  };

  // -------------------------
  // ENVIAR EXAMEN
  // -------------------------
  const handleSendExam = async () => {
    if (!exam) return;
    if (!confirm("¿Quieres enviar el examen? No podrás modificarlo.")) return;

    try {
      const finished = await finishExam(exam.id.value);
      navigate(`/games/exam/result/${finished.id.value}`);
    } catch (err) {
      console.error(err);
      alert("Error al enviar el examen");
    }
  };

  // -------------------------
  // UI
  // -------------------------
  if (loading || !exam || !questionData)
    return <div className="text-center p-5">Cargando…</div>;

  const total = exam.content.questions.length;
  const answered = exam.content.questions.filter(
    (q) => (q.userAnswerIds?.length ?? 0) > 0
  ).length;

  return (
    <Container className="py-4">
      {/* CRONÓMETRO SUPERIOR */}
      <Row className="mb-3">
        <Col>
          <Card
            className="shadow-sm p-2 text-center"
            style={{ fontSize: "1.5rem", backgroundColor: "#f8f9fa" }}
          >
            Tiempo restante: {formatTime(timeLeft)}
          </Card>
        </Col>
      </Row>

      <Row className="gx-4">
        {/* PANEL LATERAL */}
        <Col xs={12} md={3}>
          <Card className="p-3 shadow-sm d-flex flex-column justify-content-between">
            <div>
              <div className="mb-3 text-center fw-bold">
                {answered} / {total}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "4px",
                }}
              >
                {exam.content.questions.map((q, index) => {
                  const isMarked = (q.userAnswerIds?.length ?? 0) > 0;
                  const bg = isMarked ? "#57cc82ff" : "white";
                  const color = isMarked ? "white" : "black";
                  const border =
                    index === currentIndex
                      ? "2px solid #115ed8ff"
                      : "1px solid #e5e7eb";

                  return (
                    <Button
                      key={index}
                      onClick={() => handleChangeQuestion(index)}
                      style={{
                        backgroundColor: bg,
                        color,
                        border,
                        padding: "4px 0",
                        fontSize: "0.8rem",
                      }}
                    >
                      {index + 1}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        </Col>

        {/* PANEL PREGUNTA */}
        <Col xs={12} md={9}>
          <Card className="shadow-sm p-3 position-relative">
            <Card.Body>
              <h4 className="mb-3">{questionData.text}</h4>

              <Form>
                {questionData.answers.map((ans: any) => (
                  <div
                    key={ans.id}
                    style={{
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      padding: "8px",
                      marginBottom: "6px",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <Form.Check
                      type={
                        questionData.type === "single" ? "radio" : "checkbox"
                      }
                      label={ans.text}
                      name="answers"
                      checked={
                        questionData.userAnswerIds?.includes(ans.id) ?? false
                      }
                      onChange={() => handleAnswerSelect(ans.id)}
                    />
                  </div>
                ))}
              </Form>

              {/* BOTONES DE NAVEGACIÓN */}
              <div className="d-flex justify-content-center mt-4 gap-2">
                <Button
                  variant="secondary"
                  disabled={currentIndex === 0}
                  onClick={() => handleChangeQuestion(currentIndex - 1)}
                  size="sm"
                >
                  ← Anterior
                </Button>

                <Button variant="success" size="sm" onClick={handleSendExam}>
                  Enviar examen
                </Button>

                <Button
                  variant="secondary"
                  disabled={currentIndex === total - 1}
                  onClick={() => handleChangeQuestion(currentIndex + 1)}
                  size="sm"
                >
                  Siguiente →
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
