import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PenLine, Tv, Archive } from 'lucide-react';
import { cn } from '../lib/utils';

export const BottomNav: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Beranda', path: '/' },
    { icon: PenLine, label: 'Tulis', path: '/write' },
    { icon: Tv, label: 'Mimbar', path: '/mimbar' },
    { icon: Archive, label: 'Arsip', path: '/archive' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-indigo-600" : "text-gray-500"
              )
            }
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
