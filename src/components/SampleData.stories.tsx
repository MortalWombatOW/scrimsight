import type { Meta, StoryObj } from '@storybook/react-vite';
import SampleData from './SampleData';

const meta: Meta<typeof SampleData> = {
  title: 'Components/SampleData',
  component: SampleData,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A utility component that loads sample data when mounted. This component is used to provide demo data for development and testing purposes. It renders its children while triggering sample data loading in the background.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'React nodes to render while sample data is being loaded',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Example
export const Default: Story = {
  render: () => (
    <SampleData>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Sample Data Loaded</h2>
          <p>This component has triggered the loading of sample data.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">View Data</button>
          </div>
        </div>
      </div>
    </SampleData>
  ),
};

// With Loading State
export const WithLoadingState: Story = {
  render: () => (
    <SampleData>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Loading Sample Data...</h2>
          <p>Sample data is being loaded in the background.</p>
          <div className="flex items-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            <span className="text-sm text-base-content/70">Initializing demo environment</span>
          </div>
        </div>
      </div>
    </SampleData>
  ),
};

// In Dashboard Context
export const InDashboard: Story = {
  render: () => (
    <SampleData>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <div className="stat-title">Sample Files</div>
          <div className="stat-value text-primary">5</div>
          <div className="stat-desc">Log files loaded</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div className="stat-title">Demo Mode</div>
          <div className="stat-value text-secondary">Active</div>
          <div className="stat-desc">Ready for exploration</div>
        </div>

        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
            </svg>
          </div>
          <div className="stat-title">Data Points</div>
          <div className="stat-value text-accent">~1.2K</div>
          <div className="stat-desc">Estimated entries</div>
        </div>
      </div>
    </SampleData>
  ),
};

// With Alert Message
export const WithAlert: Story = {
  render: () => (
    <SampleData>
      <div className="max-w-md">
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="font-bold">Demo Mode Active!</h3>
            <div className="text-xs">Sample data has been loaded for demonstration purposes.</div>
          </div>
        </div>
      </div>
    </SampleData>
  ),
};

// Simple Text Content
export const SimpleText: Story = {
  render: () => (
    <SampleData>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Sample Data Component</h3>
        <p className="text-base-content/70">This component loads sample data in the background.</p>
        <p className="text-sm text-success">✓ Sample data loading initiated</p>
      </div>
    </SampleData>
  ),
};

// Empty Children
export const EmptyChildren: Story = {
  render: () => (
    <SampleData>
      <></>
    </SampleData>
  ),
};

// Multiple Child Elements
export const MultipleChildren: Story = {
  render: () => (
    <SampleData>
      <div className="space-y-4 max-w-lg">
        <h2 className="text-xl font-bold">Demo Environment</h2>
        <p className="text-base-content/70">
          This environment includes sample data to showcase the application's capabilities.
        </p>
        <div className="flex gap-2">
          <div className="badge badge-primary">Sample Data</div>
          <div className="badge badge-secondary">Demo Mode</div>
          <div className="badge badge-accent">Development</div>
        </div>
        <div className="divider"></div>
        <ul className="list-disc list-inside space-y-1 text-sm text-base-content/70">
          <li>5 sample log files loaded</li>
          <li>Realistic game data included</li>
          <li>Ready for testing and exploration</li>
        </ul>
      </div>
    </SampleData>
  ),
};

// In Modal Context
export const InModal: Story = {
  render: () => (
    <SampleData>
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Sample Data Loaded</h3>
          <p className="py-4">The application has been initialized with sample data for demonstration purposes.</p>
          <div className="modal-action">
            <button className="btn">Close</button>
            <button className="btn btn-primary">Continue</button>
          </div>
        </div>
        <div className="modal-backdrop"></div>
      </div>
    </SampleData>
  ),
};

// With Error Simulation (for testing purposes)
export const ErrorSimulation: Story = {
  render: () => (
    <SampleData>
      <div className="alert alert-warning max-w-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h3 className="font-bold">Loading Sample Data</h3>
          <div className="text-xs">If sample data fails to load, check console for errors.</div>
        </div>
      </div>
    </SampleData>
  ),
};