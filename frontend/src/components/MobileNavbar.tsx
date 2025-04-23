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
} from '@mui/material';
import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';

interface MobileNavbarProps {
  user: any;
  isLoading: boolean;
  navLinks: Array<{ label: string; path: string }>;
  userMenuItems: Array<{ label: string; path: string }>;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onAuthNavigation: (mode: 'login' | 'signup') => void;
}

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

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleNavigation = (path: string) => {
    onNavigate(path);
    setOpen(false);
  };

  const handleAuth = (mode: 'login' | 'signup') => {
    onAuthNavigation(mode);
    setOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setOpen(false);
  };

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
                  onKeyDown={handleListKeyDown}
                  sx={{ py: 0.5 }}
                >
                  {user && (
                    <>
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
