import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaBook, FaClipboardCheck, FaTrophy } from "react-icons/fa";

export function Games() {
  const navigate = useNavigate();

  const handleRepaso = () => navigate("/games/review");
  const handleExamen = () => navigate("/games/exam");
  const handleRanking = () => navigate("/games/ranking");

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        {/* Iniciar repaso */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="text-center shadow-lg hover-card custom-blue-card">
            <Card.Body>
              <div className="large-blue-title">
                <FaBook />
              </div>
              <Card.Title className="custom-blue-text">
                Iniciar repaso
              </Card.Title>
              <Card.Text>
                Practica con tus temas más importantes y mejora tu rendimiento.
              </Card.Text>
              <Button
                variant="primary"
                size="lg"
                onClick={handleRepaso}
                className="card-button-style"
              >
                Iniciar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Simulación de examen */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="text-center shadow-lg hover-card custom-green-card">
            <Card.Body>
              <div className="large-green-title">
                <FaClipboardCheck />
              </div>
              <Card.Title className="custom-green-text">
                Simulación de examen
              </Card.Title>
              <Card.Text>
                Pon a prueba tus conocimientos con un examen simulado.
              </Card.Text>
              <Button
                variant="success"
                size="lg"
                onClick={handleExamen}
                className="card-button-style"
              >
                Comenzar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Ranking */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="text-center shadow-lg hover-card custom-yellow-card">
            <Card.Body>
              <div className="large-yellow-title">
                <FaTrophy />
              </div>
              <Card.Title className="custom-yellow-text">Ranking</Card.Title>
              <Card.Text>
                Consulta los mejores jugadores y tu posición en la tabla.
              </Card.Text>
              <Button
                variant="warning"
                size="lg"
                onClick={handleRanking}
                className="card-button-style"
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
