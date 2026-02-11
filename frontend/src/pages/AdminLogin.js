import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Shield, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/admin/login`, {
        username,
        password
      });
      
      localStorage.setItem('adminToken', response.data.access_token);
      toast.success('Connexion réussie');
      setIsLoggedIn(true);
      navigate('/admin/panel');
    } catch (error) {
      console.error(error);
      toast.error('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    toast.success('Déconnexion réussie');
  };
  
  if (isLoggedIn) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #f5f3ef 0%, #faf8f5 100%)'
      }}>
        <div style={{
          background: '#fff',
          padding: '3rem',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(102, 187, 106, 0.15)',
            padding: '2rem',
            borderRadius: '50%',
            marginBottom: '2rem'
          }}>
            <Shield size={60} stroke="#66bb6a" strokeWidth={1.5} />
          </div>
          
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            color: '#2c2825'
          }}>Connecté en tant qu'administrateur</h2>
          
          <p style={{
            color: '#5a5550',
            marginBottom: '2rem',
            fontSize: '1.1rem'
          }}>Vous pouvez maintenant gérer les annonces</p>
          
          <Button
            onClick={handleLogout}
            data-testid="logout-button"
            style={{
              width: '100%',
              padding: '1rem',
              background: '#ef5350',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e53935';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ef5350';
            }}
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f5f3ef 0%, #faf8f5 100%)'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(217, 119, 87, 0.15)',
            padding: '2rem',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <Shield size={60} stroke="#d97757" strokeWidth={1.5} />
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            color: '#2c2825'
          }} data-testid="admin-login-title">
            Administration
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#5a5550'
          }}>
            Connectez-vous pour gérer le site
          </p>
        </div>
        
        <form onSubmit={handleLogin} style={{
          background: '#fff',
          padding: '3rem',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <Label htmlFor="username" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2c2825'
            }}>
              <User size={18} />
              Nom d'utilisateur
            </Label>
            <Input
              id="username"
              data-testid="username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              style={{
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <Label htmlFor="password" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2c2825'
            }}>
              <Lock size={18} />
              Mot de passe
            </Label>
            <Input
              id="password"
              data-testid="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
          
          <Button
            type="submit"
            data-testid="login-button"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#d97757',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '12px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#c86647';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(217, 119, 87, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#d97757';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
          
          <p style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            color: '#8a8580',
            fontSize: '0.9rem'
          }}>
            Par défaut : admin / admin123
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;