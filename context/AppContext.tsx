import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Table, Product, Role, OrderItem, OrderItemStatus, SalesReport } from '../types';
import { INITIAL_PRODUCTS, INITIAL_TABLES } from '../constants';

interface AppContextType {
  userRole: Role;
  setUserRole: (role: Role) => void;
  tables: Table[];
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  openTable: (tableId: number) => void;
  addItemToTable: (tableId: number, item: Omit<OrderItem, 'id' | 'timestamp' | 'status'>) => void;
  updateItemStatus: (tableId: number, itemId: string, status: OrderItemStatus) => void;
  removeItemFromTable: (tableId: number, itemId: string) => void;
  closeTableAccount: (tableId: number, paymentMethod: 'CASH' | 'CARD' | 'PIX') => void;
  salesReport: SalesReport[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [userRole, setUserRole] = useState<Role>(Role.NONE);
  
  // Load initial state from local storage or constants
  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('amorim_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('amorim_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [salesReport, setSalesReport] = useState<SalesReport[]>(() => {
    const saved = localStorage.getItem('amorim_sales');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('amorim_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('amorim_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('amorim_sales', JSON.stringify(salesReport));
  }, [salesReport]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const openTable = (tableId: number) => {
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, status: 'occupied', openTime: Date.now() } : t
    ));
  };

  const addItemToTable = (tableId: number, itemRaw: Omit<OrderItem, 'id' | 'timestamp' | 'status'>) => {
    const newItem: OrderItem = {
      ...itemRaw,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: OrderItemStatus.PENDING
    };

    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: t.status === 'available' ? 'occupied' : t.status,
          items: [...t.items, newItem],
          total: t.total + (newItem.price * newItem.quantity)
        };
      }
      return t;
    }));
  };

  const updateItemStatus = (tableId: number, itemId: string, status: OrderItemStatus) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          items: t.items.map(i => i.id === itemId ? { ...i, status } : i)
        };
      }
      return t;
    }));
  };

  const removeItemFromTable = (tableId: number, itemId: string) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        const itemToRemove = t.items.find(i => i.id === itemId);
        if (!itemToRemove) return t;
        return {
          ...t,
          items: t.items.filter(i => i.id !== itemId),
          total: t.total - (itemToRemove.price * itemToRemove.quantity)
        };
      }
      return t;
    }));
  };

  const closeTableAccount = (tableId: number, paymentMethod: 'CASH' | 'CARD' | 'PIX') => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      const newSale: SalesReport = {
        date: new Date().toISOString(),
        totalSales: table.total,
        paymentMethod
      };
      setSalesReport(prev => [...prev, newSale]);
      
      // Reset table
      setTables(prev => prev.map(t => 
        t.id === tableId ? { ...t, status: 'available', total: 0, items: [], openTime: undefined } : t
      ));
    }
  };

  return (
    <AppContext.Provider value={{
      userRole, setUserRole,
      tables, products,
      addProduct, updateProduct, deleteProduct,
      openTable, addItemToTable, updateItemStatus, removeItemFromTable, closeTableAccount,
      salesReport
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};