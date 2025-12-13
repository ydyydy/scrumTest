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
import { ConfirmModal } from "../components/ConfirmModal";

export function Review() {
  const navigate = useNavigate();
  const { user, loading: authLoading, token } = useAuth();

  const [review, setReview] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionData, setQuestionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      navigate("/login");
      return;
    }

    async function loadReview() {
      try {
        let reviewData = await getReviewByUser(user!.sub.value, token!);
        if (!reviewData) {
          reviewData = await createReview(user!.sub.value, token!);
        }
        setReview(reviewData);

        const firstQuestionId = reviewData.content.questions[0].questionId;
        const question = await getQuestion(firstQuestionId, token!);

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

  // Cambiar pregunta
  const handleChangeQuestion = async (newIndex: number) => {
    setCurrentIndex(newIndex);
    const questionId = review.content.questions[newIndex].questionId;
    const questionRaw = await getQuestion(questionId, token!);

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

  // Seleccionar respuesta
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

  // Validar pregunta
  const handleValidate = async () => {
    if (!review) return;
    const q = review.content.questions[currentIndex];
    const selected = q.userAnswerIds;

    if (!selected || selected.length === 0) {
      alert("Selecciona al menos una respuesta.");
      return;
    }

    try {
      const result = await answerQuestion(
        review.id.value,
        { questionId: q.questionId, userAnswerIds: selected },
        token!
      );

      const updated = { ...review };
      updated.content.questions[currentIndex].isCorrect = result.isCorrect;
      updated.content.questions[currentIndex].answered = true;

      setReview(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Salir
  const handleGoBack = () => navigate("/home");

  // Abrir modal para reiniciar
  const handleReset = () => setShowConfirm(true);

  const handleConfirmReset = async () => {
    setShowConfirm(false);
    try {
      await resetReview(review.id.value, token!);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al reiniciar el review");
    }
  };

  const handleCancelReset = () => setShowConfirm(false);

  // UI
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
          <Card className="p-3 shadow-sm d-flex flex-column justify-content-between exam-sidebar">
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
                  const isAnswered = q.answered;
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
          <Card className="shadow-sm p-3 position-relative exam-card">
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
                      checked={review.content.questions[
                        currentIndex
                      ].userAnswerIds?.includes(ans.id)}
                      onChange={() => handleAnswerSelect(ans.id)}
                      disabled={review.content.questions[currentIndex].answered}
                    />
                  </div>
                ))}
              </Form>

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

      {/* Modal de confirmación */}
      <ConfirmModal
        show={showConfirm}
        title="Reiniciar test"
        message="¿Seguro que quieres reiniciar el test? Se perderán todas tus respuestas."
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </Container>
  );
}
