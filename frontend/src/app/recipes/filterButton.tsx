'use client';

import {
  Button,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  Chip,
  Box,
  Popper,
  Paper,
  MenuList,
  ClickAwayListener,
  Grow,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState, useRef, useEffect } from 'react';

// Common recipe tags
const RECIPE_TAGS = [
  'breakfast',
  'lunch',
  'dinner',
  'vegetarian',
  'quick',
  'dessert',
  'healthy',
  'italian',
  'protein',
];

interface FilterButtonProps {
  onFilterChange: (selectedTags: string[]) => void;
}

export default function FilterButton({ onFilterChange }: FilterButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const anchorRef = useRef<HTMLButtonElement>(null);

  // Return focus to button when menu closes
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

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

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newSelectedTags);
    onFilterChange(newSelectedTags);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    onFilterChange([]);
    setOpen(false);
  };

  return (
    <Box>
      <Button
        ref={anchorRef}
        variant="outlined"
        color="primary"
        onClick={handleToggle}
        startIcon={<FilterListIcon />}
        size="medium"
        aria-controls={open ? 'filter-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 'medium',
          backgroundColor:
            selectedTags.length > 0 ? 'rgba(46, 125, 50, 0.08)' : 'white',
          '&:hover': {
            backgroundColor:
              selectedTags.length > 0
                ? 'rgba(46, 125, 50, 0.12)'
                : 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        {selectedTags.length > 0
          ? `Filters (${selectedTags.length})`
          : 'Filter'}
      </Button>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        disablePortal
        style={{ zIndex: 1300 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                width: 250,
                mt: 0.5,
                borderRadius: 2,
                overflow: 'hidden',
                maxHeight: 300,
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="filter-menu"
                  onKeyDown={handleListKeyDown}
                  sx={{ maxHeight: 300, overflow: 'auto' }}
                >
                  <MenuItem onClick={clearFilters}>
                    <Typography
                      color="primary"
                      sx={{ width: '100%', textAlign: 'center' }}
                    >
                      Clear
                    </Typography>
                  </MenuItem>

                  {RECIPE_TAGS.map((tag) => (
                    <MenuItem
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      dense
                    >
                      <Checkbox
                        checked={selectedTags.includes(tag)}
                        size="small"
                      />
                      <ListItemText
                        primary={tag.charAt(0).toUpperCase() + tag.slice(1)}
                      />
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
