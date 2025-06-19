import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import UploadModal from './UploadModal';

const meta: Meta<typeof UploadModal> = {
  title: 'Components/UploadModal',
  component: UploadModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the modal is open or closed',
    },
    onClose: {
      action: 'closed',
      description: 'Callback function called when the modal is closed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="p-8">
        <button 
          className="btn btn-primary"
          onClick={() => setIsOpen(true)}
        >
          Open Upload Modal
        </button>
        
        <UploadModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing how to control the modal state. Click the button to open the modal.',
      },
    },
  },
};

export const WithBackdrop: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with backdrop overlay. Clicking outside the modal or the X button will close it.',
      },
    },
  },
};

export const Usage: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleClose = () => {
      setIsOpen(false);
    };
    
    return (
      <div className="p-8 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Modal Usage Example</h3>
          <p className="text-sm text-gray-600 mb-4">
            This example demonstrates the complete file upload workflow: drag & drop files, 
            review the selected files list, remove individual files, and load them all at once.
          </p>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={() => setIsOpen(true)}
        >
          Upload Log Files
        </button>
        
        <div className="text-sm text-gray-600">
          <h4 className="font-medium mb-2">Features:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Drag and drop multiple files</li>
            <li>Preview selected files with size information</li>
            <li>Remove individual files from the list</li>
            <li>Clear all selected files at once</li>
            <li>Load all files with a single button click</li>
            <li>Duplicate file prevention</li>
          </ul>
        </div>
        
        <UploadModal
          open={isOpen}
          onClose={handleClose}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete usage example showing the full file upload workflow with file management.',
      },
    },
  },
};