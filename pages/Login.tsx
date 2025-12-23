import React from 'react';
import { Role } from '../types';
import { useApp } from '../context/AppContext';
import { ChefHat, Smartphone, Monitor, User, Coffee, Music, Beer } from 'lucide-react';
import { LOGO_URL } from '../constants';

const Login = () => {
  const { setUserRole } = useApp();

  const roles = [
    { 
      role: Role.WAITER, 
      label: 'Garçom', 
      desc: 'Pedidos & Mesas',
      icon: <Smartphone size={32} />, 
      color: 'from-blue-500 to-blue-700',
      shadow: 'shadow-blue-500/30'
    },
    { 
      role: Role.KITCHEN, 
      label: 'Cozinha', 
      desc: 'Produção & KDS',
      icon: <ChefHat size={32} />, 
      color: 'from-red-500 to-red-700',
      shadow: 'shadow-red-500/30'
    },
    { 
      role: Role.CASHIER, 
      label: 'Caixa / Admin', 
      desc: 'Gestão & Pagamentos',
      icon: <Monitor size={32} />, 
      color: 'from-emerald-500 to-emerald-700',
      shadow: 'shadow-emerald-500/30'
    },
    { 
      role: Role.CUSTOMER, 
      label: 'Menu Digital', 
      desc: 'Cardápio para Clientes',
      icon: <Coffee size={32} />, 
      color: 'from-brand-500 to-brand-700',
      shadow: 'shadow-brand-500/30'
    },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-wood-900">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-wood-900 via-wood-900/80 to-wood-900/60"></div>

      <div className="relative z-10 w-full max-w-5xl px-4">
        
        {/* Header with Logo */}
        <div className="text-center mb-16 space-y-4 flex flex-col items-center">
          {/* 
             mix-blend-screen makes the black background of the logo transparent 
             when placed over the dark background, leaving only the gold/yellow parts visible.
          */}
          <img 
            src={LOGO_URL} 
            alt="Amorim Country Bar" 
            className="h-64 object-contain mix-blend-screen drop-shadow-2xl filter brightness-110 contrast-125"
          />
          <p className="text-xl text-gray-300 font-light tracking-wide -mt-4">Sistema Integrado de Gestão e Atendimento</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => setUserRole(r.role)}
              className={`
                group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 
                hover:border-white/30 transition-all duration-300 hover:transform hover:-translate-y-2
                backdrop-blur-md ${r.shadow} hover:shadow-2xl
              `}
            >
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${r.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

              <div className="relative flex flex-col items-center text-center h-full">
                <div className={`
                  mb-6 p-4 rounded-2xl bg-gradient-to-br ${r.color} text-white shadow-lg
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {r.icon}
                </div>
                
                <span className="text-2xl font-bold text-white mb-2 group-hover:text-brand-100 transition-colors">
                  {r.label}
                </span>
                <span className="text-sm text-gray-400 group-hover:text-gray-300">
                  {r.desc}
                </span>
                
                {/* Decoration Arrow */}
                <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white/50">
                  Acessar &rarr;
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Amorim Country Bar POS. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;