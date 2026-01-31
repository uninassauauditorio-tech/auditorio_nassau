import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, useUser, SignedIn, SignedOut } from '@clerk/clerk-react';

import logo from '../assets/img/logo.png';

const Header: React.FC = () => {
  const location = useLocation();
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 no-print bg-white/30 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img src={logo} alt="UNINASSAU" className="h-16 md:h-20 w-auto object-contain drop-shadow-sm" />
        </Link>

        <nav className="flex items-center gap-2">
          <SignedIn>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === '/admin'
                ? 'bg-primary-light text-primary'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Painel
            </Link>
            <Link
              to="/checkin"
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === '/checkin'
                ? 'bg-primary-light text-primary'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Check-in
            </Link>
            <div className="ml-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <Link
              to="/admin"
              className="flex items-center gap-2 text-gray-400 hover:text-primary px-3 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-tighter"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
              Administração
            </Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
};

export default Header;
