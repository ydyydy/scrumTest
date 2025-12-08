import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsers, deleteUser, updateUser } from "../services/user.service";
import { ScrumPagination } from "../components/ScrumPagination";
import { deleteReview } from "../services/review.service";
import { deleteQuestion } from "../services/question.service";
import { deleteExam } from "../services/exam.service";

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
  const [loading, setLoading] = useState(false);
  const limit = 2;

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data: PaginatedUsers = await getUsers(page, limit, token);
      setUsers(data.items);
      setTotal(Number(data.total));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, token]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    const confirmed = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmed) return;

    try {
      await deleteReview(id, token);
      await deleteExam(id, token);
      await deleteQuestion(id, token);
      await deleteUser(id, token);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleRole = async (user: User) => {
    if (!token) return;
    const confirmed = window.confirm(
      `¿Estás seguro de cambiar el rol de ${user.username}?`
    );
    if (!confirmed) return;

    try {
      await updateUser(user.id, { isAdmin: !user.role }, token);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-4 text-center">Administrar Usuarios</h2>

              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <Form.Check
                            type="switch"
                            id={`role-switch-${user.id}`}
                            label={user.role ? "Admin" : "User"}
                            checked={user.role}
                            onChange={() => toggleRole(user)}
                          />
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <div className="d-flex justify-content-between align-items-center mt-3">
                {/* Botón Volver al extremo izquierdo */}
                <Button variant="primary" onClick={() => navigate("/home")}>
                  Volver
                </Button>

                {/* Paginación al extremo derecho usando ScrumPagination */}
                <ScrumPagination
                  currentPage={page}
                  totalPages={Math.ceil(total / limit)}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
