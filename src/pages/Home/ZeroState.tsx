import { Center, Title, Stack, Text, Group, Button, Space, Anchor } from '@mantine/core';
import { GoLinkExternal } from "react-icons/go";
import { useAtom } from 'jotai';
import { sampleDataEnabledAtom } from '../../atoms/files/sampleDataAtoms';
import { Link } from 'react-router-dom';
const ZeroState = () => {

  const [_, setSampleDataEnabled] = useAtom(sampleDataEnabledAtom);

  return (
    <Center h="calc(100vh - 68px - 32px)">
      <Stack>
        <Center>
          <Title order={1} fw={900} fz={64} c="white" ta="center">Welcome to&nbsp;
            <Text fw={900} fz={64} component="span" variant="gradient" gradient={{ from: 'orange', to: 'yellow' }}>Scrimsight</Text>
          </Title>
        </Center>
        <Center>
          <Text ta="center">
            A platform for analyzing Overwatch logs from the <Anchor href="https://workshop.codes/DKEEH" target="_blank">ScrimTime <GoLinkExternal style={{ position: 'relative', top: '2px' }} /></Anchor> workshop code.
          </Text>
        </Center>
        <Space h="md" />
        <Center>
          <Group>
            <Button component={Link} to="/files">
              Add files
            </Button>
            <Text>
              or
            </Text>
            <Button onClick={() => setSampleDataEnabled(true)}>
              Explore example data
            </Button>
          </Group>
        </Center>
      </Stack>
    </Center>
  );
};

export default ZeroState;
