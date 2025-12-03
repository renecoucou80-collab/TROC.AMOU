import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Lightbulb, Wrench, Droplet, Leaf, Zap, Home as HomeIcon } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const categoryIcons = {
  'Plomberie': Droplet,
  'Électricité': Zap,
  'Jardinage': Leaf,
  'Bricolage': Wrench,
  'Maison': HomeIcon,
  'Autre': Lightbulb
};

const categoryColors = {
  'Plomberie': '#42a5f5',
  'Électricité': '#fbc02d',
  'Jardinage': '#66bb6a',
  'Bricolage': '#ff7043',
  'Maison': '#ab47bc',
  'Autre': '#78909c'
};

const TipsPage = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  
  useEffect(() => {
    fetchTips();
  }, []);
  
  const fetchTips = async () => {
    try {
      const response = await axios.get(`${API}/tips`);
      setTips(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des astuces');
    } finally {
      setLoading(false);
    }
  };
  
  const categories = ['Tous', ...Object.keys(categoryIcons)];
  const filteredTips = selectedCategory === 'Tous' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);
  
  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#5a5550' }}>Chargement...</p>
      </div>
    );
  }
  
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '3rem 2rem',
      background: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(251, 192, 45, 0.2)',
            padding: '2rem',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <Lightbulb size={60} stroke="#fbc02d" strokeWidth={1.5} />
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '1rem',
            color: '#2c2825'
          }} data-testid="tips-title">
            Astuces pratiques
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#5a5550',
            lineHeight: '1.7'
          }}>
            Des conseils utiles pour vos travaux quotidiens
          </p>
        </div>
        
        {/* Category Filter */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '3rem'
        }}>
          {categories.map((category) => {
            const Icon = categoryIcons[category] || Lightbulb;
            const isActive = selectedCategory === category;
            
            return (
              <button
                key={category}
                data-testid={`category-${category.toLowerCase()}`}
                onClick={() => setSelectedCategory(category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  background: isActive ? (categoryColors[category] || '#78909c') : '#fff',
                  color: isActive ? '#fff' : '#5a5550',
                  boxShadow: isActive ? '0 4px 15px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.08)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
                  }
                }}
              >
                {category !== 'Tous' && <Icon size={20} />}
                {category}
              </button>
            );
          })}
        </div>
        
        {/* Tips Grid */}
        {filteredTips.length === 0 ? (
          <p style={{
            textAlign: 'center',
            color: '#5a5550',
            fontSize: '1.1rem',
            padding: '3rem'
          }}>Aucune astuce pour le moment</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {filteredTips.map((tip) => {
              const Icon = categoryIcons[tip.category] || Lightbulb;
              const color = categoryColors[tip.category] || '#78909c';
              
              return (
                <div
                  key={tip.id}
                  data-testid={`tip-${tip.id}`}
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    borderLeft: `6px solid ${color}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      background: `${color}20`,
                      padding: '0.8rem',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={28} stroke={color} strokeWidth={2} />
                    </div>
                    
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '8px',
                        background: `${color}20`,
                        color: color,
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {tip.category}
                      </span>
                    </div>
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: '#2c2825'
                  }}>
                    {tip.title}
                  </h3>
                  
                  <p style={{
                    color: '#5a5550',
                    lineHeight: '1.7',
                    fontSize: '1rem',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {tip.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TipsPage;