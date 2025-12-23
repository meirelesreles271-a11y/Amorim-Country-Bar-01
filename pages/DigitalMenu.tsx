import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory, Role } from '../types';
import { LogOut, Star, Flame } from 'lucide-react';
import { LOGO_URL } from '../constants';

const DigitalMenu = () => {
  const { products, setUserRole } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', ...Object.values(ProductCategory)];
  
  const filteredProducts = products.filter(p => {
    if (!p.available) return false;
    if (selectedCategory === 'Todos') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 relative font-sans">
      {/* Fixed Exit Button with better style */}
      <button 
        onClick={() => setUserRole(Role.NONE)}
        className="fixed top-5 right-5 z-50 bg-gray-900/80 hover:bg-black text-white p-3 rounded-full transition-all backdrop-blur-md shadow-2xl border border-white/10 active:scale-95"
        title="Sair do Cardápio"
      >
        <LogOut size={20} />
      </button>

      {/* Hero Header */}
      <div className="relative h-72 bg-wood-900 rounded-b-[40px] overflow-hidden shadow-2xl mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=2535&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center text-center md:items-start md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Aberto Agora</span>
            <div className="flex text-yellow-400">
               <Star size={14} fill="currentColor" />
               <Star size={14} fill="currentColor" />
               <Star size={14} fill="currentColor" />
               <Star size={14} fill="currentColor" />
               <Star size={14} fill="currentColor" />
            </div>
          </div>
          
          {/* Logo in Header */}
          <div className="w-full flex justify-center md:justify-start">
             <img 
              src={LOGO_URL} 
              alt="Amorim Country Bar" 
              className="h-32 object-contain mix-blend-screen filter brightness-110 contrast-125 mb-2"
             />
          </div>
          
          <p className="text-gray-300 font-medium text-lg max-w-md">Música boa, cerveja gelada e comida de verdade.</p>
        </div>
      </div>

      {/* Category Pills - Sticky */}
      <div className="sticky top-0 z-40 bg-gray-50/95 backdrop-blur-sm py-4 mb-2 shadow-sm">
        <div className="px-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all transform active:scale-95
                  ${selectedCategory === cat 
                    ? 'bg-brand-600 text-white shadow-brand-500/40 shadow-lg' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300 hover:text-brand-600 shadow-sm'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="group bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100 hover:border-brand-200 hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={product.imageUrl || 'https://via.placeholder.com/300?text=Sem+Imagem'} 
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                {product.category}
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-xl leading-tight group-hover:text-brand-600 transition-colors">{product.name}</h3>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                   <span className="text-xs text-gray-400 font-semibold uppercase">Preço</span>
                   <div className="text-2xl font-black text-gray-900">R$ {product.price.toFixed(2)}</div>
                </div>
                <button className="bg-gray-900 text-white p-3 rounded-2xl hover:bg-brand-600 transition-colors shadow-lg active:scale-95">
                  <Flame size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
              <LogOut size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">Nenhum item encontrado nesta categoria.</p>
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center py-8 border-t bg-white">
        <p className="text-sm text-gray-400 font-medium">© Amorim Country Bar - Cardápio Digital</p>
      </div>
    </div>
  );
};

export default DigitalMenu;