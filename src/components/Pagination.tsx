import {
  ChevronFirst,
  ChevronLeft,
  ChevronLast,
  ChevronRight,
} from "lucide-react";
import { useDogStore } from "../stores/dog.ts";
import { getPaginationPages } from "../services/utils.ts";

const CONTROLS_LIMIT = 5;

const Pagination = () => {
  const updatePage = useDogStore((state) => state.updatePage);
  const page = useDogStore((state) => state.page);
  const totalPages = useDogStore((state) => state.totalPages);

  if (totalPages <= 1) return null;

  const pages = getPaginationPages({
    page,
    totalPages,
    limit: CONTROLS_LIMIT,
  });

  const handlePageChange = (page: number) => () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    updatePage(page);
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="join">
        <button
          className="join-item btn btn-sm"
          onClick={handlePageChange(1)}
          disabled={page === 1}
        >
          <ChevronFirst />
        </button>
        <button
          className="join-item btn btn-sm"
          onClick={handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ChevronLeft />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`join-item btn btn-sm ${p === page ? "btn-active" : ""}`}
            onClick={handlePageChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="join-item btn btn-sm"
          onClick={handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          <ChevronRight />
        </button>
        <button
          className="join-item btn btn-sm"
          onClick={handlePageChange(totalPages)}
          disabled={page === totalPages}
        >
          <ChevronLast />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
