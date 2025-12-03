import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, ShoppingBag, List, Lightbulb, Shield } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/donate', icon: Heart, label: 'Donner' },
    { path: '/sell', icon: ShoppingBag, label: 'Vendre' },
    { path: '/listings', icon: List, label: 'Annonces' },
    { path: '/tips', icon: Lightbulb, label: 'Astuces' },
  ];
  
  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{
            color: '#d97757',
            fontSize: '1.5rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Heart size={28} fill="#d97757" />
            Partage Solidaire
          </h2>
        </Link>
        
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              data-testid={`nav-${label.toLowerCase()}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                background: isActive(path) ? '#d97757' : 'transparent',
                color: isActive(path) ? '#fff' : '#5a5550',
              }}
              onMouseEnter={(e) => {
                if (!isActive(path)) {
                  e.currentTarget.style.background = '#f0e6df';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(path)) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
          
          <Link
            to="/admin"
            data-testid="nav-admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.6rem',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: isActive('/admin') ? '#d97757' : 'transparent',
              color: isActive('/admin') ? '#fff' : '#5a5550',
              marginLeft: '1rem'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/admin')) {
                e.currentTarget.style.background = '#f0e6df';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/admin')) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <Shield size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;