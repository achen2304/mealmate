'use client';

import { TextField, InputAdornment, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from 'react';

interface RecipeSearchProps {
  onSearch: (searchText: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search...',
}: RecipeSearchProps) {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchText(newValue);
    onSearch(newValue);
  };

  const handleClearSearch = () => {
    setSearchText('');
    onSearch('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        placeholder={placeholder}
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={handleSearchChange}
        size="small"
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchText ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClearSearch}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
}
