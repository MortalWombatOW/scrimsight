import type { Meta, StoryObj } from '@storybook/react-vite';
import AtomNode from './AtomNode';

const meta: Meta<typeof AtomNode> = {
  title: 'Components/AtomNode',
  component: AtomNode,
  parameters: { 
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      id: 'sample-atom',
      label: 'Sample Atom',
      type: 'atom',
      fields: [
        { name: 'value', type: 'string' },
        { name: 'count', type: 'number' }
      ],
      layer: "data"
    },
    id: 'sample-atom',
    type: 'atom',
    selected: false,
    xPos: 0,
    yPos: 0,
    zIndex: 1,
    dragging: false
  },
};