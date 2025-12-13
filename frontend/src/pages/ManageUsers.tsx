import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsers, deleteUser, updateUser } from "../services/user.service";
import { deleteReviewByUser } from "../services/review.service";
import { deleteAllExamsOfUser } from "../services/exam.service";
import { ScrumPagination } from "../components/ScrumPagination";
import { ConfirmModal } from "../components/ConfirmModal";

interface User {
  id: string;
  username: string;
  email: string;
  role: boolean;
}

interface PaginatedUsers {
  items: User[];
  total: number;
  page: string;
  limit: string;
}

export function ManageUsers() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 2;
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});

  const openConfirmModal = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirmAction(() => action);
    setShowConfirm(true);
  };

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data: PaginatedUsers = await getUsers(page, limit, token);
      setUsers(data.items);
      setTotal(Number(data.total));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, token]);

  const handleDelete = (userId: string) => {
    if (!token) return;

    openConfirmModal("¿Estás seguro de eliminar este usuario?", async () => {
      try {
        await deleteReviewByUser(userId, token);
        await deleteAllExamsOfUser(userId, token);
        await deleteUser(userId, token);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const toggleRole = (user: User) => {
    if (!token) return;

    openConfirmModal(
      `¿Estás seguro de cambiar el rol de ${user.username}?`,
      async () => {
        try {
          await updateUser(user.id, { isAdmin: !user.role }, token);
          fetchUsers();
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-3">
        <Col xs={12} md={10}>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h2>Administrar Usuarios</h2>
            <Button variant="primary" onClick={() => navigate("/home")}>
              Volver
            </Button>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {users.length === 0 && (
                <p className="text-center">No hay usuarios disponibles.</p>
              )}

              {users.map((user) => (
                <Card key={user.id} className="shadow-sm">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{user.username}</h5>
                      <p className="mb-1">{user.email}</p>
                      <Form.Check
                        type="switch"
                        id={`role-switch-${user.id}`}
                        label={user.role ? "Admin" : "User"}
                        checked={user.role}
                        onChange={() => toggleRole(user)}
                      />
                    </div>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash /> Eliminar
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          {/* Paginación */}
          <div className="d-flex justify-content-center mt-4">
            <ScrumPagination
              currentPage={page}
              totalPages={Math.ceil(total / limit)}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </Col>
      </Row>

      {/* Modal de confirmación */}
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
