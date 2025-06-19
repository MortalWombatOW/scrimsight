import type { Meta, StoryObj } from '@storybook/react';
import { Component } from 'react';
import ErrorBoundary from './ErrorBoundary';
import PrimaryButton from './PrimaryButton';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A React error boundary component that catches JavaScript errors anywhere in the child component tree and displays a fallback UI instead of crashing the entire app.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'React children that will be wrapped by the error boundary',
      control: false,
    },
    fallback: {
      description: 'Optional custom fallback component to render when an error occurs',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component that throws an error for demonstration
const ErrorThrowingComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('This is a simulated error for testing the ErrorBoundary');
  }
  return <div className="p-4 bg-success/20 text-success rounded">Component rendered successfully!</div>;
};

// Component with a button that triggers an error
const ErrorTriggerComponent = () => {
  const throwError = () => {
    throw new Error('User triggered error');
  };

  return (
    <div className="p-4 space-y-4">
      <p>This component has a button that will trigger an error when clicked:</p>
      <PrimaryButton onClick={throwError}>
        Trigger Error
      </PrimaryButton>
    </div>
  );
};

// Async component that simulates an async error
class AsyncErrorComponent extends Component<{}, { hasError: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ hasError: true });
    }, 1000);
  }

  render() {
    if (this.state.hasError) {
      throw new Error('Async error occurred');
    }
    return <div className="p-4 bg-info/20 text-info rounded">Loading async content...</div>;
  }
}

// Basic Examples
export const WithWorkingComponent: Story = {
  render: () => (
    <ErrorBoundary>
      <ErrorThrowingComponent shouldThrow={false} />
    </ErrorBoundary>
  ),
};

export const WithErrorComponent: Story = {
  render: () => (
    <ErrorBoundary>
      <ErrorThrowingComponent shouldThrow={true} />
    </ErrorBoundary>
  ),
};

export const WithUserTriggeredError: Story = {
  render: () => (
    <ErrorBoundary>
      <ErrorTriggerComponent />
    </ErrorBoundary>
  ),
};

export const WithAsyncError: Story = {
  render: () => (
    <ErrorBoundary>
      <AsyncErrorComponent />
    </ErrorBoundary>
  ),
};

// Custom Fallback
export const WithCustomFallback: Story = {
  render: () => (
    <ErrorBoundary 
      fallback={
        <div className="alert alert-error">
          <div>
            <h3 className="font-bold">Custom Error UI</h3>
            <div className="text-xs">This is a custom fallback component</div>
          </div>
        </div>
      }
    >
      <ErrorThrowingComponent shouldThrow={true} />
    </ErrorBoundary>
  ),
};

// Nested Error Boundaries
export const NestedErrorBoundaries: Story = {
  render: () => (
    <div className="space-y-4">
      <ErrorBoundary>
        <div className="p-4 border border-primary/30 rounded">
          <h3 className="font-semibold mb-2">First Section (No Error)</h3>
          <ErrorThrowingComponent shouldThrow={false} />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <div className="p-4 border border-primary/30 rounded">
          <h3 className="font-semibold mb-2">Second Section (With Error)</h3>
          <ErrorThrowingComponent shouldThrow={true} />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <div className="p-4 border border-primary/30 rounded">
          <h3 className="font-semibold mb-2">Third Section (No Error)</h3>
          <ErrorThrowingComponent shouldThrow={false} />
        </div>
      </ErrorBoundary>
    </div>
  ),
};

// Real-world Use Cases
export const ProtectingFormSection: Story = {
  render: () => (
    <div className="max-w-md mx-auto">
      <form className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" className="input input-bordered" />
        </div>
        
        <ErrorBoundary fallback={
          <div className="alert alert-warning">
            <span>Address section unavailable. Please refresh the page.</span>
          </div>
        }>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <ErrorThrowingComponent shouldThrow={true} />
          </div>
        </ErrorBoundary>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone</span>
          </label>
          <input type="tel" className="input input-bordered" />
        </div>
        
        <PrimaryButton type="submit" className="w-full">
          Submit
        </PrimaryButton>
      </form>
    </div>
  ),
};

export const ProtectingDashboardWidget: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title">User Stats</h2>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={false} />
          </ErrorBoundary>
        </div>
      </div>
      
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title">Revenue Chart</h2>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        </div>
      </div>
      
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title">Recent Activity</h2>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={false} />
          </ErrorBoundary>
        </div>
      </div>
      
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title">System Health</h2>
          <ErrorBoundary>
            <ErrorTriggerComponent />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  ),
};

// Error Display
export const ErrorDisplay: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <div className="alert alert-info">
          <span>This demonstrates how errors are displayed by the ErrorBoundary component.</span>
        </div>
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      </div>
    );
  },
};