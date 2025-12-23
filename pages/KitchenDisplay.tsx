import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { OrderItemStatus } from '../types';
import { CheckCircle, Clock, Flame, ChefHat } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const KitchenDisplay = () => {
  const { tables, updateItemStatus } = useApp();

  const activeItems = useMemo(() => {
    const items: Array<{ tableId: number; item: any }> = [];
    tables.forEach(table => {
      table.items.forEach(item => {
        if (item.status !== OrderItemStatus.DELIVERED) {
          items.push({ tableId: table.id, item });
        }
      });
    });
    return items.sort((a, b) => a.item.timestamp - b.item.timestamp);
  }, [tables]);

  const handleStatusChange = (tableId: number, itemId: string, currentStatus: OrderItemStatus) => {
    let nextStatus = currentStatus;
    if (currentStatus === OrderItemStatus.PENDING) nextStatus = OrderItemStatus.PREPARING;
    else if (currentStatus === OrderItemStatus.PREPARING) nextStatus = OrderItemStatus.READY;
    else if (currentStatus === OrderItemStatus.READY) nextStatus = OrderItemStatus.DELIVERED;
    
    updateItemStatus(tableId, itemId, nextStatus);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <div className="flex justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-md sticky top-6 z-20 shadow-2xl">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg shadow-lg shadow-orange-500/20">
             <ChefHat className="text-white" size={32} />
          </div>
          <span className="tracking-tight">KDS Cozinha</span>
        </h1>
        <div className="flex gap-6 text-sm font-semibold bg-slate-900/80 p-2 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 px-3"><div className="w-3 h-3 bg-slate-500 rounded-full shadow-[0_0_10px_rgba(100,116,139,0.5)]"></div> Pendente</div>
          <div className="flex items-center gap-2 px-3"><div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div> Preparando</div>
          <div className="flex items-center gap-2 px-3"><div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div> Pronto</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {activeItems.map(({ tableId, item }) => (
          <div 
            key={item.id} 
            className={`
              group rounded-2xl p-5 shadow-xl border relative flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:-translate-y-1
              ${item.status === OrderItemStatus.PENDING ? 'bg-slate-800 border-l-4 border-l-slate-400 border-slate-700/50' : ''}
              ${item.status === OrderItemStatus.PREPARING ? 'bg-slate-800 border-l-4 border-l-blue-500 border-blue-900/30 shadow-blue-900/20' : ''}
              ${item.status === OrderItemStatus.READY ? 'bg-emerald-900/20 border-l-4 border-l-emerald-500 border-emerald-900/30 shadow-emerald-900/20' : ''}
            `}
          >
            <div>
              <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-2">
                <span className="text-2xl font-black tracking-tighter">Mesa {tableId}</span>
                <span className="text-xs text-slate-400 font-mono bg-slate-900/50 px-2 py-1 rounded flex items-center gap-1">
                  <Clock size={12} />
                  {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: ptBR })}
                </span>
              </div>
              
              <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-orange-400">{item.quantity}x</span>
                    <h3 className="text-lg font-bold leading-tight text-white">{item.productName}</h3>
                  </div>
                  {item.observation && (
                    <div className="mt-3 bg-yellow-900/30 text-yellow-200 text-sm p-3 rounded-lg border border-yellow-700/30 italic">
                      ⚠️ {item.observation}
                    </div>
                  )}
              </div>
            </div>
            
            <button
              onClick={() => handleStatusChange(tableId, item.id, item.status)}
              className={`
                mt-auto w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 active:shadow-none
                ${item.status === OrderItemStatus.PENDING ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50' : ''}
                ${item.status === OrderItemStatus.PREPARING ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50' : ''}
                ${item.status === OrderItemStatus.READY ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600' : ''}
              `}
            >
              {item.status === OrderItemStatus.PENDING && 'Iniciar Preparo'}
              {item.status === OrderItemStatus.PREPARING && 'Marcar Pronto'}
              {item.status === OrderItemStatus.READY && <><CheckCircle size={18}/> Entregar</>}
            </button>
          </div>
        ))}

        {activeItems.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-slate-600 py-32">
            <div className="bg-slate-800 p-6 rounded-full mb-4">
                <Flame size={64} className="text-slate-700" />
            </div>
            <h2 className="text-3xl font-bold">Cozinha em dia!</h2>
            <p className="text-slate-500 mt-2">Aguardando novos pedidos...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;