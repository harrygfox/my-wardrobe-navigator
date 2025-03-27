
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-gray-100 animate-fade-in">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/">
            <h1 className="font-heading text-2xl md:text-3xl tracking-tight text-brand-primary">
              My Closet
            </h1>
          </Link>
          <span className="text-xs py-1 px-2 bg-brand-accent/10 text-brand-accent rounded-full">
            Beta v1.0.2
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
