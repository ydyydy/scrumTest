import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  FloatingLabel,
} from "react-bootstrap";
import { useState } from "react";
import { createQuestion } from "../services/question.service";
import { MessageBox } from "../components/MessageBox";
import { QuestionCategory } from "../../../backend/common/utils/enum";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

interface AnswerInput {
  text: string;
  isCorrect?: boolean;
}

export function CreateQuestion() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<QuestionCategory | "">("");
  const [questionType, setQuestionType] = useState<"single" | "multiple">(
    "single"
  );
  const [answers, setAnswers] = useState<AnswerInput[]>([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const { token } = useAuth();

  // Cambiar valor de texto o isCorrect
  const handleAnswerChange = (
    index: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    const newAnswers = [...answers];
    if (field === "text") {
      newAnswers[index].text = value as string;
    } else {
      // Si es single, solo puede haber una correcta
      if (questionType === "single" && value) {
        newAnswers.forEach((a, i) => {
          if (i !== index) a.isCorrect = false;
        });
      }
      newAnswers[index].isCorrect = value as boolean;
    }
    setAnswers(newAnswers);
  };

  // Agregar nueva respuesta
  const addAnswer = () => {
    if (answers.length >= 4) return;
    setAnswers([...answers, { text: "", isCorrect: false }]);
  };

  // Eliminar respuesta
  const removeAnswer = (index: number) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones
    if (!text.trim()) {
      setMessage("La pregunta no puede estar vacía");
      setSuccess(false);
      setErrorCount((prev) => prev + 1);
      setLoading(false);
      return;
    }
    if (!category) {
      setMessage("Debes seleccionar una categoría");
      setSuccess(false);
      setErrorCount((prev) => prev + 1);
      setLoading(false);
      return;
    }
    if (answers.length !== 4 || answers.some((a) => !a.text.trim())) {
      setMessage("Debes completar exactamente 4 respuestas");
      setSuccess(false);
      setErrorCount((prev) => prev + 1);
      setLoading(false);
      return;
    }

    try {
      await createQuestion(
        {
          text,
          category: category.toString(),
          questionType,
          answers,
        },
        token!
      );

      setMessage("Pregunta creada correctamente");
      setSuccess(true);

      // Limpiar formulario
      setText("");
      setCategory("");
      setQuestionType("single");
      setAnswers([]);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Error al crear la pregunta"
      );
      setSuccess(false);
      setErrorCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm" bg="light">
            <Card.Body>
              {message && (
                <MessageBox
                  key={errorCount}
                  message={message}
                  success={success}
                  duration={3000}
                />
              )}

              <h2 className="text-center mb-4">Crear Pregunta</h2>
              <Form onSubmit={handleSubmit}>
                {/* Pregunta */}
                <FloatingLabel label="Texto de la pregunta" className="mb-3">
                  <Form.Control
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                </FloatingLabel>

                {/* Categoría y Tipo de pregunta en la misma fila */}
                <Row className="mb-4">
                  <Col xs={12} md={6}>
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) =>
                        setCategory(Number(e.target.value) as QuestionCategory)
                      }
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {Object.entries(QuestionCategory)
                        .filter(([_, val]) => typeof val === "number")
                        .map(([name, val]) => (
                          <option key={val} value={val}>
                            {name.replace(/_/g, " ")}
                          </option>
                        ))}
                    </Form.Select>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Label>Tipo de pregunta</Form.Label>
                    <Form.Select
                      value={questionType}
                      onChange={(e) =>
                        setQuestionType(e.target.value as "single" | "multiple")
                      }
                      required
                    >
                      <option value="single">Única respuesta</option>
                      <option value="multiple">Múltiple respuesta</option>
                    </Form.Select>
                  </Col>
                </Row>

                {/* Respuestas */}
                <Form.Label>Respuestas</Form.Label>
                {answers.map((a, i) => (
                  <div key={i} className="d-flex align-items-center mb-2">
                    <Form.Control
                      type="text"
                      placeholder={`Respuesta ${i + 1}`}
                      value={a.text}
                      onChange={(e) =>
                        handleAnswerChange(i, "text", e.target.value)
                      }
                      className="me-2"
                      required
                    />
                    <Form.Check
                      type="checkbox"
                      label="Correcta"
                      checked={a.isCorrect}
                      onChange={(e) =>
                        handleAnswerChange(i, "isCorrect", e.target.checked)
                      }
                      className="me-2"
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeAnswer(i)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                ))}

                {/* Botón + para añadir respuesta */}
                <div className="mb-4">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={addAnswer}
                    disabled={answers.length >= 4}
                  >
                    <FaPlus className="me-1" />
                    Añadir respuesta
                  </Button>
                </div>

                <div className="d-grid gap-2">
                  <Button type="submit" className="btn-scrum">
                    Crear Pregunta
                  </Button>
                </div>
              </Form>

              {loading && (
                <div className="d-flex justify-content-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
