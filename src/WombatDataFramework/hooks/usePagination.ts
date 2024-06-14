import React, {useMemo} from 'react';

interface Pagination<T> {
  pageData: T[];
  rowsPerPage: number;
  page: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  setPage: (page: number) => void;
}

const usePagination = <T>(data: T[]): Pagination<T> => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);

  const pageData = useMemo(() => data.slice(page * rowsPerPage, (page + 1) * rowsPerPage), [JSON.stringify(data), page, rowsPerPage]);

  return {pageData, rowsPerPage, page, setRowsPerPage, setPage};
};

export default usePagination;
