type PaginationUtilParams = {
  page: number;
  totalPages: number;
  limit: number;
};

export const getPaginationPages = ({
  page,
  totalPages,
  limit,
}: PaginationUtilParams) => {
  const visiblePages = [];

  if (totalPages <= limit) {
    for (let i = 1; i <= totalPages; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  }

  let startPage = Math.max(1, page - Math.floor(limit / 2));
  let endPage = Math.min(totalPages, page + Math.floor(limit / 2));

  if (endPage - startPage + 1 < limit) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + limit - 1);
    } else {
      startPage = Math.max(1, endPage - limit + 1);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return visiblePages;
};
