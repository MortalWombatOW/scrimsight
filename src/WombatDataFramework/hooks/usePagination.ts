import React, {useState} from 'react';
import {useDeepMemo} from '../../hooks/useDeepEffect';

interface Pagination<T> {
  pageData: T[];
  rowsPerPage: number;
  page: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  setPage: (page: number) => void;
}

const usePagination = <T>(data: T[]): Pagination<T> => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const pageData = useDeepMemo(() => data.slice(page * rowsPerPage, (page + 1) * rowsPerPage), [JSON.stringify(data), page, rowsPerPage]);

  return {pageData, rowsPerPage, page, setRowsPerPage, setPage};
};

export default usePagination;
