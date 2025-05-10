'use client';

import {
  IconButton,
  MenuItem,
  Divider,
  CircularProgress,
  Popper,
  Paper,
  MenuList,
  ClickAwayListener,
  Grow,
  Box,
} from '@mui/material';
import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CartButton from './CartButton';

// Mobile navbar for the app

interface MobileNavbarProps {
  user: any;
  isLoading: boolean;
  navLinks: Array<{ label: string; path: string }>;
  userMenuItems: Array<{ label: string; path: string }>;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onAuthNavigation: (mode: 'login' | 'signup') => void;
}

// Mobile navbar component
export default function MobileNavbar({
  user,
  isLoading,
  navLinks,
  userMenuItems,
  onNavigate,
  onLogout,
  onAuthNavigation,
}: MobileNavbarProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  // Handle the toggle for the mobile navbar
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Handle the close for the mobile navbar
  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  // Handle the focus for the mobile navbar
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // Handle the navigation for the mobile navbar
  const handleNavigation = (path: string) => {
    onNavigate(path);
    setOpen(false);
  };

  // Handle the auth navigation for the mobile navbar
  const handleAuth = (mode: 'login' | 'signup') => {
    onAuthNavigation(mode);
    setOpen(false);
  };

  // Handle the logout for the mobile navbar
  const handleLogout = () => {
    onLogout();
    setOpen(false);
  };

  // Render the mobile navbar
  return (
    <>
      <IconButton
        ref={anchorRef}
        edge="end"
        color="inherit"
        aria-label="menu"
        onClick={handleToggle}
        aria-controls={open ? 'mobile-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        sx={{ display: { xs: 'flex', md: 'none' } }}
      >
        <MenuIcon />
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-end"
        transition
        disablePortal
        style={{ zIndex: 1300 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-end' ? 'right top' : 'right bottom',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                mt: 0.5,
                borderRadius: 2,
                overflow: 'hidden',
                maxHeight: '70vh',
                width: 'auto',
                minWidth: '120px',
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="mobile-menu"
                  aria-labelledby="mobile-menu-button"
                  sx={{ py: 0.5 }}
                >
                  {user && (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CartButton />
                      </Box>
                      {navLinks.map((link) => (
                        <MenuItem
                          key={link.path}
                          onClick={() => handleNavigation(link.path)}
                          sx={{ py: 0.75, justifyContent: 'flex-end' }}
                        >
                          {link.label}
                        </MenuItem>
                      ))}
                      <Divider sx={{ my: 0.5 }} />
                    </>
                  )}

                  {isLoading ? (
                    <MenuItem
                      disabled
                      sx={{ py: 0.75, justifyContent: 'flex-end' }}
                    >
                      <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
                    </MenuItem>
                  ) : user ? (
                    <>
                      {userMenuItems.map((item) => (
                        <MenuItem
                          key={item.path}
                          onClick={() => handleNavigation(item.path)}
                          sx={{ py: 0.75, justifyContent: 'flex-end' }}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                      <MenuItem
                        onClick={handleLogout}
                        disabled={isLoading}
                        sx={{ py: 0.75, justifyContent: 'flex-end' }}
                      >
                        Logout
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem
                        onClick={() => handleAuth('login')}
                        sx={{ py: 0.75, justifyContent: 'flex-end' }}
                      >
                        Login
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleAuth('signup')}
                        sx={{ py: 0.75, justifyContent: 'flex-end' }}
                      >
                        Sign Up
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
