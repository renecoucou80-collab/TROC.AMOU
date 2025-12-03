import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Lightbulb, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AutrePage = () => {
  const navigate = useNavigate();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTips();
  }, []);
  
  const fetchTips = async () => {
    try {
      const response = await axios.get(`${API}/tips`);
      const autreTips = response.data.filter(tip => tip.category === 'Autre');
      setTips(autreTips);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des astuces');
    } finally {
      setLoading(false);
    }
  };
  
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
      background: 'linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Button
          onClick={() => navigate('/tips')}
          data-testid="back-to-tips"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            padding: '0.8rem 1.5rem',
            background: '#fff',
            color: '#2c2825',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
          }}
        >
          <ArrowLeft size={20} />
          Retour aux astuces
        </Button>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(120, 144, 156, 0.2)',
            padding: '2rem',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <Lightbulb size={60} stroke="#78909c" strokeWidth={1.5} />
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '1rem',
            color: '#2c2825'
          }} data-testid="autre-title">
            Autres Astuces
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#5a5550',
            lineHeight: '1.7'
          }}>
            Astuces diverses pour faciliter votre quotidien
          </p>
        </div>
        
        {tips.length === 0 ? (
          <p style={{
            textAlign: 'center',
            color: '#5a5550',
            fontSize: '1.1rem',
            padding: '3rem'
          }}>Aucune autre astuce pour le moment</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {tips.map((tip) => (
              <div
                key={tip.id}
                data-testid={`tip-${tip.id}`}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  borderLeft: '6px solid #78909c'
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
                    background: 'rgba(120, 144, 156, 0.2)',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Lightbulb size={28} stroke="#78909c" strokeWidth={2} />
                  </div>
                  
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '8px',
                      background: 'rgba(120, 144, 156, 0.2)',
                      color: '#78909c',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      Autre
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutrePage;