import { Button, Row, Col, Container } from "react-bootstrap";

import scrumImage from "../assets/images/scrum_home.png";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/login");
  };
  return (
    <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
      <Row className="align-items-center">
        {/* Text Section */}
        <Col md={6} className="text-center">
          <h3 className="display-4 mb-4">
            Prepara tu certificación Scrum Master
          </h3>
          <p className="lead text-muted mb-2">
            Realiza cuestionarios, simula exámenes cronometrados y domina Scrum
            a través del aprendizaje gamificado.
          </p>

          <div className="mt-4">
            <Button
              variant="primary"
              size="lg"
              className="me-2 btn-scrum"
              onClick={handleGetStarted}
            >
              Comenzar Ahora
            </Button>
          </div>
        </Col>

        <Col md={6} className="text-center mt-5 mt-md-0">
          <img
            src={scrumImage}
            alt="Scrum Master Certification"
            className="img-fluid"
          />
        </Col>
      </Row>
    </Container>
  );
}
