
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="size-8 md:size-10 bg-primary rounded-lg md:rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-dark transition-colors">
            <span className="material-symbols-outlined text-white text-xl md:text-2xl">
              school
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base md:text-lg font-black text-gray-900 tracking-tight leading-none uppercase">UNINASSAU</h1>
            <span className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest">Eventos Auditório</span>
          </div>
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
