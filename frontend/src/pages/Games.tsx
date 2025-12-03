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
          <Card
            className="text-center shadow-lg hover-card"
            style={{
              borderRadius: "15px",
              transition: "transform 0.2s, box-shadow 0.2s",
              border: "2px solid #007bff", // ← borde azul para repaso
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
                <FaBook />
              </div>
              <Card.Title style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                Iniciar repaso
              </Card.Title>
              <Card.Text>
                Practica con tus temas más importantes y mejora tu rendimiento.
              </Card.Text>
              <Button
                variant="primary"
                size="lg"
                onClick={handleRepaso}
                style={{ borderRadius: "10px", padding: "0.5rem 2rem" }}
              >
                Iniciar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Simulación de examen */}
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
                <FaClipboardCheck />
              </div>
              <Card.Title
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#28a745",
                }}
              >
                Simulación de examen
              </Card.Title>
              <Card.Text>
                Pon a prueba tus conocimientos con un examen simulado.
              </Card.Text>
              <Button
                variant="success"
                size="lg"
                onClick={handleExamen}
                style={{ borderRadius: "10px", padding: "0.5rem 2rem" }}
              >
                Comenzar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Ranking */}
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
                <FaTrophy />
              </div>
              <Card.Title
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#ffc107",
                }}
              >
                Ranking
              </Card.Title>
              <Card.Text>
                Consulta los mejores jugadores y tu posición en la tabla.
              </Card.Text>
              <Button
                variant="warning"
                size="lg"
                onClick={handleRanking}
                style={{ borderRadius: "10px", padding: "0.5rem 2rem" }}
              >
                Ver Ranking
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
