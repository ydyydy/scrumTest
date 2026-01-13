import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getUsers,
  deleteManyUsers,
  updateUser,
} from "../services/user.service";
import { deleteManyReviewsByManyUser } from "../services/review.service";
import { deleteManyExamsByManyUser } from "../services/exam.service";
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});

  const openConfirmModal = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirmAction(() => action);
    setShowConfirm(true);
  };

  const loadUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data: PaginatedUsers = await getUsers(page, limit, token);
      setUsers(data.items);
      setTotal(Number(data.total));
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      alert("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, token]);

  const toggleRole = (user: User) => {
    if (!token) return;
    openConfirmModal(
      `¿Estás seguro de cambiar el rol de ${user.username}?`,
      async () => {
        try {
          await updateUser(user.id, { isAdmin: !user.role }, token);
          loadUsers();
        } catch (err) {
          console.error(err);
          alert("Error al cambiar el rol");
        }
      }
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (!token || selectedIds.length === 0) return;

    openConfirmModal(
      `¿Seguro que deseas borrar ${selectedIds.length} usuarios seleccionados?`,
      async () => {
        try {
          await deleteManyReviewsByManyUser(selectedIds, token);
          await deleteManyExamsByManyUser(selectedIds, token);
          await deleteManyUsers(selectedIds, token);
          loadUsers();
        } catch (err) {
          console.error(err);
          alert("Error al borrar los usuarios seleccionados");
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
          <h2>Administrar Usuarios</h2>
          <Button variant="primary" onClick={() => navigate("/home")}>
            Volver
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          {users.length === 0 && (
            <p className="text-center">No hay usuarios disponibles.</p>
          )}

          {users.map((user) => (
            <Card key={user.id} className="mb-3 shadow-sm">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div className="flex-grow-1">
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

                {/* Checkbox de selección al final */}
                <Form.Check
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => toggleSelect(user.id)}
                  className="ms-3"
                  title="Seleccionar usuario"
                />
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

      {/* Papelera flotante */}
      {selectedIds.length > 0 && (
        <Button
          variant="danger"
          className="position-fixed"
          style={{
            bottom: 20,
            right: 20,
            borderRadius: "50%",
            padding: "12px 15px",
          }}
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
