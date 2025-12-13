import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaPlusCircle,
  FaClipboardList,
  FaUsers,
  FaTrophy,
} from "react-icons/fa";

export function AdminHome() {
  const navigate = useNavigate();

  const handleCreateQuestion = () => navigate("/create-question");
  const handleManageQuestions = () => navigate("/manage-questions");
  const handleManageUsers = () => navigate("/manage-users");
  const handleRanking = () => navigate("/games/ranking");

  return (
    <Container className="py-4 global-background">
      <Row className="justify-content-center g-4">
        {/* Crear Pregunta */}
        <Col xs={12} sm={6} md={4} lg={3}>
          <Card className="text-center shadow-lg hover-card custom-blue-card equal-card">
            <Card.Body className="d-flex flex-column justify-content-between h-100">
              <div>
                <div className="large-blue-title">
                  <FaPlusCircle />
                </div>
                <Card.Title className="custom-blue-text">
                  Crear Pregunta
                </Card.Title>
                <Card.Text>
                  Accede al formulario para añadir nuevas preguntas al sistema.
                </Card.Text>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleCreateQuestion}
                className="card-button-style mt-2"
              >
                Ir a Crear
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Administrar Preguntas */}
        <Col xs={12} sm={6} md={4} lg={3}>
          <Card className="text-center shadow-lg hover-card custom-green-card equal-card">
            <Card.Body className="d-flex flex-column justify-content-between h-100">
              <div>
                <div className="large-green-title">
                  <FaClipboardList />
                </div>
                <Card.Title className="custom-green-text">
                  Administrar Preguntas
                </Card.Title>
                <Card.Text>
                  Edita o elimina preguntas existentes y revisa sus
                  estadísticas.
                </Card.Text>
              </div>
              <Button
                variant="success"
                size="lg"
                onClick={handleManageQuestions}
                className="card-button-style mt-2"
              >
                Ir a Administrar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Administrar Usuarios */}
        <Col xs={12} sm={6} md={4} lg={3}>
          <Card className="text-center shadow-lg hover-card custom-orange-card equal-card">
            <Card.Body className="d-flex flex-column justify-content-between h-100">
              <div>
                <div className="large-orange-title">
                  <FaUsers />
                </div>
                <Card.Title className="custom-orange-text">
                  Administrar Usuarios
                </Card.Title>
                <Card.Text>
                  Gestiona usuarios, roles y controla el acceso al sistema.
                </Card.Text>
              </div>
              <Button
                variant="danger"
                size="lg"
                onClick={handleManageUsers}
                className="card-button-style mt-2"
              >
                Ir a Usuarios
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Ranking */}
        <Col xs={12} sm={6} md={4} lg={3}>
          <Card className="text-center shadow-lg hover-card custom-yellow-card equal-card">
            <Card.Body className="d-flex flex-column justify-content-between h-100">
              <div>
                <div className="large-yellow-title">
                  <FaTrophy />
                </div>
                <Card.Title className="custom-yellow-text">Ranking</Card.Title>
                <Card.Text>
                  Consulta los mejores jugadores y tu posición en la tabla.
                </Card.Text>
              </div>
              <Button
                variant="warning"
                size="lg"
                onClick={handleRanking}
                className="card-button-style mt-2"
              >
                Ver Ranking
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
