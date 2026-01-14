import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { getTopRanking } from "../services/exam.service";
import { RankingEntry } from "../utils/exam.dto";
import { FaMedal, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Ranking() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    async function loadRanking() {
      if (!token) {
        navigate("/login");
      }

      try {
        const data = await getTopRanking(token!);
        setRanking(data.top);
      } catch (err) {
        console.error(err);
        alert("Error cargando el ranking");
      } finally {
        setLoading(false);
      }
    }
    loadRanking();
  }, []);

  if (loading) {
    return <div className="text-center p-5">Cargando ranking…</div>;
  }

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <FaMedal color="#FFD700" className="me-2" />; // Oro
      case 1:
        return <FaMedal color="#C0C0C0" className="me-2" />; // Plata
      case 2:
        return <FaMedal color="#CD7F32" className="me-2" />; // Bronce
      default:
        return null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <FaTrophy size={50} color="#FFA500" />
        <h2 className="mt-2">TOP 20 Ranking</h2>
      </div>

      <Table
        striped
        bordered
        hover
        responsive
        className="shadow-sm text-center"
      >
        <thead>
          <tr>
            <th></th>
            <th>Usuario</th>
            <th>Nota(máx 100)</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((entry, index) => (
            <tr key={index}>
              <td>
                {getMedalIcon(index)}
                {index + 1}
              </td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
              <td>{formatTime(entry.duration)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="text-center mt-4">
        <Button variant="warning" size="lg" onClick={() => navigate("/home")}>
          Salir
        </Button>
      </div>
    </Container>
  );
}
