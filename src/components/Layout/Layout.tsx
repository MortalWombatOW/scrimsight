import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import { AppShell, Burger, Group, Loader, Center, ActionIcon, Menu, Anchor, Button, Text, Switch, Tooltip } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { Suspense, useEffect, useState } from 'react';
import { FaDiscord } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { useAuth } from "react-oidc-context";
import { useAtomValue } from 'jotai';
import { sampleDataEnabledAtom } from '../../atoms/files/sampleDataAtoms';
import { useAtom } from 'jotai';
import { logFileInputAtom } from '../../atoms';
import { LogFileInput } from '../../atoms/files/logFileInputAtom';
const DiscordButton = () => {
  // In a real app, this button might have more logic, like linking to a Discord server or community page.
  return (
    <Tooltip label="Join our Discord Community">
      <ActionIcon variant="filled" color="#5865f2" style={{ marginLeft: 'auto' }}>
        <FaDiscord />
      </ActionIcon>
    </Tooltip>
  );
};

const UserMenu = ({ auth, onLogout }: { auth: ReturnType<typeof useAuth>, onLogout: () => void }) => {
  const [discordUsername, setDiscordUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (auth.isAuthenticated && auth.user) {
        try {
          const userInfo = await fetch("https://discord.com/api/users/@me", { // Changed endpoint to discord.com
            headers: {
              Authorization: `${auth.user.token_type} ${auth.user.access_token}`,
            },
          });
          if (userInfo.ok) {
            const userInfoJson = await userInfo.json();
            setDiscordUsername(userInfoJson.username + "#" + userInfoJson.discriminator); // Display username#discriminator
          } else {
            console.error("Failed to fetch Discord user info:", userInfo.status, userInfo.statusText);
            setDiscordUsername("User"); // Default username if fetch fails
          }
        } catch (error) {
          console.error("Error fetching Discord user info:", error);
          setDiscordUsername("User"); // Default username on error
        }
      } else {
        setDiscordUsername(null); // No username when not authenticated
      }
    };

    fetchUserInfo();
  }, [auth.isAuthenticated, auth.user]);


  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon style={{ marginRight: '12px' }} variant="hover">
          <FaRegUser />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {discordUsername && <Menu.Label>{discordUsername}</Menu.Label>} {/* Display Discord Username */}
        <Menu.Item component={Link} to="/account/settings"> {/* Changed to /account/settings for better structure */}
          Settings
        </Menu.Item>
        <Menu.Item component={Link} to="/account/subscriptions"> {/* Placeholder for Subscriptions */}
          Subscriptions
        </Menu.Item>
        <Menu.Item color="red" onClick={onLogout}> {/* Using passed onLogout function */}
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const auth = useAuth();
  const [sampleDataEnabled, setSampleDataEnabled] = useAtom(sampleDataEnabledAtom);
  const files = useAtomValue(logFileInputAtom);

  const [storedFiles, setStoredFiles] = useLocalStorage<File[]>({ key: "storedFiles", defaultValue: files.files });


  const [isFetchingUserInfo, setIsFetchingUserInfo] = useState(false); // Loading state for user info fetch

  // Centralized logout function to pass to UserMenu
  const handleLogout = () => {
    void auth.signoutRedirect();
  };

  // Loading states for OIDC navigators
  if (auth.activeNavigator === "signinRedirect" || auth.activeNavigator === "signinSilent") {
    return <Center><Loader /></Center>;
  }

  if (auth.isLoading) {
    return <Center><Loader /></Center>;
  }

  if (auth.error) {
    alert(auth.error.message);
    return <Center><Text color="red">Authentication Error: {auth.error.message}</Text></Center>; // More user-friendly error
  }


  return (
    <AppShell
      header={{ height: 68 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group p="md" justify="space-between"> {/* Use space-between to align items */}
          <Group> {/* Group for Burger and SCRIMSIGHT */}
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Button component={Link} to="/" variant='transparent'>
              <Text fw={900} fz={24} component="span" variant="gradient" gradient={{ from: 'orange', to: 'yellow' }} style={{ fontFamily: "Goldman" }}>SCRIMSIGHT</Text>
            </Button>
          </Group>

          <Group gap="md"> {/* Group for right-aligned items */}
            <DiscordButton />
            <Switch
              label="Sample Data"
              checked={sampleDataEnabled}
              onChange={(event) => setSampleDataEnabled(event.target.checked)}
            />
            {auth.isAuthenticated ? (
              <UserMenu auth={auth} onLogout={handleLogout} /> // Pass auth and logout handler
            ) : (
              <Button onClick={() => void auth.signinRedirect()}>Login</Button>
            )}
          </Group>
        </Group>
      </AppShell.Header>      <AppShell.Navbar p="md"><Suspense fallback={<Center><Loader /></Center>}><Navigation /></Suspense></AppShell.Navbar>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};