import { Pagination } from "react-bootstrap";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ScrumPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlProps) {
  if (totalPages <= 1) return null;

  const getPaginationItems = () => {
    const items = [];

    // Siempre mostrar la primera página
    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        1
      </Pagination.Item>
    );

    // Puntos suspensivos si estamos lejos de la primera página
    if (currentPage > 4) {
      items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }

    // Páginas cercanas a la actual
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Puntos suspensivos antes de la última página si hace falta
    if (currentPage < totalPages - 3) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    }

    // Siempre mostrar la última página si hay más de 1
    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <Pagination className="justify-content-center">
      <Pagination.Prev
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {getPaginationItems()}
      <Pagination.Next
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </Pagination>
  );
}
