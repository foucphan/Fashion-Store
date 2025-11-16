import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '../types/cart';
import { cartService } from '../services/cartService';

interface CartState {
  items: CartItem[];
  total_items: number;
  total_amount: number;
  shipping_fee: number;
  discount_amount: number;
  final_amount: number;
  isLoading: boolean;
  error: string | null;
}

type CartAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM_OPTIMISTIC'; payload: { itemId: number; data: UpdateCartItemRequest } }
  | { type: 'REVERT_ITEM_UPDATE'; payload: number }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: CartState = {
  items: [],
  total_items: 0,
  total_amount: 0,
  shipping_fee: 0,
  discount_amount: 0,
  final_amount: 0,
  isLoading: false,
  error: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        total_items: action.payload.total_items,
        total_amount: action.payload.total_amount,
        shipping_fee: action.payload.shipping_fee,
        discount_amount: action.payload.discount_amount,
        final_amount: action.payload.final_amount,
        isLoading: false,
        error: null,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        total_items: state.total_items + action.payload.quantity,
        total_amount: state.total_amount + (action.payload.product?.price || 0) * action.payload.quantity,
        final_amount: state.total_amount + (action.payload.product?.price || 0) * action.payload.quantity,
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
        total_items: state.items.reduce((sum, item) => sum + item.quantity, 0),
        total_amount: state.items.reduce((sum, item) => 
          sum + (item.product?.price || 0) * item.quantity, 0
        ),
      };
    case 'UPDATE_ITEM_OPTIMISTIC':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.itemId 
            ? { 
                ...item, 
                quantity: action.payload.data.quantity,
                // Preserve all product information
                product: item.product,
                product_attribute: item.product_attribute
              }
            : item
        ),
        total_items: state.items.reduce((sum, item) => 
          sum + (item.id === action.payload.itemId ? action.payload.data.quantity : item.quantity), 0
        ),
        total_amount: state.items.reduce((sum, item) => 
          sum + (item.product?.price || 0) * (item.id === action.payload.itemId ? action.payload.data.quantity : item.quantity), 0
        ),
      };
    case 'REVERT_ITEM_UPDATE':
      // This would need the original item data, but for now just return state
      return state;
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total_items: state.items.filter(item => item.id !== action.payload).reduce((sum, item) => sum + item.quantity, 0),
        total_amount: state.items.filter(item => item.id !== action.payload).reduce((sum, item) => 
          sum + (item.product?.price || 0) * item.quantity, 0
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total_items: 0,
        total_amount: 0,
        final_amount: 0,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

const CartContext = createContext<{
  cart: CartState;
  addToCart: (item: AddToCartRequest) => Promise<void>;
  updateCartItem: (itemId: number, data: UpdateCartItemRequest) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: (force?: boolean) => Promise<void>;
  resetCart: () => void;
  forceRefreshCart: () => Promise<void>;
} | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const refreshCart = useCallback(async (force = false) => {
    try {
      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, setting empty cart');
        dispatch({ type: 'SET_CART', payload: { items: [], total_items: 0, total_amount: 0, shipping_fee: 0, discount_amount: 0, final_amount: 0 } });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      console.log('Refreshing cart...', force ? '(forced)' : '');
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Clear cache if forced
      if (force) {
        try {
          localStorage.removeItem('cart_cache');
          sessionStorage.removeItem('cart_cache');
        } catch (error) {
          console.log('Error clearing cache:', error);
        }
      }
      
      // Simple timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000); // Tăng timeout lên 5s
      });

      const cartPromise = cartService.getCart();
      
      const cartData = await Promise.race([cartPromise, timeoutPromise]) as Cart;
      
      console.log('Cart data received:', cartData);
      dispatch({ type: 'SET_CART', payload: cartData });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Cart refresh error:', error);
      // On error, show empty cart instead of error
      dispatch({ type: 'SET_CART', payload: { items: [], total_items: 0, total_amount: 0, shipping_fee: 0, discount_amount: 0, final_amount: 0 } });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Delay refresh to avoid race conditions
      const timer = setTimeout(() => {
        refreshCart();
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // No token, reset cart
      dispatch({ type: 'SET_CART', payload: { items: [], total_items: 0, total_amount: 0, shipping_fee: 0, discount_amount: 0, final_amount: 0 } });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []); // Remove refreshCart from dependencies to prevent infinite loop

  // Listen for storage changes (login/logout) and custom events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (e.newValue) {
          // User logged in, refresh cart
          setTimeout(() => refreshCart(true), 200);
        } else {
          // User logged out, reset cart
          dispatch({ type: 'SET_CART', payload: { items: [], total_items: 0, total_amount: 0, shipping_fee: 0, discount_amount: 0, final_amount: 0 } });
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    const handleAuthLogout = () => {
      console.log('CartContext: Received auth:logout event, resetting cart');
      dispatch({ type: 'SET_CART', payload: { items: [], total_items: 0, total_amount: 0, shipping_fee: 0, discount_amount: 0, final_amount: 0 } });
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth:logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []); // Remove refreshCart from dependencies

  const addToCart = async (item: AddToCartRequest) => {
    try {
      // Debug logging
      const token = localStorage.getItem('token');
      console.log('🛒 AddToCart - Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('🛒 AddToCart - Item:', item);
      console.log('🛒 AddToCart - User authenticated:', !!token);
      
      dispatch({ type: 'SET_LOADING', payload: true });
      const newItem = await cartService.addToCart(item);
      console.log('🛒 AddToCart - Success, new item:', newItem);
      dispatch({ type: 'ADD_ITEM', payload: newItem });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      
      console.error('❌ AddToCart error:', error);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error response data:', error.response?.data);
      
      if (error.response?.status === 401) {
        console.warn('🔐 Token expired - redirect will be handled by authService interceptor');
        dispatch({ type: 'SET_ERROR', payload: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Không thể thêm sản phẩm vào giỏ hàng' });
      }
      throw error;
    }
  };

  const updateCartItem = async (itemId: number, data: UpdateCartItemRequest) => {
    try {
      // Optimistic update - update local state immediately
      dispatch({ type: 'UPDATE_ITEM_OPTIMISTIC', payload: { itemId, data } });
      
      // Then sync with server
      const updatedItem = await cartService.updateCartItem(itemId, data);
      dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
    } catch (error) {
      // Revert optimistic update on error
      dispatch({ type: 'REVERT_ITEM_UPDATE', payload: itemId });
      dispatch({ type: 'SET_ERROR', payload: 'Không thể cập nhật giỏ hàng' });
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await cartService.removeFromCart(itemId);
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Không thể xóa sản phẩm khỏi giỏ hàng' });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Không thể xóa giỏ hàng' });
      throw error;
    }
  };

  const resetCart = () => {
    console.log('Resetting cart...');
    dispatch({ type: 'SET_CART', payload: { items: [], total_items: 0, total_amount: 0, shipping_fee: 0, discount_amount: 0, final_amount: 0 } });
    dispatch({ type: 'SET_LOADING', payload: false });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    // Clear any cached data
    try {
      localStorage.removeItem('cart_cache');
      sessionStorage.removeItem('cart_cache');
    } catch (error) {
      console.log('Error clearing cache:', error);
    }
  };

  const forceRefreshCart = async () => {
    console.log('Force refreshing cart...');
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await refreshCart(true);
    } catch (error) {
      console.error('Force refresh error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Lỗi khi refresh giỏ hàng' });
    }
  };

  const value = {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    resetCart,
    forceRefreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
