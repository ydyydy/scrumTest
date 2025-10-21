import React from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import scrumImage from "../assets/images/scrum_home.png";

export function Home() {
  return (
    <div className="d-flex flex-column min-vh-80">
      {/* MAIN CONTENT */}
      <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <Row className="align-items-center">
          {/* Text Section */}
          <Col md={6} className="text-center">
            <h3 className="display-4 mb-2">
              Prepara tu certificación Scrum Master
            </h3>
            <p className="lead text-muted mb-2">
              Realiza cuestionarios, simula exámenes cronometrados y domina
              Scrum a través del aprendizaje gamificado.
            </p>

            <div className="mt-4">
              <Button
                as={Link}
                to="/login"
                variant="primary"
                size="lg"
                className="me-2 btn-scrum"
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
    </div>
  );
}
