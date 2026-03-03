import React from 'react';
import { useAuth } from './AuthProvider';
import { clearAuthToken } from '../auth/client';

export default function NavbarAuthButton() {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) return null;

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px' }}>{user.name || user.email}</span>
        <button
          onClick={async () => {
            clearAuthToken();
            await signOut();
            window.location.href = '/robotics_book/';
          }}
          className="button button--sm button--outline button--danger"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <a href="/robotics_book/login" className="button button--sm button--outline button--primary">
        Login
      </a>
      <a href="/robotics_book/signup" className="button button--sm button--primary">
        Sign Up
      </a>
    </div>
  );
}
