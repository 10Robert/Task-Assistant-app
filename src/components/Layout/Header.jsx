import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="bg-white shadow-sm p-4">
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  );
};

export default Header;