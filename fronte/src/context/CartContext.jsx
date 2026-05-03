import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.product === action.payload.product);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.product === action.payload.product
              ? { ...i, quantity: Math.min(i.quantity + action.payload.quantity, action.payload.stock) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.product !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.product === action.payload.id ? { ...i, quantity: action.payload.qty } : i
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : { items: [] };
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        stock: product.stock,
        quantity,
      },
    });
  };

  const removeFromCart = (productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart: state, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);