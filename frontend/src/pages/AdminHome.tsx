import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaClipboardList, FaUsers } from "react-icons/fa";

export function AdminHome() {
  const navigate = useNavigate();

  const handleCreateQuestion = () => navigate("/create-question");
  const handleManageQuestions = () => navigate("/manage-questions");
  const handleManageUsers = () => navigate("/manage-users");

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        {/* Crear Pregunta */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card
            className="text-center shadow-lg hover-card"
            style={{
              borderRadius: "15px",
              transition: "transform 0.2s, box-shadow 0.2s",
              border: "2px solid #007bff",
            }}
          >
            <Card.Body>
              <div
                style={{
                  fontSize: "3rem",
                  color: "#007bff",
                  marginBottom: "10px",
                }}
              >
                <FaPlusCircle />
              </div>
              <Card.Title style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                Crear Pregunta
              </Card.Title>
              <Card.Text>
                Accede al formulario para añadir nuevas preguntas al sistema.
              </Card.Text>
              <Button
                variant="primary"
                size="lg"
                onClick={handleCreateQuestion}
                style={{ borderRadius: "10px", padding: "0.5rem 2rem" }}
              >
                Ir a Crear
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Administrar Preguntas */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card
            className="text-center shadow-lg hover-card"
            style={{
              borderRadius: "15px",
              transition: "transform 0.2s, box-shadow 0.2s",
              border: "2px solid #28a745",
            }}
          >
            <Card.Body>
              <div
                style={{
                  fontSize: "3rem",
                  color: "#28a745",
                  marginBottom: "10px",
                }}
              >
                <FaClipboardList />
              </div>
              <Card.Title
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#28a745",
                }}
              >
                Administrar Preguntas
              </Card.Title>
              <Card.Text>
                Edita o elimina preguntas existentes y revisa sus estadísticas.
              </Card.Text>
              <Button
                variant="success"
                size="lg"
                onClick={handleManageQuestions}
                style={{ borderRadius: "10px", padding: "0.5rem 2rem" }}
              >
                Ir a Administrar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Administrar Usuarios */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card
            className="text-center shadow-lg hover-card"
            style={{
              borderRadius: "15px",
              transition: "transform 0.2s, box-shadow 0.2s",
              border: "2px solid #ffc107",
            }}
          >
            <Card.Body>
              <div
                style={{
                  fontSize: "3rem",
                  color: "#ffc107",
                  marginBottom: "10px",
                }}
              >
                <FaUsers />
              </div>
              <Card.Title
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#ffc107",
                }}
              >
                Administrar Usuarios
              </Card.Title>
              <Card.Text>
                Gestiona usuarios, roles y controla el acceso al sistema.
              </Card.Text>
              <Button
                variant="warning"
                size="lg"
                onClick={handleManageUsers}
                style={{ borderRadius: "10px", padding: "0.5rem 2rem" }}
              >
                Ir a Usuarios
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>
        {`
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          }
        `}
      </style>
    </Container>
  );
}
