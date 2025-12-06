import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Home as HomeIcon, ArrowLeft, Plus, Trash2 } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MaisonPage = () => {
  const navigate = useNavigate();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchTips();
  }, []);
  
  const fetchTips = async () => {
    try {
      const response = await axios.get(`${API}/tips`);
      const maisonTips = response.data.filter(tip => tip.category === 'Maison');
      setTips(maisonTips);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des astuces');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Vous devez être connecté en tant qu\'administrateur');
      return;
    }
    
    setSubmitting(true);
    
    try {
      await axios.post(`${API}/tips`, {
        title,
        content,
        category: 'Maison'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success('Astuce ajoutée avec succès !');
      setTitle('');
      setContent('');
      setDialogOpen(false);
      fetchTips();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'ajout de l\'astuce');
    } finally {
      setSubmitting(false);
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
      background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <Button
            onClick={() => navigate('/tips')}
            data-testid="back-to-tips"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
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
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                data-testid="add-tip-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.5rem',
                  background: '#ab47bc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 10px rgba(171, 71, 188, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#9c27b0';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(171, 71, 188, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ab47bc';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(171, 71, 188, 0.3)';
                }}
              >
                <Plus size={20} />
                Ajouter une astuce
              </Button>
            </DialogTrigger>
            <DialogContent style={{ maxWidth: '600px' }}>
              <DialogHeader>
                <DialogTitle>Ajouter une astuce Maison</DialogTitle>
                <DialogDescription>
                  Partagez vos conseils et astuces pour la maison
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <Label htmlFor="title" style={{ marginBottom: '0.5rem', display: 'block' }}>
                    Titre *
                  </Label>
                  <Input
                    id="title"
                    data-testid="tip-title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Nettoyer efficacement les vitres"
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <Label htmlFor="content" style={{ marginBottom: '0.5rem', display: 'block' }}>
                    Contenu *
                  </Label>
                  <Textarea
                    id="content"
                    data-testid="tip-content-input"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Décrivez votre astuce en détail..."
                    required
                    rows={6}
                  />
                </div>
                
                <Button
                  type="submit"
                  data-testid="submit-tip-button"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: '#ab47bc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Ajout en cours...' : 'Ajouter l\'astuce'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(171, 71, 188, 0.2)',
            padding: '2rem',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <HomeIcon size={60} stroke="#ab47bc" strokeWidth={1.5} />
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '1rem',
            color: '#2c2825'
          }} data-testid="maison-title">
            Astuces Maison
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#5a5550',
            lineHeight: '1.7'
          }}>
            Conseils et astuces pour entretenir votre maison
          </p>
        </div>
        
        {tips.length === 0 ? (
          <p style={{
            textAlign: 'center',
            color: '#5a5550',
            fontSize: '1.1rem',
            padding: '3rem'
          }}>Aucune astuce maison pour le moment</p>
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
                  borderLeft: '6px solid #ab47bc'
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
                    background: 'rgba(171, 71, 188, 0.2)',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <HomeIcon size={28} stroke="#ab47bc" strokeWidth={2} />
                  </div>
                  
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '8px',
                      background: 'rgba(171, 71, 188, 0.2)',
                      color: '#ab47bc',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      Maison
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

export default MaisonPage;