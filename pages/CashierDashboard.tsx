import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table, SalesReport } from '../types';
import { DollarSign, LayoutGrid, FileText, CreditCard, Banknote, Smartphone, X, TrendingUp } from 'lucide-react';
import AdminProducts from './AdminProducts';
import { LOGO_URL } from '../constants';

const CashierDashboard = () => {
  const { tables, closeTableAccount, salesReport } = useApp();
  const [activeTab, setActiveTab] = useState<'pos' | 'reports' | 'products'>('pos');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  const tableToCheckOut = selectedTableId ? tables.find(t => t.id === selectedTableId) : null;
  const totalSalesToday = salesReport.reduce((acc, curr) => acc + curr.totalSales, 0);

  const handleCheckout = (method: 'CASH' | 'CARD' | 'PIX') => {
    if (selectedTableId) {
      closeTableAccount(selectedTableId, method);
      setSelectedTableId(null);
    }
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden font-sans">
      {/* Modern Sidebar */}
      <div className="w-72 bg-gray-900 text-white flex flex-col z-20 shadow-2xl">
        <div className="p-8 flex flex-col items-center text-center">
          <img 
            src={LOGO_URL} 
            alt="Amorim Logo" 
            className="w-32 mb-4 object-contain mix-blend-screen filter brightness-110 contrast-125"
          />
          <h1 className="text-xl font-black text-brand-500 tracking-tight">CAIXA POS</h1>
          <p className="text-gray-500 text-xs mt-1">Gestão Financeira</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-3">
          <button 
            onClick={() => setActiveTab('pos')}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group
              ${activeTab === 'pos' 
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            <LayoutGrid size={22} className={activeTab === 'pos' ? 'text-white' : 'text-gray-500 group-hover:text-white'} /> 
            <span className="font-bold">Mesas</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group
              ${activeTab === 'reports' 
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            <FileText size={22} className={activeTab === 'reports' ? 'text-white' : 'text-gray-500 group-hover:text-white'} /> 
            <span className="font-bold">Relatórios</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group
              ${activeTab === 'products' 
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            <DollarSign size={22} className={activeTab === 'products' ? 'text-white' : 'text-gray-500 group-hover:text-white'} /> 
            <span className="font-bold">Produtos</span>
          </button>
        </nav>

        <div className="p-6 m-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-inner">
           <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
             <TrendingUp size={14} className="text-green-400" /> Faturamento Hoje
           </div>
           <div className="text-3xl font-black text-white">R$ {totalSalesToday.toFixed(2)}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-texture">
        {activeTab === 'pos' && (
          <div className="p-10">
            <header className="mb-10">
               <h2 className="text-3xl font-bold text-gray-800">Visão Geral</h2>
               <p className="text-gray-500">Gerencie mesas abertas e pagamentos.</p>
            </header>
            
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
              {tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => table.total > 0 && setSelectedTableId(table.id)}
                  disabled={table.total === 0}
                  className={`
                    relative h-40 rounded-3xl flex flex-col items-center justify-center border transition-all duration-300 group
                    ${table.total > 0 
                      ? 'bg-white border-brand-500/50 shadow-xl shadow-gray-200/50 hover:-translate-y-1 hover:shadow-2xl hover:border-brand-500 cursor-pointer' 
                      : 'bg-gray-50 border-gray-200 opacity-60 cursor-default'}
                  `}
                >
                  <span className={`text-4xl font-black ${table.total > 0 ? 'text-gray-800' : 'text-gray-300'}`}>
                    {table.id}
                  </span>
                  {table.total > 0 ? (
                    <div className="mt-3 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-bold border border-brand-100 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                       R$ {table.total.toFixed(2)}
                    </div>
                  ) : (
                    <span className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Livre</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-10">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Histórico de Transações</h2>
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-5 font-bold text-gray-500 text-sm uppercase tracking-wider">Data/Hora</th>
                    <th className="p-5 font-bold text-gray-500 text-sm uppercase tracking-wider">Pagamento</th>
                    <th className="p-5 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {salesReport.slice().reverse().map((sale, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 text-gray-700 font-medium">{new Date(sale.date).toLocaleString()}</td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wide
                          ${sale.paymentMethod === 'PIX' ? 'bg-green-100 text-green-700' : 
                            sale.paymentMethod === 'CARD' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                          {sale.paymentMethod === 'PIX' && <Smartphone size={12} />}
                          {sale.paymentMethod === 'CARD' && <CreditCard size={12} />}
                          {sale.paymentMethod === 'CASH' && <Banknote size={12} />}
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="p-5 text-right font-mono font-bold text-gray-900">R$ {sale.totalSales.toFixed(2)}</td>
                    </tr>
                  ))}
                  {salesReport.length === 0 && (
                    <tr><td colSpan={3} className="p-10 text-center text-gray-400">Nenhuma venda registrada hoje.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="p-4">
            <AdminProducts />
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {tableToCheckOut && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-brand-500 to-orange-600 text-white flex justify-between items-center">
              <div>
                 <h3 className="text-xl font-bold">Fechar Conta</h3>
                 <span className="text-brand-100 text-sm">Mesa {tableToCheckOut.id}</span>
              </div>
              <button onClick={() => setSelectedTableId(null)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X /></button>
            </div>
            
            <div className="p-6 max-h-[300px] overflow-y-auto bg-gray-50/50">
              <h4 className="font-bold text-gray-500 mb-4 text-xs uppercase tracking-wider">Itens do Consumo</h4>
              <div className="space-y-3">
                {tableToCheckOut.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <span className="font-medium text-gray-700"><span className="font-bold text-brand-500">{item.quantity}x</span> {item.productName}</span>
                    <span className="font-mono font-bold text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t bg-white">
              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-500 font-medium">Total Final</span>
                <span className="text-4xl font-black text-gray-900 tracking-tight">R$ {tableToCheckOut.total.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => handleCheckout('CASH')}
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border-2 border-transparent hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <Banknote className="mb-2 text-gray-400 group-hover:text-green-600" size={28} />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-green-700">DINHEIRO</span>
                </button>
                <button 
                  onClick={() => handleCheckout('PIX')}
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border-2 border-transparent hover:border-brand-500 hover:bg-brand-50 transition-all"
                >
                  <Smartphone className="mb-2 text-gray-400 group-hover:text-brand-600" size={28} />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-brand-700">PIX</span>
                </button>
                <button 
                  onClick={() => handleCheckout('CARD')}
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <CreditCard className="mb-2 text-gray-400 group-hover:text-blue-600" size={28} />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-blue-700">CARTÃO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierDashboard;