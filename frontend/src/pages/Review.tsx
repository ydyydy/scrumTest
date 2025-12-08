import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import {
  answerQuestion,
  createReview,
  getReviewByUser,
  resetReview,
} from "../services/review.service";
import { getQuestion } from "../services/question.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export function Review() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [review, setReview] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionData, setQuestionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // CARGAR REVIEW + PRIMERA PREGUNTA
  // -----------------------------------------
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    async function loadReview() {
      try {
        let reviewData = await getReviewByUser(user!.sub.value);

        if (!reviewData) {
          reviewData = await createReview(user!.sub.value);
        }
        setReview(reviewData);

        const firstQuestionId = reviewData.content.questions[0].questionId;
        const question = await getQuestion(firstQuestionId);

        setQuestionData({
          id: question._id.value,
          text: question.props.text,
          type: question.props.questionType,
          answers: question.props.answers.map((a: any) => ({
            id: a._id.value,
            text: a.props.text,
            isCorrect: a.props.isCorrect,
          })),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadReview();
  }, [user, authLoading, navigate]);

  // -----------------------------------------
  // CAMBIAR PREGUNTA
  // -----------------------------------------
  const handleChangeQuestion = async (newIndex: number) => {
    setCurrentIndex(newIndex);

    const questionId = review.content.questions[newIndex].questionId;
    const questionRaw = await getQuestion(questionId);

    setQuestionData({
      id: questionRaw._id.value,
      text: questionRaw.props.text,
      type: questionRaw.props.questionType,
      answers: questionRaw.props.answers.map((a: any) => ({
        id: a._id.value,
        text: a.props.text,
        isCorrect: a.props.isCorrect,
      })),
    });
  };

  // -----------------------------------------
  // SELECCIONAR RESPUESTA
  // -----------------------------------------
  const handleAnswerSelect = (answerId: string) => {
    if (!review) return;

    const updated = { ...review };
    const q = updated.content.questions[currentIndex];

    if (questionData.type === "single") {
      q.userAnswerIds = [answerId];
    } else {
      const exists = q.userAnswerIds?.includes(answerId);
      q.userAnswerIds = exists
        ? q.userAnswerIds.filter((id: string) => id !== answerId)
        : [...(q.userAnswerIds || []), answerId];
    }

    setReview(updated);
  };

  // -----------------------------------------
  // VALIDAR PREGUNTA
  // -----------------------------------------
  const handleValidate = async () => {
    if (!review) return;

    const q = review.content.questions[currentIndex];
    const selected = q.userAnswerIds;

    if (!selected || selected.length === 0) {
      alert("Selecciona al menos una respuesta.");
      return;
    }

    try {
      const result = await answerQuestion(review.id.value, {
        questionId: q.questionId,
        userAnswerIds: selected,
      });

      const updated = { ...review };
      updated.content.questions[currentIndex].isCorrect = result.isCorrect;
      updated.content.questions[currentIndex].answered = true;

      setReview(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // -----------------------------------------
  // SALIR
  // -----------------------------------------
  const handleGoBack = () => navigate("/home");

  // -----------------------------------------
  // REINICIAR
  // -----------------------------------------
  const handleReset = async () => {
    if (
      !confirm(
        "¿Seguro que quieres reiniciar el test? Se perderán todas tus respuestas."
      )
    )
      return;

    try {
      await resetReview(review.id.value);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al reiniciar el review");
    }
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------
  if (loading || !review || !questionData)
    return <div className="text-center p-5">Cargando…</div>;

  const total = review.content.questions.length;
  const answered = review.content.questions.filter(
    (q: any) => q.userAnswerIds?.length > 0
  ).length;

  return (
    <Container className="py-4">
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
                {review.content.questions.map((q: any, index: number) => {
                  const isAnswered = q.answered; // solo marcar después de validar
                  const isCorrect = q.isCorrect === true;

                  let bg = "white";
                  if (isAnswered) bg = isCorrect ? "#57cc82ff" : "#e66f6fff";

                  let border =
                    index === currentIndex
                      ? "2px solid #115ed8ff"
                      : "1px solid #e5e7eb";

                  return (
                    <Button
                      key={index}
                      onClick={() => handleChangeQuestion(index)}
                      style={{
                        backgroundColor: bg,
                        color: bg === "white" ? "black" : "white",
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

            {/* BOTÓN REINICIAR */}
            <Button
              variant="warning"
              onClick={handleReset}
              className="mt-3 w-100"
            >
              Reiniciar
            </Button>
          </Card>
        </Col>

        {/* PANEL PREGUNTA */}
        <Col xs={12} md={9}>
          <Card className="shadow-sm p-3 position-relative">
            {/* BOTÓN SALIR EN ESQUINA SUPERIOR */}
            <Button
              variant="warning"
              onClick={handleGoBack}
              style={{ position: "absolute", top: "10px", right: "10px" }}
            >
              Salir
            </Button>

            <Card.Body>
              <h4 className="mb-3">{questionData.text}</h4>

              <Form>
                {questionData.answers.map((ans: any) => (
                  <div
                    key={ans.id}
                    style={{
                      border: "1px solid #d1d5db", // gris claro
                      borderRadius: "4px",
                      padding: "8px",
                      marginBottom: "6px",
                      backgroundColor: "#f9fafb", // fondo muy suave
                    }}
                  >
                    <Form.Check
                      type={
                        questionData.type === "single" ? "radio" : "checkbox"
                      }
                      label={ans.text}
                      name="answers"
                      checked={review.content.questions[
                        currentIndex
                      ].userAnswerIds?.includes(ans.id)}
                      onChange={() => handleAnswerSelect(ans.id)}
                      disabled={review.content.questions[currentIndex].answered}
                    />
                  </div>
                ))}
              </Form>

              {/* BOTONES DE NAVEGACIÓN ABAJO */}
              <div className="d-flex justify-content-center mt-4 gap-2">
                <div className="d-flex gap-1">
                  <Button
                    variant="secondary"
                    disabled={currentIndex === 0}
                    onClick={() => handleChangeQuestion(currentIndex - 1)}
                    size="sm"
                  >
                    ← Anterior
                  </Button>

                  {!review.content.questions[currentIndex].answered && (
                    <Button
                      variant="primary"
                      onClick={handleValidate}
                      size="sm"
                    >
                      Validar
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    disabled={currentIndex === total - 1}
                    onClick={() => handleChangeQuestion(currentIndex + 1)}
                    size="sm"
                  >
                    Siguiente →
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
