import React, { createContext, useState, useEffect } from 'react';

import axiosInstance from '../utils/axiosConfig';
import { useToast } from './ToastContext';


export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { showToast } = useToast();
  // Products State
  const [products, setProducts] = useState([]);

  // Orders State
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [
      { id: "1", productId: "1", productName: "Whey Protein Isolate", quantity: 1, customerName: "John Doe", status: "Completed", date: new Date().toISOString(), price: 89.99, totalPrice: 89.99 },
      { id: "2", productId: "2", productName: "Yoga Mat Premium", quantity: 2, customerName: "Jane Smith", status: "Pending", date: new Date(Date.now() - 3600000).toISOString(), price: 29.99, totalPrice: 59.98 },
      { id: "3", productId: "3", productName: "Dumbbell Set (20kg)", quantity: 1, customerName: "Mike Johnson", status: "Processing", date: new Date(Date.now() - 7200000).toISOString(), price: 149.99, totalPrice: 149.99 },
    ];
  });

  // Cart State - Persisted to localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('store_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Wishlist State - Persisted to localStorage
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('store_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/stores/my-items');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Allow components to manually refresh products
  useEffect(() => {
    // Optional: We can leave this empty or remove it if we only want manual fetching.
    // The user requested to remove the automatic call "any page".
    // So we do NOT call fetchProducts() here.
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('store_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // ============================================================================
  // PRODUCT ACTIONS
  // ============================================================================

  const addProduct = async (product) => {
    try {
      // axiosInstance automatically sends data as JSON and includes auth token
      const response = await axiosInstance.post('/api/stores/items', product);

      const newProduct = response.data;
      setProducts([newProduct, ...products]);
      showToast("Product added successfully", { type: "success" });
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      showToast("Failed to add product", { type: "error" });
      throw error;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      // axiosInstance automatically sends data as JSON and includes auth token
      const response = await axiosInstance.put(`/api/stores/items/${id}`, updatedProduct);

      const updated = response.data;
      setProducts(products.map(p => p.id === id ? updated : p));
      showToast("Product updated successfully", { type: "success" });
      return updated;
    } catch (error) {
      console.error('Error updating product:', error);
      showToast("Failed to update product", { type: "error" });
      throw error;
    }
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // ============================================================================
  // ORDER ACTIONS
  // ============================================================================

  const addOrder = (newOrder) => {
    // Generate sequential ID based on current max ID
    const maxId = orders.reduce((max, o) => Math.max(max, parseInt(o.id) || 0), 0);
    const newId = (maxId + 1).toString();
    setOrders([...orders, { ...newOrder, id: newId, date: new Date().toISOString() }]);
  };

  const updateOrder = (id, updatedOrder) => {
    setOrders(orders.map(o => o.id === id ? { ...o, ...updatedOrder } : o));
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  // ============================================================================
  // CART ACTIONS
  // ============================================================================

  /**
   * Add a product to the cart
   * If product already exists, increment quantity
   * @param {Object} product - Product to add
   * @param {number} quantityToAdd - Quantity to add (default: 1)
   */
  const addToCart = (product, quantityToAdd = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        // Increment quantity if item already in cart
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + quantityToAdd }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, cartQuantity: quantityToAdd }];
      }
    });
  };

  /**
   * Remove a product from the cart completely
   * @param {string} productId - ID of product to remove
   */
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  /**
   * Update the quantity of a product in the cart
   * @param {string} productId - ID of product to update
   * @param {number} newQuantity - New quantity (removes item if <= 0)
   */
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, cartQuantity: newQuantity }
          : item
      )
    );
  };

  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    setCart([]);
  };

  /**
   * Get total number of items in cart
   * @returns {number} Total item count
   */
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0);
  };

  /**
   * Get total price of all items in cart
   * @returns {number} Total price
   */
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  // ============================================================================
  // WISHLIST ACTIONS
  // ============================================================================

  /**
   * Add a product to the wishlist
   * @param {Object} product - Product to add
   */
  const addToWishlist = (product) => {
    setWishlist(prevWishlist => {
      const exists = prevWishlist.find(item => item.id === product.id);
      if (!exists) {
        return [...prevWishlist, product];
      }
      return prevWishlist;
    });
  };

  /**
   * Remove a product from the wishlist
   * @param {string} productId - ID of product to remove
   */
  const removeFromWishlist = (productId) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
  };

  /**
   * Toggle a product in/out of wishlist
   * @param {Object} product - Product to toggle
   */
  const toggleWishlist = (product) => {
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  /**
   * Check if a product is in the wishlist
   * @param {string} productId - ID of product to check
   * @returns {boolean} True if product is in wishlist
   */
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <StoreContext.Provider value={{
      // State
      products,
      orders,
      cart,
      wishlist,
      // Product Actions
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      // Order Actions
      addOrder,
      updateOrderStatus,
      updateOrder,
      deleteOrder,
      // Cart Actions
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartItemCount,
      getCartTotal,
      // Wishlist Actions
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </StoreContext.Provider>
  );
};
