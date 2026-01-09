
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import logo from '../assets/img/logo.png';

interface HeaderProps {
  isAdmin: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50 no-print">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img src={logo} alt="UNINASSAU" className="h-12 md:h-14 w-auto object-contain" />
        </Link>

        <nav className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === '/admin'
                  ? 'bg-primary-light text-primary'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Painel
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-500 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="flex items-center gap-2 text-gray-400 hover:text-primary px-3 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-tighter"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
              Administração
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
