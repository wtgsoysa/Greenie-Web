import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getCartFromStorage,
  saveCartToStorage,
  calculateCartTotal,
  calculateItemsCount,
} from '../hooks/useCartUtils';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Load cart from localStorage
  useEffect(() => {
    setCartItems(getCartFromStorage());
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const addToCart = (product, quantity) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.productID === product.productID,
      );

      if (existingItem) {
        // Check if adding quantity exceeds available stock
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.quantity) {
          setNotificationMessage(`Only ${product.quantity} items available`);
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
          return prev;
        }

        return prev.map((item) =>
          item.productID === product.productID
            ? { ...item, quantity: newQuantity }
            : item,
        );
      }

      // Check if initial quantity exceeds available stock
      if (quantity > product.quantity) {
        setNotificationMessage(`Only ${product.quantity} items available`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return prev;
      }

      return [...prev, { ...product, quantity }];
    });

    setNotificationMessage(`${product.productName} added to cart`);
    setShowNotification(true);
    setIsCartOpen(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productID !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prev) => {
      const item = prev.find((item) => item.productID === productId);
      if (!item) return prev;

      // Check if new quantity exceeds available stock
      if (newQuantity > item.quantity) {
        setNotificationMessage(`Only ${item.quantity} items available`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return prev;
      }

      return prev.map((item) =>
        item.productID === productId
          ? { ...item, quantity: newQuantity }
          : item,
      );
    });
  };

  const getCartTotal = () => calculateCartTotal(cartItems);
  const getCartItemsCount = () => calculateItemsCount(cartItems);

  const value = {
    cartItems,
    isCartOpen,
    showNotification,
    notificationMessage,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Move hook to a separate export
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;
