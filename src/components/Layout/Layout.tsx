import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import { AppShell, Burger, Title, Group, Loader, Center, ActionIcon, Menu, Anchor, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Suspense } from 'react';
import { FaDiscord } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";

const DiscordButton = () => {
  return (
    <ActionIcon variant="filled" color="#5865f2" style={{ marginLeft: 'auto' }}>
      <FaDiscord />
    </ActionIcon>
  );
};

const UserMenu = () => {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon style={{ marginRight: '12px' }}>
          <FaRegUser />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>
          <Anchor component={Link} to="/settings">
            Settings
          </Anchor>
        </Menu.Item>
        <Menu.Item>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {

  const [opened, { toggle }] = useDisclosure();


  return (
    <AppShell
      header={{ height: 68 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    // layout="alt"
    >
      <AppShell.Header>
        <Group p="md">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <Button component={Link} to="/" variant='transparent'>
            <Title order={2} c="myColor" style={{ fontFamily: "sintony" }}>
              Scrimsight
            </Title>
          </Button>
          <DiscordButton />
          <UserMenu />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md"><Suspense fallback={<Center><Loader /></Center>}><Navigation /></Suspense></AppShell.Navbar>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}; 