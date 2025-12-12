import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Products State
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [
      { id: uuidv4(), name: "Whey Protein Isolate", quantity: 50, price: 89.99, category: "Supplements", dateAdded: new Date().toISOString(), description: "High quality whey protein for muscle recovery.", image: "https://via.placeholder.com/150", status: "Published" },
      { id: uuidv4(), name: "Yoga Mat Premium", quantity: 8, price: 29.99, category: "Equipment", dateAdded: new Date(Date.now() - 86400000).toISOString(), description: "Non-slip yoga mat for all levels.", image: "https://via.placeholder.com/150", status: "Published" },
      { id: uuidv4(), name: "Dumbbell Set (20kg)", quantity: 15, price: 149.99, category: "Equipment", dateAdded: new Date(Date.now() - 172800000).toISOString(), description: "Adjustable dumbbell set for home workouts.", image: "https://via.placeholder.com/150", status: "Draft" },
      { id: uuidv4(), name: "Running Shoes", quantity: 25, price: 120.00, category: "Apparel", dateAdded: new Date(Date.now() - 259200000).toISOString(), description: "Lightweight running shoes.", image: "https://via.placeholder.com/150", status: "Published" },
      { id: uuidv4(), name: "Resistance Bands", quantity: 100, price: 15.99, category: "Accessories", dateAdded: new Date(Date.now() - 345600000).toISOString(), description: "Set of 5 resistance bands.", image: "https://via.placeholder.com/150", status: "Published" },
    ];
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [
      { id: uuidv4(), productId: "1", productName: "Whey Protein Isolate", quantity: 1, customerName: "John Doe", status: "Completed", date: new Date().toISOString(), price: 89.99, totalPrice: 89.99 },
      { id: uuidv4(), productId: "2", productName: "Yoga Mat Premium", quantity: 2, customerName: "Jane Smith", status: "Pending", date: new Date(Date.now() - 3600000).toISOString(), price: 29.99, totalPrice: 59.98 },
      { id: uuidv4(), productId: "3", productName: "Dumbbell Set (20kg)", quantity: 1, customerName: "Mike Johnson", status: "Processing", date: new Date(Date.now() - 7200000).toISOString(), price: 149.99, totalPrice: 149.99 },
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

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

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

  const addProduct = (product) => {
    const newProduct = { ...product, id: uuidv4(), dateAdded: new Date().toISOString() };
    setProducts([newProduct, ...products]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // ============================================================================
  // ORDER ACTIONS
  // ============================================================================

  const addOrder = (newOrder) => {
    setOrders([...orders, { ...newOrder, id: uuidv4(), date: new Date().toISOString() }]);
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
