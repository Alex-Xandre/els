/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/stores/AuthContext';

// Define the TableProps interface
interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
  }[];
  caption?: string; // Optional table caption
  onEdit?: (row: T) => void; // Optional edit button handler
  onView?: (row: T) => void;
  title?: string; // Optional title for the table
  tableHeader: ReactNode;
}

const ReusableTable = <T,>({
  data,
  columns,
  caption,
  onEdit,
  onView,
  title,
  tableHeader,
}: TableProps<T>): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // Fixed page size (12 rows per page)

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / pageSize);

  // Calculate the rows to display for the current page
  const currentRows = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Function to handle page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const { user } = useAuth();
  return (
    <div className='overflow-hidden w-full'>
      {tableHeader}
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
            {onEdit && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onEdit ? 1 : 0)}
                className='text-center'
              >
                No Data Found
              </TableCell>
            </TableRow>
          ) : (
            currentRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, columnIndex) => {
                  return (
                    <TableCell
                      key={columnIndex}
                      className={`
                        ${
                          (((row as any)?.profile && column.accessor === 'name') || column.accessor === 'status') &&
                          'inline-flex items-center gap-x-3 !mt-3'
                        }

                           ${
                             (((row as any)?.profile && column.accessor === 'name') || column.accessor === 'status') &&
                             title === 'Users' &&
                             'inline-flex items-center gap-x-3 !mt-0'
                           }
                      `}
                    >
                      {(row as any)?.status === 'Online' && column.accessor === 'status' ? (
                        <p className='h-2 w-2 rounded-full bg-green-500' />
                      ) : (row as any)?.status === 'Offline' && column.accessor === 'status' ? (
                        <p className='h-2 w-2 rounded-full bg-red-500' />
                      ) : (
                        ''
                      )}
                      {(row as any)?.profile && column.accessor === 'name' && (
                        <span>
                          <img
                            src={(row as any)?.profile}
                            className='h-5 w-5 rounded-full'
                          />
                        </span>
                      )}
                      {column.render
                        ? column.render(row[column.accessor], row)
                        : (row[column.accessor] as React.ReactNode)}
                    </TableCell>
                  );
                })}
                {onEdit && (
                  <TableCell>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => onEdit(row)}
                        className='text-green-500 mr-5'
                      >
                        View
                      </button>
                    )}

                    {/* {onView && (
                      <button
                        onClick={() => onView(row)}
                        className=' mr-5'
                      >
                        View
                      </button>
                    )} */}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex justify-between items-center mt-4'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-4 py-1 bg-gray-300 text-gray-700 rounded-md'
          >
            Previous
          </button>

          <span className='text-gray-700'>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-4 py-1 bg-gray-300 text-gray-700 rounded-md'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReusableTable;
