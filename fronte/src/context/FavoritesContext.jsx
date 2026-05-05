import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FavoritesContext = createContext();

const favReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE':
      const exists = state.items.find(i => i._id === action.payload._id);
      return {
        items: exists
          ? state.items.filter(i => i._id !== action.payload._id)
          : [...state.items, action.payload],
      };
    case 'REMOVE':
      return { items: state.items.filter(i => i._id !== action.payload) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favReducer, { items: [] }, () => {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : { items: [] };
    } catch { return { items: [] }; }
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(state));
  }, [state]);

  const toggleFavorite = (product) => dispatch({ type: 'TOGGLE', payload: product });
  const removeFavorite = (id) => dispatch({ type: 'REMOVE', payload: id });
  const isFavorite = (id) => state.items.some(i => i._id === id);
  const clearFavorites = () => dispatch({ type: 'CLEAR' });

  return (
    <FavoritesContext.Provider value={{
      favorites: state.items,
      totalFavorites: state.items.length,
      toggleFavorite,
      removeFavorite,
      isFavorite,
      clearFavorites,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
};