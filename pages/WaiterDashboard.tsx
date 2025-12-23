import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table, Product, OrderItemStatus } from '../types';
import { Search, Plus, Trash2, Clock, ChevronLeft, ArrowRight, UtensilsCrossed, Receipt } from 'lucide-react';
import { LOGO_URL } from '../constants';

const WaiterDashboard = () => {
  const { tables, products, openTable, addItemToTable, removeItemFromTable } = useApp();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingItems, setIsAddingItems] = useState(false);

  // Filter products for search
  const filteredProducts = products.filter(p => 
    p.available && p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = (product: Product) => {
    if (!selectedTable) return;
    addItemToTable(selectedTable.id, {
      productId: product.id,
      productName: product.name,
      quantity: 1,
      price: product.price
    });
    setIsAddingItems(false);
  };

  // If a table is selected, find the latest version from context
  const activeTable = selectedTable ? tables.find(t => t.id === selectedTable.id) : null;

  return (
    <div className="h-full flex flex-col bg-gray-100 font-sans">
      {/* Header - Now Dark to support the Logo */}
      <div className="bg-gray-900 text-white px-6 py-3 shadow-md border-b border-gray-800 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {activeTable && (
            <button 
              onClick={() => setSelectedTable(null)} 
              className="p-2 -ml-2 hover:bg-gray-800 rounded-full text-gray-300 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="flex flex-col">
             <h2 className="text-xl font-bold tracking-tight text-white leading-none">
                {activeTable ? `Mesa ${activeTable.id}` : 'Salão'}
             </h2>
             <span className="text-xs text-gray-400 font-medium">
                {activeTable ? 'Atendimento' : 'Visão Geral'}
             </span>
          </div>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img 
                src={LOGO_URL} 
                alt="Logo" 
                className="h-12 object-contain mix-blend-screen opacity-90 filter brightness-110 contrast-125"
            />
        </div>

        {/* Right Actions/Info */}
        {activeTable ? (
            <div className="text-right bg-gray-800/50 px-3 py-1 rounded-lg border border-gray-700">
                <span className="text-[10px] text-gray-400 uppercase font-bold block leading-none mb-1">Total</span>
                <div className="text-lg font-black text-brand-500 leading-none">R$ {activeTable.total.toFixed(2)}</div>
            </div>
        ) : (
            <div className="w-8"></div> // Spacer to balance layout
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-texture">
        {!activeTable ? (
          // Tables Grid
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-20">
            {tables.map(table => (
              <button
                key={table.id}
                onClick={() => {
                   if (table.status === 'available') openTable(table.id);
                   setSelectedTable(table);
                }}
                className={`
                  relative group flex flex-col justify-between h-32 rounded-2xl p-4 transition-all duration-300 shadow-sm border
                  ${table.status === 'occupied' 
                    ? 'bg-white border-brand-500 shadow-brand-100 ring-1 ring-brand-100' 
                    : 'bg-white border-gray-200 hover:border-brand-300 hover:shadow-md'}
                  ${table.status === 'closing' ? 'bg-yellow-50 border-yellow-400 ring-1 ring-yellow-200' : ''}
                `}
              >
                <div className="flex justify-between items-start w-full">
                    <span className={`text-2xl font-black ${table.status === 'occupied' ? 'text-gray-800' : 'text-gray-400'}`}>
                        {table.id}
                    </span>
                    <span className={`w-3 h-3 rounded-full ${table.status === 'occupied' ? 'bg-red-500 animate-pulse' : 'bg-green-400'}`}></span>
                </div>

                <div className="text-left w-full">
                    {table.status === 'occupied' ? (
                        <>
                         <span className="text-xs text-gray-400 font-semibold uppercase">Consumo</span>
                         <div className="text-lg font-bold text-brand-600">R$ {table.total.toFixed(2)}</div>
                        </>
                    ) : (
                        <div className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                            <UtensilsCrossed size={14} /> Livre
                        </div>
                    )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Active Table Details
          <div className="max-w-3xl mx-auto h-full flex flex-col pb-20">
            
            {/* Action Bar */}
            <div className="grid grid-cols-1 gap-4 mb-6">
                 <button 
                  onClick={() => setIsAddingItems(true)}
                  className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <Plus className="bg-brand-500 rounded-full p-1 text-white" size={28} /> 
                  Adicionar Produto
                </button>
            </div>

            {/* Order History Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex-1 flex flex-col overflow-hidden">
              <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex items-center gap-2">
                 <Receipt size={20} className="text-gray-400" />
                 <span className="font-bold text-gray-700">Comanda Digital</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                  {activeTable.items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300">
                        <UtensilsCrossed size={48} className="mb-2 opacity-20" />
                        <p>Nenhum pedido realizado.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeTable.items.slice().reverse().map(item => (
                        <div key={item.id} className="group p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-300 shadow-sm flex justify-between items-center transition-all">
                          <div>
                            <div className="font-bold text-gray-800 text-lg">{item.productName}</div>
                            <div className="text-sm text-gray-500 font-medium">
                              {item.quantity}un x R$ {item.price.toFixed(2)}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {/* Status Pill */}
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1
                              ${item.status === OrderItemStatus.PENDING ? 'bg-gray-100 text-gray-600 border-gray-200' : ''}
                              ${item.status === OrderItemStatus.PREPARING ? 'bg-orange-50 text-orange-600 border-orange-200' : ''}
                              ${item.status === OrderItemStatus.READY ? 'bg-green-50 text-green-600 border-green-200' : ''}
                              ${item.status === OrderItemStatus.DELIVERED ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                            `}>
                              {item.status === OrderItemStatus.PENDING && <Clock size={12} />}
                              {item.status === OrderItemStatus.PENDING ? 'Aguardando' : 
                               item.status === OrderItemStatus.PREPARING ? 'Preparando' :
                               item.status === OrderItemStatus.READY ? 'Pronto' : 'Entregue'}
                            </div>

                            {/* Delete Action */}
                            {item.status === OrderItemStatus.PENDING && (
                              <button 
                                onClick={() => removeItemFromTable(activeTable.id, item.id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Total da Mesa</span>
                    <span className="text-3xl font-black text-brand-600">R$ {activeTable.total.toFixed(2)}</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {isAddingItems && activeTable && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg h-[85vh] sm:h-[700px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
              <div>
                  <h3 className="font-bold text-xl text-gray-800">Novo Pedido</h3>
                  <span className="text-sm text-gray-500">Mesa {activeTable.id}</span>
              </div>
              <button onClick={() => setIsAddingItems(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">Cancelar</button>
            </div>
            
            <div className="p-4 bg-white sticky top-0 z-10">
              <div className="relative group">
                <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Buscar bebida ou prato..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 border-transparent border-2 focus:border-brand-500 focus:bg-white rounded-xl focus:outline-none transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-3">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleAddItem(product)}
                    className="w-full flex items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-brand-500 hover:shadow-md transition-all text-left group"
                  >
                     <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                       {product.imageUrl && <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />}
                     </div>
                     <div className="ml-4 flex-1">
                       <div className="font-bold text-gray-800 group-hover:text-brand-600 transition-colors">{product.name}</div>
                       <div className="text-gray-500 text-xs line-clamp-1 mb-1">{product.description}</div>
                       <div className="font-bold text-brand-600">R$ {product.price.toFixed(2)}</div>
                     </div>
                     <div className="bg-gray-100 group-hover:bg-brand-500 group-hover:text-white p-2 rounded-lg transition-colors">
                        <Plus size={20} />
                     </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaiterDashboard;