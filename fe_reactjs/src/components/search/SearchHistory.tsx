import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  History,
  Clear,
  Search,
} from '@mui/icons-material';

interface SearchHistoryProps {
  onSearch?: (query: string) => void;
  maxItems?: number;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ 
  onSearch, 
  maxItems = 10 
}) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = () => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const removeHistoryItem = (index: number) => {
    const newHistory = searchHistory.filter((_, i) => i !== index);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleHistoryClick = (query: string) => {
    onSearch?.(query);
  };

  if (searchHistory.length === 0) {
    return null;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <History sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Lịch sử tìm kiếm
          </Typography>
        </Box>
        <IconButton size="small" onClick={clearHistory}>
          <Clear fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {searchHistory.slice(0, maxItems).map((query, index) => (
          <Chip
            key={index}
            label={query}
            onClick={() => handleHistoryClick(query)}
            onDelete={() => removeHistoryItem(index)}
            variant="outlined"
            size="small"
            icon={<Search />}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          />
        ))}
      </Box>

      <Divider />
    </Box>
  );
};
