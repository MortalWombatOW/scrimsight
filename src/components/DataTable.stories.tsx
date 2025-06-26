import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from './DataTable';

interface SampleUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const sampleUsers: SampleUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', joinDate: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', joinDate: '2023-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'inactive', joinDate: '2023-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active', joinDate: '2023-04-05' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'active', joinDate: '2023-05-12' },
  { id: 6, name: 'Diana Davis', email: 'diana@example.com', role: 'User', status: 'inactive', joinDate: '2023-06-18' },
  { id: 7, name: 'Eve Martinez', email: 'eve@example.com', role: 'Manager', status: 'active', joinDate: '2023-07-22' },
  { id: 8, name: 'Frank Taylor', email: 'frank@example.com', role: 'User', status: 'active', joinDate: '2023-08-30' },
  { id: 9, name: 'Grace Lee', email: 'grace@example.com', role: 'Admin', status: 'active', joinDate: '2023-09-14' },
  { id: 10, name: 'Henry Kim', email: 'henry@example.com', role: 'User', status: 'inactive', joinDate: '2023-10-01' },
  { id: 11, name: 'Iris Chen', email: 'iris@example.com', role: 'Manager', status: 'active', joinDate: '2023-11-08' },
  { id: 12, name: 'Jack Miller', email: 'jack@example.com', role: 'User', status: 'active', joinDate: '2023-12-03' },
];

const userColumns: ColumnDef<SampleUser>[] = [
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
        <span 
          className={`badge ${
            status === 'active' ? 'badge-success' : 'badge-error'
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'joinDate',
    header: 'Join Date',
    enableSorting: true,
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },
];

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onRowClick: { action: 'row clicked' },
  },
};

export default meta;
type UserStory = StoryObj<{
  columns: ColumnDef<SampleUser>[];
  data: SampleUser[];
  rowKey: (row: SampleUser) => string;
  defaultSort?: string;
  onRowClick?: (row: SampleUser) => void;
}>;

type ProductStory = StoryObj<{
  columns: ColumnDef<SimpleProduct>[];
  data: SimpleProduct[];
  rowKey: (row: SimpleProduct) => string;
  defaultSort?: string;
  onRowClick?: (row: SimpleProduct) => void;
}>;

export const Default: UserStory = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    rowKey: (row: SampleUser) => row.id.toString(),
  },
};

export const WithDefaultSort: UserStory = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    rowKey: (row: SampleUser) => row.id.toString(),
    defaultSort: 'name',
  },
};

export const WithRowClick: UserStory = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    rowKey: (row: SampleUser) => row.id.toString(),
    onRowClick: (row: SampleUser) => {
      alert(`Clicked on ${row.name} (${row.email})`);
    },
  },
};

export const SmallDataset: UserStory = {
  args: {
    columns: userColumns,
    data: sampleUsers.slice(0, 3),
    rowKey: (row: SampleUser) => row.id.toString(),
  },
};

export const EmptyState: UserStory = {
  args: {
    columns: userColumns,
    data: [],
    rowKey: (row: SampleUser) => row.id.toString(),
  },
};

interface SimpleProduct {
  id: number;
  name: string;
  price: number;
  category: string;
}

const productData: SimpleProduct[] = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Chair', price: 149.99, category: 'Furniture' },
  { id: 3, name: 'Book', price: 19.99, category: 'Books' },
  { id: 4, name: 'Headphones', price: 79.99, category: 'Electronics' },
  { id: 5, name: 'Desk', price: 299.99, category: 'Furniture' },
];

const productColumns: ColumnDef<SimpleProduct>[] = [
  {
    accessorKey: 'name',
    header: 'Product Name',
    enableSorting: true,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    enableSorting: true,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    enableSorting: true,
    cell: ({ getValue }) => {
      const price = getValue() as number;
      return `$${price.toFixed(2)}`;
    },
  },
];

export const ProductTable: ProductStory = {
  args: {
    columns: productColumns,
    data: productData,
    rowKey: (row: SimpleProduct) => row.id.toString(),
    defaultSort: 'price',
  },
};