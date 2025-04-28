import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = ({ title, isMobile }) => {
  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <h1 className={`text-xl font-bold ${isMobile ? 'ml-8' : ''}`}>{title}</h1>
        
        <div className="flex items-center space-x-3">
          {/* Barra de pesquisa rápida */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="pl-10 pr-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            />
          </div>
          
          {/* Botão de notificações */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Avatar do usuário */}
          <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <User size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;