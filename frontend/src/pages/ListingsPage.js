import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Heart, ShoppingBag, Phone, Trash2, Euro } from 'lucide-react';
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

const ListingsPage = () => {
  const [donations, setDonations] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: '' });
  
  useEffect(() => {
    fetchListings();
  }, []);
  
  const fetchListings = async () => {
    try {
      const [donationsRes, salesRes] = await Promise.all([
        axios.get(`${API}/donations`),
        axios.get(`${API}/sales`)
      ]);
      
      setDonations(donationsRes.data);
      setSales(salesRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      const endpoint = deleteDialog.type === 'donation' ? 'donations' : 'sales';
      await axios.delete(`${API}/${endpoint}/${deleteDialog.id}`);
      
      toast.success('Supprimé avec succès');
      setDeleteDialog({ open: false, type: '', id: '' });
      fetchListings();
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
  
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '3rem 2rem',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#2c2825'
        }} data-testid="listings-title">
          Toutes les annonces
        </h1>
        
        <div style={{
          background: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)',
          border: '2px solid #fbc02d',
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          marginBottom: '3rem',
          boxShadow: '0 4px 15px rgba(251, 192, 45, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            background: '#fbc02d',
            borderRadius: '50%',
            padding: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <p style={{
            fontSize: '1.05rem',
            color: '#5a5550',
            margin: 0,
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            <strong>Important :</strong> Si votre objet a été donné ou vendu, merci de <strong>supprimer votre annonce</strong> en cliquant sur le bouton "Supprimer" pour maintenir la liste à jour.
          </p>
        </div>
        
        {/* Donations Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <Heart size={32} stroke="#d97757" strokeWidth={2} />
            <h2 style={{
              fontSize: '2rem',
              color: '#2c2825',
              fontWeight: '700'
            }}>Dons disponibles</h2>
          </div>
          
          {donations.length === 0 ? (
            <p style={{
              textAlign: 'center',
              color: '#5a5550',
              fontSize: '1.1rem',
              padding: '3rem'
            }}>Aucun don pour le moment</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  data-testid={`donation-${donation.id}`}
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease'
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
                  {donation.photos && donation.photos.length > 0 && (
                    <div style={{
                      width: '100%',
                      paddingBottom: '75%',
                      position: 'relative',
                      background: '#f5f5f5'
                    }}>
                      <img
                        src={`${BACKEND_URL}${donation.photos[0]}`}
                        alt="Don"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                  
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem'
                    }}>
                      <Phone size={18} stroke="#5a5550" />
                      <a
                        href={`tel:${donation.phone}`}
                        style={{
                          color: '#d97757',
                          textDecoration: 'none',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                      >
                        {donation.phone}
                      </a>
                    </div>
                    
                    {donation.postal_code && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem'
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>📍</span>
                        <span style={{
                          color: '#5a5550',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}>
                          {donation.postal_code}
                        </span>
                      </div>
                    )}
                    
                    <p style={{
                      color: '#8a8580',
                      fontSize: '0.9rem',
                      marginBottom: '1rem'
                    }}>
                      Posté le {new Date(donation.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    
                    <Button
                      onClick={() => setDeleteDialog({ open: true, type: 'donation', id: donation.id })}
                      data-testid={`delete-donation-${donation.id}`}
                      style={{
                          width: '100%',
                          padding: '0.6rem',
                          background: '#ef5350',
                          color: '#fff',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#e53935';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ef5350';
                        }}
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Sales Section */}
        <section>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <ShoppingBag size={32} stroke="#66bb6a" strokeWidth={2} />
            <h2 style={{
              fontSize: '2rem',
              color: '#2c2825',
              fontWeight: '700'
            }}>Ventes disponibles</h2>
          </div>
          
          {sales.length === 0 ? (
            <p style={{
              textAlign: 'center',
              color: '#5a5550',
              fontSize: '1.1rem',
              padding: '3rem'
            }}>Aucune vente pour le moment</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  data-testid={`sale-${sale.id}`}
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease'
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
                  {sale.photos && sale.photos.length > 0 && (
                    <div style={{
                      width: '100%',
                      paddingBottom: '75%',
                      position: 'relative',
                      background: '#f5f5f5'
                    }}>
                      <img
                        src={`${BACKEND_URL}${sale.photos[0]}`}
                        alt="Vente"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                  
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Euro size={24} stroke="#66bb6a" strokeWidth={2.5} />
                        <span style={{
                          fontSize: '1.8rem',
                          fontWeight: '800',
                          color: '#66bb6a'
                        }}>{sale.price}</span>
                      </div>
                    </div>
                    
                    <p style={{
                      color: '#2c2825',
                      fontSize: '1rem',
                      marginBottom: '1rem',
                      lineHeight: '1.6'
                    }}>
                      {sale.description}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <Phone size={18} stroke="#5a5550" />
                      <a
                        href={`tel:${sale.phone}`}
                        style={{
                          color: '#66bb6a',
                          textDecoration: 'none',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                      >
                        {sale.phone}
                      </a>
                    </div>
                    
                    <p style={{
                      color: '#8a8580',
                      fontSize: '0.9rem',
                      marginBottom: '1rem'
                    }}>
                      Posté le {new Date(sale.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    
                    <Button
                      onClick={() => setDeleteDialog({ open: true, type: 'sale', id: sale.id })}
                      data-testid={`delete-sale-${sale.id}`}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        background: '#ef5350',
                        color: '#fff',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e53935';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ef5350';
                      }}
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="confirm-delete-button">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListingsPage;