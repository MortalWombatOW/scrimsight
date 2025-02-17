import { Center, Title, Stack, Text, Group, Button, Space, Anchor } from '@mantine/core';
import { GoLinkExternal } from "react-icons/go";
import { useAtom } from 'jotai';
import { sampleDataEnabledAtom } from '../../atoms/files/sampleDataAtoms';
import { Dropzone } from '@mantine/dropzone';
import { MdOutlineFileOpen } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { logFileInputMutationAtom } from '../../atoms/files';

const ZeroState = () => {
  const [_, setSampleDataEnabled] = useAtom(sampleDataEnabledAtom);
  const [__, setFiles] = useAtom(logFileInputMutationAtom);

  const handleDrop = (files: File[]) => {
    const filteredFiles = files.filter(file =>
      (file.type && file.type.startsWith('text')) || file.name.endsWith('.txt')
    );
    setFiles(filteredFiles);
  };

  return (
    <Center h="calc(100vh - 68px - 32px)">
      <Stack w={600}>
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
        <Dropzone
          onDrop={handleDrop}
          accept={['text/*', '.txt']}
          styles={{
            root: {
              borderWidth: 2,
              padding: 20
            }
          }}
        >
          <Group justify="center" gap="xl" style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <MdOutlineFileOpen size={50} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IoMdClose size={50} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <MdOutlineFileOpen size={50} />
            </Dropzone.Idle>

            <Stack gap="xs">
              <Text size="xl" inline>
                Drag files here or click to select
              </Text>
              <Text size="sm" c="dimmed" inline>
                Upload your ScrimTime log files to get started
              </Text>
            </Stack>
          </Group>
        </Dropzone>
        <Center>
          <Group>
            <Text>or</Text>
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
