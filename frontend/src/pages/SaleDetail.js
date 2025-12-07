import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, Phone, Trash2, X, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const SaleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    fetchSale();
  }, [id]);
  
  const fetchSale = async () => {
    try {
      const response = await axios.get(`${API}/sales`);
      const found = response.data.find(s => s.id === id);
      if (found) {
        setSale(found);
      } else {
        toast.error('Vente introuvable');
        navigate('/listings');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement');
      navigate('/listings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/sales/${id}`);
      toast.success('Vente supprimée avec succès');
      navigate('/listings');
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la suppression');
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
  
  if (!sale) {
    return null;
  }
  
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '3rem 2rem',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Button
          onClick={() => navigate('/listings')}
          data-testid="back-to-listings"
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
          Retour aux annonces
        </Button>
        
        <div style={{
          background: '#fff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          {/* Galerie photos */}
          {sale.photos && sale.photos.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: sale.photos.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '0.5rem',
              background: '#f5f5f5'
            }}>
              {sale.photos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(photo)}
                  style={{
                    position: 'relative',
                    paddingBottom: '75%',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={`${BACKEND_URL}${photo}`}
                    alt={`Vente photo ${idx + 1}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Détails */}
          <div style={{ padding: '3rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '2rem'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <Euro size={40} stroke="#66bb6a" strokeWidth={2.5} />
                  <span style={{
                    fontSize: '3rem',
                    fontWeight: '900',
                    color: '#66bb6a'
                  }}>{sale.price}€</span>
                </div>
                
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: '#2c2825',
                  marginBottom: '2rem'
                }}>
                  Description
                </h2>
                
                <p style={{
                  fontSize: '1.2rem',
                  color: '#5a5550',
                  lineHeight: '1.8',
                  marginBottom: '2rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {sale.description}
                </p>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginTop: '2rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <Phone size={24} stroke="#5a5550" />
                    <a
                      href={`tel:${sale.phone}`}
                      style={{
                        color: '#66bb6a',
                        textDecoration: 'none',
                        fontSize: '1.5rem',
                        fontWeight: '700'
                      }}
                    >
                      {sale.phone}
                    </a>
                  </div>
                  
                  {sale.postal_code && (
                    <a
                      href={`https://www.google.com/maps/search/${sale.postal_code}+France`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        textDecoration: 'none',
                        padding: '0.75rem 1.25rem',
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        borderRadius: '12px',
                        border: '2px solid #42a5f5',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        width: 'fit-content'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(66, 165, 245, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>📍</span>
                      <span style={{
                        color: '#2c2825',
                        fontSize: '1.5rem',
                        fontWeight: '700'
                      }}>
                        {sale.postal_code}
                      </span>
                      <span style={{
                        fontSize: '0.9rem',
                        color: '#42a5f5',
                        fontWeight: '600',
                        marginLeft: '0.5rem'
                      }}>
                        🗺️ Voir sur la carte
                      </span>
                    </a>
                  )}
                  
                  <p style={{
                    color: '#8a8580',
                    fontSize: '1rem',
                    marginTop: '0.5rem'
                  }}>
                    Posté le {new Date(sale.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => setDeleteDialog(true)}
                data-testid="delete-sale-button"
                style={{
                  padding: '0.8rem 1.5rem',
                  background: '#ef5350',
                  color: '#fff',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e53935';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ef5350';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Trash2 size={20} />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal image agrandie */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            cursor: 'pointer'
          }}
        >
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
          >
            <X size={24} stroke="#2c2825" />
          </button>
          <img
            src={`${BACKEND_URL}${selectedImage}`}
            alt="Photo agrandie"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: '12px'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette vente ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="confirm-delete">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SaleDetail;
