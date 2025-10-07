import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Favorite,
  Person,
  Settings,
  Logout,
  Home,
  Category,
  Search,
  Security,
  Info,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigationItems = [
    { label: 'Trang chủ', path: '/', icon: <Home /> },
    { label: 'Sản phẩm', path: '/products', icon: <Category /> },
    { label: 'Tìm kiếm', path: '/search', icon: <Search /> },
    { label: 'Chính sách bảo hành', path: '/warranty', icon: <Security /> },
    { label: 'Giới thiệu shop', path: '/about', icon: <Info /> },
  ];

  const isMenuOpen = Boolean(anchorEl);

  const renderMobileMenu = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
        },
      }}
    >
      <Box sx={{ width: 280 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="div">
            Menu
          </Typography>
        </Box>
        <List>
          {navigationItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: isMobile ? 0 : 1,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
            onClick={() => navigate('/')}
          >
            Fashion Store
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 4, flexWrap: 'wrap' }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 0.5,
                    my: 0.5,
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.875rem',
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={() => navigate('/cart')}>
              <Badge badgeContent={0} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <IconButton color="inherit" onClick={() => navigate('/wishlist')}>
              <Badge badgeContent={0} color="error">
                <Favorite />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar
                    sx={{ width: 32, height: 32 }}
                    src={user?.avatar}
                    alt={user?.full_name}
                  >
                    {user?.full_name?.charAt(0)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Hồ sơ</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cài đặt</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Đăng xuất</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  variant="outlined"
                  sx={{ borderColor: 'white', color: 'white' }}
                >
                  Đăng nhập
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/register')}
                  variant="contained"
                  sx={{ backgroundColor: 'white', color: '#1976d2' }}
                >
                  Đăng ký
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </>
  );
};
