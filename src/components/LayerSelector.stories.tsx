import type { Meta, StoryObj } from '@storybook/react-vite';
import LayerSelector from './LayerSelector';
import { useState } from 'react';

const meta: Meta<typeof LayerSelector> = {
  title: 'Components/LayerSelector',
  component: LayerSelector,
  parameters: { 
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [selectedLayers, setSelectedLayers] = useState<string[]>(['data', 'extractor']);
    const [direction, setDirection] = useState<'LR' | 'TB'>('LR');
    
    return (
      <LayerSelector
        {...args}
        selectedLayers={selectedLayers}
        setSelectedLayers={setSelectedLayers}
        onLayout={() => console.log('Layout triggered')}
        direction={direction}
        setDirection={setDirection}
      />
    );
  },
  args: {},
};