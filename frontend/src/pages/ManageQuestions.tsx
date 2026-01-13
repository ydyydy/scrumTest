import { Container, Row, Col, Card, Button, ListGroup, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { getQuestions, deleteManyQuestions } from "../services/question.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ScrumPagination } from "../components/ScrumPagination";
import { ConfirmModal } from "../components/ConfirmModal";

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  category: string;
  answers: Answer[];
}

export function ManageQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const { token } = useAuth();
  const navigate = useNavigate();

  // Modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});

  const openConfirmModal = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirmAction(() => action);
    setShowConfirm(true);
  };

  const loadQuestions = async () => {
    if (!token) return;
    try {
      const data = await getQuestions(page, limit, token);
      setQuestions(data.items);
      setTotal(data.total);

      const initialExpanded: { [id: string]: boolean } = {};
      data.items.forEach((q: Question) => (initialExpanded[q.id] = false));
      setExpanded(initialExpanded);
      setSelectedIds([]); // reset selección al recargar
    } catch (err) {
      console.error(err);
      alert("Error cargando preguntas");
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [page, token]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (!token || selectedIds.length === 0) return;

    openConfirmModal(
      `¿Seguro que deseas borrar ${selectedIds.length} preguntas seleccionadas?`,
      async () => {
        try {
          await deleteManyQuestions(selectedIds, token);
          await loadQuestions();
        } catch (err) {
          console.error(err);
          alert("Error al borrar las preguntas seleccionadas");
        }
      }
    );
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Container className="py-5 position-relative">
      <Row className="justify-content-center mb-3">
        <Col
          xs={12}
          md={10}
          className="d-flex justify-content-between align-items-center"
        >
          <h2>Administrar Preguntas</h2>
          <Button variant="primary" onClick={() => navigate("/home")}>
            Volver
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          {questions.length === 0 && (
            <p className="text-center">No hay preguntas disponibles.</p>
          )}

          {questions.map((q) => (
            <Card key={q.id} className="mb-3 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  {/* Checkbox de selección */}
                  <Form.Check
                    type="checkbox"
                    checked={selectedIds.includes(q.id)}
                    onChange={() => toggleSelect(q.id)}
                    className="me-3"
                  />

                  <div className="flex-grow-1">{q.text}</div>

                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => toggleExpand(q.id)}
                  >
                    {expanded[q.id] ? <FaChevronUp /> : <FaChevronDown />}
                  </Button>
                </div>

                {expanded[q.id] && (
                  <ListGroup className="mt-3">
                    {q.answers.map((ans) => (
                      <ListGroup.Item key={ans.id}>
                        {ans.text}{" "}
                        {ans.isCorrect && (
                          <span className="text-success fw-bold">(Correcta)</span>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          ))}

          <div className="mt-4">
            <ScrumPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </Col>
      </Row>

      {/* Botón flotante de papelera */}
      {selectedIds.length > 0 && (
        <Button
          variant="danger"
          className="position-fixed"
          style={{ bottom: 20, right: 20, borderRadius: "50%", padding: "12px 15px" }}
          onClick={handleDeleteSelected}
          title={`Borrar ${selectedIds.length} seleccionadas`}
        >
          <FaTrash size={20} />
        </Button>
      )}

      <ConfirmModal
        show={showConfirm}
        title="Confirmación"
        message={confirmMessage}
        onConfirm={() => {
          setShowConfirm(false);
          onConfirmAction();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </Container>
  );
}
