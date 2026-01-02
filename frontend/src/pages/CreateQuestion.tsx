import { Container, Row, Col, Card, Form, Button, FloatingLabel, Tabs, Tab, Collapse } from "react-bootstrap";
import { useState } from "react";
import { createQuestion, bulkCreateQuestions } from "../services/question.service";
import { MessageBox } from "../components/MessageBox";
import { QuestionCategory } from "../../../backend/common/utils/enum";
import { FaTrash, FaPlus, FaInfoCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface AnswerInput {
  text: string;
  isCorrect?: boolean;
}

export function CreateQuestion() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<QuestionCategory | "">("");
  const [questionType, setQuestionType] = useState<"single" | "multiple">("single");
  const [answers, setAnswers] = useState<AnswerInput[]>([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manual");
  const [showInfo, setShowInfo] = useState(false); // <-- Estado para info

  // --- Manejo de respuestas ---
  const handleAnswerChange = (index: number, field: "text" | "isCorrect", value: string | boolean) => {
    const newAnswers = [...answers];
    if (field === "text") newAnswers[index].text = value as string;
    else {
      if (questionType === "single" && value) {
        newAnswers.forEach((a, i) => { if (i !== index) a.isCorrect = false; });
      }
      newAnswers[index].isCorrect = value as boolean;
    }
    setAnswers(newAnswers);
  };

  const addAnswer = () => {
    if (answers.length < 4) setAnswers([...answers, { text: "", isCorrect: false }]);
  };
  const removeAnswer = (index: number) => setAnswers(answers.filter((_, i) => i !== index));
  const handleCancel = () => navigate("/home");

  // --- Submit manual ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!text.trim()) { setMessage("La pregunta no puede estar vacía"); setSuccess(false); setLoading(false); return; }
    if (!category) { setMessage("Debes seleccionar una categoría"); setSuccess(false); setLoading(false); return; }
    if (answers.length !== 4 || answers.some(a => !a.text.trim())) { setMessage("Debes completar exactamente 4 respuestas"); setSuccess(false); setLoading(false); return; }

    try {
      await createQuestion({ text, category: category.toString(), questionType, answers }, token!);
      setMessage("Pregunta creada correctamente");
      setSuccess(true);
      setText(""); setCategory(""); setQuestionType("single"); setAnswers([]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error al crear la pregunta");
      setSuccess(false);
    } finally { setLoading(false); }
  };

  // --- Import JSON ---
  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setLoading(true);
    setMessage("");

    try {
      const text = await file.text();
      const questions: {
        text: string;
        category: string;
        questionType: "single" | "multiple";
        answers: { text: string; isCorrect: boolean }[];
      }[] = JSON.parse(text);

      if (!Array.isArray(questions)) throw new Error("El JSON debe ser un array de preguntas");

      await bulkCreateQuestions(questions, token);

      setMessage(`Se han importado ${questions.length} preguntas correctamente`);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setMessage(err instanceof Error ? err.message : "Error al importar preguntas");
      setSuccess(false);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm" bg="light" style={{ position: "relative" }}>
            {/* Botón de salir */}
            <Button
              variant="warning"
              onClick={handleCancel}
              style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}
            >
              Salir
            </Button>

            <Card.Body style={{ paddingTop: "50px" }}>
              {message && <MessageBox key={errorCount} message={message} success={success} duration={5000} />}

              <h2 className="text-center mb-4">Creación de Preguntas</h2>

              {/* Tabs para importar / manual */}
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || "manual")} className="mb-3">
                <Tab eventKey="import" title="Importar JSON">
                  <div className="d-flex align-items-center mb-2">
                    <Button
                      variant="link"
                      onClick={() => setShowInfo(!showInfo)}
                      className="p-0 d-flex align-items-center"
                    >
                      <FaInfoCircle className="me-1" /> Estructura esperada
                    </Button>
                  </div>

                  <Collapse in={showInfo}>
                    <div className="p-3 mb-3 border rounded bg-light">
                      <strong>Formato esperado:</strong> un array de preguntas con sus respuestas.
                      <pre style={{ fontSize: "0.85rem", marginTop: "5px" }}>
{`[
  {
    "text": "¿Qué se define en la reunión de Planificación del Sprint?",
    "category": "4",
    "questionType": "single",
    "answers": [
      { "text": "El objetivo y trabajo del Sprint", "isCorrect": true },
      { "text": "Las vacaciones del equipo", "isCorrect": false },
      { "text": "El presupuesto del proyecto", "isCorrect": false },
      { "text": "La estrategia de la empresa", "isCorrect": false }
    ]
  },
  {
    "text": "Selecciona los valores de Scrum",
    "category": "1",
    "questionType": "multiple",
    "answers": [
      { "text": "Compromiso", "isCorrect": true },
      { "text": "Valentía", "isCorrect": true },
      { "text": "Puntualidad", "isCorrect": false },
      { "text": "Transparencia", "isCorrect": true }
    ]
  }
]`}
                      </pre>
                    </div>
                  </Collapse>

                  <Form.Group className="mb-4">
                    <Form.Label>Selecciona archivo JSON a importar</Form.Label>
                    <Form.Control type="file" accept=".json" onChange={handleImportJSON} />
                  </Form.Group>
                </Tab>

                <Tab eventKey="manual" title="Crear Pregunta">
                  <Form onSubmit={handleSubmit}>
                    <FloatingLabel label="Texto de la pregunta" className="mb-3">
                      <Form.Control type="text" value={text} onChange={e => setText(e.target.value)} required />
                    </FloatingLabel>

                    <Row className="mb-4">
                      <Col xs={12} md={6}>
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select value={category} onChange={e => setCategory(Number(e.target.value) as QuestionCategory)} required>
                          <option value="">Selecciona una categoría</option>
                          {Object.entries(QuestionCategory).filter(([_, val]) => typeof val === "number").map(([name, val]) => (
                            <option key={val} value={val}>{name.replace(/_/g, " ")}</option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Label>Tipo de pregunta</Form.Label>
                        <Form.Select value={questionType} onChange={e => setQuestionType(e.target.value as "single" | "multiple")} required>
                          <option value="single">Única respuesta</option>
                          <option value="multiple">Múltiple respuesta</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    <Form.Label>Respuestas</Form.Label>
                    {answers.map((a, i) => (
                      <div key={i} className="d-flex align-items-center mb-2">
                        <Form.Control
                          type="text"
                          placeholder={`Respuesta ${i + 1}`}
                          value={a.text}
                          onChange={e => handleAnswerChange(i, "text", e.target.value)}
                          className="me-2"
                          required
                        />
                        <Form.Check
                          type="checkbox"
                          label="Correcta"
                          checked={a.isCorrect}
                          onChange={e => handleAnswerChange(i, "isCorrect", e.target.checked)}
                          className="me-2"
                        />
                        <Button variant="outline-danger" size="sm" onClick={() => removeAnswer(i)}>
                          <FaTrash />
                        </Button>
                      </div>
                    ))}

                    {/* Botón + Añadir respuesta debajo */}
                    <div className="mt-2">
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

                    <div className="d-grid gap-2 mt-4">
                      <button type="submit" className="btn btn-primary">Guardar Pregunta</button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>

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
