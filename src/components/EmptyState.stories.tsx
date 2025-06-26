import type { Meta, StoryObj } from '@storybook/react-vite';
import { 
  FileX, 
  Search, 
  Upload, 
  Database, 
  Users, 
  ShoppingCart,
  Mail,
  Calendar,
  Folder,
  Image
} from 'lucide-react';
import EmptyState from './EmptyState';
import PrimaryButton from './PrimaryButton';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible empty state component for displaying when no content is available. Supports icons, titles, descriptions, and action buttons with different size variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      description: 'Lucide React icon component to display',
      control: false,
    },
    title: {
      control: 'text',
      description: 'Main title text',
    },
    description: {
      control: 'text',
      description: 'Optional description text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the empty state',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    action: {
      description: 'Optional action element (usually a button)',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {
  args: {
    title: 'No data available',
    description: 'There is currently no data to display.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: FileX,
    title: 'No files found',
    description: 'No files have been uploaded yet.',
  },
};

export const WithAction: Story = {
  args: {
    icon: Upload,
    title: 'No files uploaded',
    description: 'Upload your first file to get started.',
    action: (
      <PrimaryButton>
        Upload Files
      </PrimaryButton>
    ),
  },
};

// Size Variants
export const SmallSize: Story = {
  args: {
    icon: Search,
    title: 'No results',
    description: 'Try adjusting your search.',
    size: 'sm',
  },
};

export const MediumSize: Story = {
  args: {
    icon: Database,
    title: 'No data available',
    description: 'Connect your data source to view information here.',
    size: 'md',
  },
};

export const LargeSize: Story = {
  args: {
    icon: Users,
    title: 'No team members yet',
    description: 'Invite team members to collaborate on this project and start working together.',
    size: 'lg',
    action: (
      <PrimaryButton>
        Invite Team Members
      </PrimaryButton>
    ),
  },
};

// Real-world Use Cases
export const NoSearchResults: Story = {
  args: {
    icon: Search,
    title: 'No search results',
    description: 'We couldn\'t find anything matching your search. Try different keywords or check your spelling.',
    action: (
      <PrimaryButton>
        Clear Search
      </PrimaryButton>
    ),
  },
};

export const EmptyShoppingCart: Story = {
  args: {
    icon: ShoppingCart,
    title: 'Your cart is empty',
    description: 'Looks like you haven\'t added any items to your cart yet.',
    action: (
      <PrimaryButton>
        Continue Shopping
      </PrimaryButton>
    ),
  },
};

export const NoMessages: Story = {
  args: {
    icon: Mail,
    title: 'No messages',
    description: 'You\'re all caught up! No new messages to display.',
    size: 'sm',
  },
};

export const NoEventsScheduled: Story = {
  args: {
    icon: Calendar,
    title: 'No events scheduled',
    description: 'You don\'t have any events coming up. Create a new event to get started.',
    action: (
      <PrimaryButton>
        Create Event
      </PrimaryButton>
    ),
  },
};

export const EmptyFolder: Story = {
  args: {
    icon: Folder,
    title: 'This folder is empty',
    description: 'Start organizing by adding files or creating subfolders.',
    size: 'lg',
    action: (
      <div className="flex gap-2">
        <PrimaryButton>
          Upload Files
        </PrimaryButton>
        <button className="btn btn-ghost">
          Create Folder
        </button>
      </div>
    ),
  },
};

export const NoImages: Story = {
  args: {
    icon: Image,
    title: 'No images to display',
    description: 'Upload images to see them in your gallery.',
    action: (
      <PrimaryButton>
        Upload Images
      </PrimaryButton>
    ),
  },
};

// Special Cases
export const TitleOnly: Story = {
  args: {
    title: 'No content',
  },
};

export const WithCustomStyling: Story = {
  args: {
    icon: Database,
    title: 'Custom styled empty state',
    description: 'This empty state has custom border styling applied.',
    className: 'border-2 border-dashed border-primary/30 rounded-lg bg-primary/5',
    action: (
      <PrimaryButton>
        Get Started
      </PrimaryButton>
    ),
  },
};

// Layout Examples
export const InCard: Story = {
  render: () => (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Recent Activity</h2>
        <EmptyState
          icon={FileX}
          title="No recent activity"
          description="Activity will appear here once you start using the application."
          size="sm"
        />
      </div>
    </div>
  ),
};

export const InModal: Story = {
  render: () => (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Select a File</h3>
        <EmptyState
          icon={FileX}
          title="No files available"
          description="Upload files to see them here."
          size="sm"
          action={
            <button className="btn btn-sm btn-primary">
              Upload Files
            </button>
          }
        />
        <div className="modal-action">
          <button className="btn">Close</button>
        </div>
      </div>
      <div className="modal-backdrop"></div>
    </div>
  ),
};

// Responsive Example
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-base-200 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Small Widget</h3>
        <EmptyState
          icon={Users}
          title="No users"
          size="sm"
        />
      </div>
      <div className="bg-base-200 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Medium Widget</h3>
        <EmptyState
          icon={Calendar}
          title="No events"
          description="Create your first event."
          size="md"
        />
      </div>
      <div className="bg-base-200 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Large Widget</h3>
        <EmptyState
          icon={Database}
          title="No data"
          description="Connect a data source to get started."
          size="lg"
          action={
            <button className="btn btn-sm btn-primary">
              Connect
            </button>
          }
        />
      </div>
    </div>
  ),
};