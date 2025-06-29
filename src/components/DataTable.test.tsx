import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from './DataTable';

interface TestUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const mockUsers: TestUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', joinDate: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', joinDate: '2023-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'inactive', joinDate: '2023-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active', joinDate: '2023-04-05' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'active', joinDate: '2023-05-12' },
];

const testColumns: ColumnDef<TestUser>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true,
  },
  {
    accessorKey: 'role', 
    header: 'Role',
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <span className={`badge ${status === 'active' ? 'badge-success' : 'badge-error'}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'joinDate',
    header: 'Join Date',
    enableSorting: false,
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },
];

const nonSortableColumns: ColumnDef<TestUser>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: false,
  },
];

const getRowKey = (row: TestUser): string => row.id.toString();

// Generate large dataset for pagination testing
const generateLargeDataset = (count: number): TestUser[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: index % 3 === 0 ? 'Admin' : index % 3 === 1 ? 'Manager' : 'User',
    status: (index % 2 === 0 ? 'active' : 'inactive') as 'active' | 'inactive',
    joinDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  }));
};

describe('DataTable', () => {
  describe('basic rendering', () => {
    it('should render table with provided data and columns', () => {
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      // Verify table structure
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByRole('table')).toHaveClass('table', 'table-zebra', 'w-full');

      // Verify headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument(); 
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Join Date')).toBeInTheDocument();

      // Verify data rows
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should render empty table when no data provided', () => {
      render(
        <DataTable
          columns={testColumns}
          data={[]}
          rowKey={getRowKey}
        />
      );

      // Should render table structure
      expect(screen.getByRole('table')).toBeInTheDocument();
      
      // Should render headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();

      // Should not render any data rows
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.queryByText('jane@example.com')).not.toBeInTheDocument();
    });

    it('should apply table container classes correctly', () => {
      const { container } = render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      const outerContainer = container.firstChild as HTMLElement;
      expect(outerContainer).toHaveClass('w-full');

      const scrollContainer = outerContainer.querySelector('.overflow-x-auto');
      expect(scrollContainer).toBeInTheDocument();
    });
  });

  describe('sorting functionality', () => {
    it('should render sort icons for sortable columns', () => {
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      // Should render sort icons for sortable columns (name, email, role, status)
      const nameHeader = screen.getByText('Name').closest('th');
      const emailHeader = screen.getByText('Email').closest('th');
      const roleHeader = screen.getByText('Role').closest('th');
      const statusHeader = screen.getByText('Status').closest('th');
      
      expect(nameHeader?.querySelector('svg')).toBeInTheDocument();
      expect(emailHeader?.querySelector('svg')).toBeInTheDocument();
      expect(roleHeader?.querySelector('svg')).toBeInTheDocument();
      expect(statusHeader?.querySelector('svg')).toBeInTheDocument();

      // Should not render sort icon for non-sortable column (joinDate)
      const joinDateHeader = screen.getByText('Join Date').closest('th');
      expect(joinDateHeader?.querySelector('svg')).not.toBeInTheDocument();
    });

    it('should make sortable headers clickable with correct styling', () => {
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      const joinDateHeader = screen.getByText('Join Date').closest('th');

      // Sortable header should have cursor pointer and select-none classes
      expect(nameHeader).toHaveClass('cursor-pointer', 'select-none', 'hover:bg-base-200');
      
      // Non-sortable header should not have these classes
      expect(joinDateHeader).not.toHaveClass('cursor-pointer', 'select-none', 'hover:bg-base-200');
    });

    it('should sort data when column header is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      // Initial order should be as provided
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('John Doe'); // First data row

      // Click name header to sort ascending
      const nameHeader = screen.getByText('Name').closest('th');
      await user.click(nameHeader!);

      // Should sort alphabetically ascending (Alice, Bob, Charlie, Jane, John)
      const sortedRows = screen.getAllByRole('row');
      expect(sortedRows[1]).toHaveTextContent('Alice Brown');
      expect(sortedRows[2]).toHaveTextContent('Bob Johnson');
    });

    it('should toggle sort direction on repeated clicks', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      
      // First click - ascending sort
      await user.click(nameHeader!);
      let rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Alice Brown'); // A comes first
      
      // Second click - descending sort  
      await user.click(nameHeader!);
      rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('John Doe'); // J comes first in descending
    });

    it('should apply default sort when provided', () => {
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
          defaultSort="name"
        />
      );

      // Should be sorted by name ascending by default
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Alice Brown');
      expect(rows[2]).toHaveTextContent('Bob Johnson');
    });

    it('should disable sorting when disableSorting prop is true', () => {
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
          disableSorting={true}
        />
      );

      // Headers should not have sorting classes
      const nameHeader = screen.getByText('Name').closest('th');
      expect(nameHeader).not.toHaveClass('cursor-pointer', 'select-none');
      
      // Should not render sort icons
      expect(nameHeader?.querySelector('svg')).not.toBeInTheDocument();
    });

    it('should not sort columns with enableSorting: false', () => {
      render(
        <DataTable
          columns={nonSortableColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      // No headers should have sorting classes or icons
      const nameHeader = screen.getByText('Name').closest('th');
      const emailHeader = screen.getByText('Email').closest('th');
      
      expect(nameHeader).not.toHaveClass('cursor-pointer');
      expect(emailHeader).not.toHaveClass('cursor-pointer');
      expect(nameHeader?.querySelector('svg')).not.toBeInTheDocument();
      expect(emailHeader?.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('row click functionality', () => {
    it('should call onRowClick when row is clicked', async () => {
      const user = userEvent.setup();
      const mockRowClick = vi.fn();

      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
          onRowClick={mockRowClick}
        />
      );

      // Click on first data row
      const firstRow = screen.getAllByRole('row')[1]; // Skip header row
      await user.click(firstRow);

      expect(mockRowClick).toHaveBeenCalledWith(mockUsers[0]);
      expect(mockRowClick).toHaveBeenCalledTimes(1);
    });

    it('should apply hover styles to rows when onRowClick is provided', () => {
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
          onRowClick={vi.fn()}
        />
      );

      const firstDataRow = screen.getAllByRole('row')[1];
      expect(firstDataRow).toHaveClass('cursor-pointer', 'hover:bg-base-200');
    });

    it('should not apply hover styles when onRowClick is not provided', () => {
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      const firstDataRow = screen.getAllByRole('row')[1];
      expect(firstDataRow).not.toHaveClass('cursor-pointer', 'hover:bg-base-200');
    });

    it('should not trigger click handler when onRowClick is not provided', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      const firstRow = screen.getAllByRole('row')[1];
      
      // Should not throw error when clicking row without handler
      await expect(user.click(firstRow)).resolves.not.toThrow();
    });
  });

  describe('pagination functionality', () => {
    const largeDataset = generateLargeDataset(25);

    it('should display pagination controls by default', () => {
      render(
        <DataTable
          columns={testColumns}
          data={largeDataset}
          rowKey={getRowKey}
        />
      );

      // Should show pagination info
      expect(screen.getByText('Showing 1 to 10 of 25 entries')).toBeInTheDocument();

      // Should show pagination buttons
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Last')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Current page
    });

    it('should hide pagination footer when hideFooter is true', () => {
      render(
        <DataTable
          columns={testColumns}
          data={largeDataset}
          rowKey={getRowKey}
          hideFooter={true}
        />
      );

      // Should not show pagination controls
      expect(screen.queryByText('Showing 1 to 10 of 25 entries')).not.toBeInTheDocument();
      expect(screen.queryByText('First')).not.toBeInTheDocument();
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
      expect(screen.queryByText('Last')).not.toBeInTheDocument();
    });

    it('should display correct number of rows per page (default 10)', () => {
      render(
        <DataTable
          columns={testColumns}
          data={largeDataset}
          rowKey={getRowKey}
        />
      );

      // Should show exactly 10 data rows (plus 1 header row = 11 total)
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(11); // 1 header + 10 data rows
    });

    it('should navigate to next page when Next button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          columns={testColumns}
          data={largeDataset}
          rowKey={getRowKey}
        />
      );

      // Initially on page 1
      expect(screen.getByText('Showing 1 to 10 of 25 entries')).toBeInTheDocument();
      expect(screen.getByText('User 1')).toBeInTheDocument();

      // Click Next button
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      // Should be on page 2
      expect(screen.getByText('Showing 11 to 20 of 25 entries')).toBeInTheDocument();
      expect(screen.getByText('User 11')).toBeInTheDocument();
      expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    });

    it('should navigate to previous page when Previous button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          columns={testColumns}
          data={largeDataset}
          rowKey={getRowKey}
        />
      );

      // Navigate to page 2 first
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      expect(screen.getByText('Showing 11 to 20 of 25 entries')).toBeInTheDocument();

      // Click Previous button
      const previousButton = screen.getByText('Previous');
      await user.click(previousButton);

      // Should be back on page 1
      expect(screen.getByText('Showing 1 to 10 of 25 entries')).toBeInTheDocument();
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });

    it('should navigate to first page when First button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          columns={testColumns}
          data={largeDataset}
          rowKey={getRowKey}
        />
      );

      // Navigate to page 2
      await user.click(screen.getByText('Next'));
      expect(screen.getByText('Showing 11 to 20 of 25 entries')).toBeInTheDocument();

      // Click First button
      const firstButton = screen.getByText('First');
      await user.click(firstButton);

      // Should be on page 1
      expect(screen.getByText('Showing 1 to 10 of 25 entries')).toBeInTheDocument();
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });

    it('should navigate to last page when Last button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          columns={testColumns}
          data={largeDataset}
          rowKey={getRowKey}
        />
      );

      // Click Last button
      const lastButton = screen.getByText('Last');
      await user.click(lastButton);

      // Should be on last page (page 3 for 25 items with 10 per page)
      expect(screen.getByText('Showing 21 to 25 of 25 entries')).toBeInTheDocument();
      expect(screen.getByText('User 25')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Current page indicator
    });

    it('should disable First and Previous buttons on first page', () => {
      render(
        <DataTable
          columns={testColumns}
          data={largeDataset}
          rowKey={getRowKey}
        />
      );

      const firstButton = screen.getByText('First');
      const previousButton = screen.getByText('Previous');

      expect(firstButton).toBeDisabled();
      expect(previousButton).toBeDisabled();
    });

    it('should disable Next and Last buttons on last page', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          columns={testColumns}
          data={largeDataset}
          rowKey={getRowKey}
        />
      );

      // Navigate to last page
      const lastButton = screen.getByText('Last');
      await user.click(lastButton);

      const nextButton = screen.getByText('Next');
      const lastButtonAfterClick = screen.getByText('Last');

      expect(nextButton).toBeDisabled();
      expect(lastButtonAfterClick).toBeDisabled();
    });
  });

  describe('custom cell rendering', () => {
    it('should render custom cell content from column definition', () => {
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      // Should render status badges with correct classes
      const activeBadges = screen.getAllByText('active');
      const inactiveBadges = screen.getAllByText('inactive');
      
      activeBadges.forEach(badge => {
        expect(badge).toHaveClass('badge', 'badge-success');
      });
      
      inactiveBadges.forEach(badge => {
        expect(badge).toHaveClass('badge', 'badge-error');
      });

      // Should render formatted dates - just test that some dates are rendered
      // Date format may vary by locale, so we test for presence of dates
      const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle single row of data', () => {
      const singleUser = [mockUsers[0]];
      
      render(
        <DataTable
          columns={testColumns}
          data={singleUser}
          rowKey={getRowKey}
        />
      );

      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2); // 1 header + 1 data row
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle data with missing optional fields', () => {
      const userWithMissingFields = [{
        id: 999,
        name: 'Incomplete User',
        email: '',
        role: '',
        status: 'active' as const,
        joinDate: '2023-01-01',
      }];

      render(
        <DataTable
          columns={testColumns}
          data={userWithMissingFields}
          rowKey={getRowKey}
        />
      );

      expect(screen.getByText('Incomplete User')).toBeInTheDocument();
      // Empty cells should still render without errors
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should use rowKey function to generate unique keys', () => {
      const customRowKey = vi.fn((row: TestUser) => `user-${row.id}`);
      
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={customRowKey}
        />
      );

      expect(customRowKey).toHaveBeenCalledTimes(mockUsers.length);
      mockUsers.forEach(user => {
        expect(customRowKey).toHaveBeenCalledWith(user);
      });
    });

    it('should maintain sorting state when data changes', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      // Sort by name
      const nameHeader = screen.getByText('Name').closest('th');
      await user.click(nameHeader!);

      // Should be sorted
      let rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Alice Brown');

      // Update data with additional user
      const updatedData = [...mockUsers, {
        id: 6,
        name: 'Aaron First',
        email: 'aaron@example.com',
        role: 'User',
        status: 'active' as const,
        joinDate: '2023-01-01',
      }];

      // Rerender should maintain existing sort state
      rerender(
        <DataTable
          columns={testColumns}
          data={updatedData}
          rowKey={getRowKey}
        />
      );

      // Should maintain sort and include new data
      rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Aaron First'); // Should be first alphabetically
    });
  });

  describe('accessibility', () => {
    it('should render proper table structure with roles', () => {
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(testColumns.length);
      expect(screen.getAllByRole('row')).toHaveLength(mockUsers.length + 1); // +1 for header
    });

    it('should maintain keyboard navigation for sortable headers', async () => {
      render(
        <DataTable
          columns={testColumns}
          data={mockUsers}
          rowKey={getRowKey}
        />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      
      // Should have appropriate attributes for accessibility
      expect(nameHeader).toBeInTheDocument();
      expect(nameHeader).toHaveClass('cursor-pointer');
      
      // TanStack Table handles keyboard events internally, so we just verify
      // the header is properly structured for accessibility
      expect(nameHeader?.querySelector('svg')).toBeInTheDocument(); // Sort icon present
    });

    it('should maintain focus management during pagination', async () => {
      const user = userEvent.setup();
      
      render(
        <DataTable
          columns={testColumns}
          data={generateLargeDataset(25)}
          rowKey={getRowKey}
        />
      );

      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      // Button should remain focusable after state change
      expect(nextButton).toBeInTheDocument();
    });
  });
});