// src/components/layout/AuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
};

export default AuthLayout;