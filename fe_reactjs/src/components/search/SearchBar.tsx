import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Clear,
  History,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { SearchHistory } from './SearchHistory';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'history' | 'trending';
  id?: number;
  text: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Tìm kiếm sản phẩm...',
  onSearch,
  showSuggestions = true,
  fullWidth = false,
  size = 'medium',
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestionsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (value: string) => {
    setQuery(value);
    
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestionsList(false);
      return;
    }

    if (!showSuggestions) return;

    setLoading(true);
    try {
      // Get search suggestions
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.searchProducts(value, { limit: 5 }),
        categoryService.getAllCategories(),
      ]);

      const productSuggestions: SearchSuggestion[] = productsResponse.data.products.map(product => ({
        type: 'product',
        id: product.id,
        text: product.name,
        subtitle: product.category_name,
        icon: <Search />,
      }));

      const categorySuggestions: SearchSuggestion[] = categoriesResponse
        .filter(category => 
          category.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 3)
        .map(category => ({
          type: 'category',
          id: category.id,
          text: category.name,
          subtitle: `${category.product_count} sản phẩm`,
          icon: <CategoryIcon />,
        }));

      const historySuggestions: SearchSuggestion[] = searchHistory
        .filter(historyItem => 
          historyItem.toLowerCase().includes(value.toLowerCase()) && 
          historyItem !== value
        )
        .slice(0, 3)
        .map(historyItem => ({
          type: 'history',
          text: historyItem,
          icon: <History />,
        }));

      setSuggestions([
        ...productSuggestions,
        ...categorySuggestions,
        ...historySuggestions,
      ]);
      setShowSuggestionsList(true);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Add to search history
    const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Hide suggestions
    setShowSuggestionsList(false);

    // Navigate to search results
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    
    // Call onSearch callback
    onSearch?.(searchQuery);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product' && suggestion.id) {
      navigate(`/products/${suggestion.id}`);
    } else if (suggestion.type === 'category' && suggestion.id) {
      navigate(`/products?category=${suggestion.id}`);
    } else {
      setQuery(suggestion.text);
      handleSearch(suggestion.text);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestionsList(false);
    inputRef.current?.focus();
  };


  return (
    <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        ref={inputRef}
        fullWidth={fullWidth}
        size={size}
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestionsList(true);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />

      {/* Search Suggestions */}
      {showSuggestionsList && suggestions.length > 0 && (
        <Paper
          ref={suggestionsRef}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
            boxShadow: 3,
          }}
        >
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={20} />
            </Box>
          )}

          <List dense>
            {/* Search History */}
            {searchHistory.length > 0 && query === '' && (
              <>
                <SearchHistory 
                  onSearch={(query) => handleSuggestionClick({ type: 'history', text: query })}
                  maxItems={5}
                />
              </>
            )}

            {/* Suggestions */}
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>
                  {suggestion.icon}
                </ListItemIcon>
                <ListItemText
                  primary={suggestion.text}
                  secondary={suggestion.subtitle}
                />
                {suggestion.type === 'product' && (
                  <Chip label="Sản phẩm" size="small" color="primary" />
                )}
                {suggestion.type === 'category' && (
                  <Chip label="Danh mục" size="small" color="secondary" />
                )}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};
