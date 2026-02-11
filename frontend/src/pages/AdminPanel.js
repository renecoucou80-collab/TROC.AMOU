import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Trash2, Heart, ShoppingBag, Lightbulb } from 'lucide-react';

const API = '/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [sales, setSales] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'admin est connecté
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    try {
      const [donationsRes, salesRes, tipsRes] = await Promise.all([
        axios.get(`${API}/donations`),
        axios.get(`${API}/sales`),
        axios.get(`${API}/tips`)
      ]);
      
      setDonations(donationsRes.data);
      setSales(salesRes.data);
      setTips(tipsRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Vous devez être connecté pour supprimer');
        navigate('/admin/login');
        return;
      }
      
      const endpoint = type === 'donation' ? 'donations' : type === 'sale' ? 'sales' : 'tips';
      
      console.log('Tentative de suppression:', { type, id, endpoint, API });
      console.log('Token:', token ? 'présent' : 'absent');
      
      await axios.delete(`${API}/${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success('Annonce supprimée avec succès');
      fetchAllData();
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Détails erreur:', error.response?.data);
      console.error('Status:', error.response?.status);
      toast.error(`Erreur lors de la suppression: ${error.response?.data?.detail || error.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fef9f4 0%, #fef3e8 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#d97757', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Panneau d'administration
        </h1>

        {/* Dons */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginBottom: '1.5rem' 
          }}>
            <Heart size={28} stroke="#e91e63" strokeWidth={2} />
            <h2 style={{ fontSize: '1.8rem', color: '#5a5550', margin: 0 }}>
              Dons ({donations.length})
            </h2>
          </div>

          {donations.length === 0 ? (
            <p style={{ color: '#8a8580' }}>Aucun don pour le moment</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0.5rem 0', color: '#5a5550' }}>
                      <strong>Téléphone:</strong> {donation.phone}
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#5a5550' }}>
                      <strong>Code postal:</strong> {donation.postal_code}
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#8a8580', fontSize: '0.9rem' }}>
                      Posté le {new Date(donation.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    {donation.photos && donation.photos.length > 0 && (
                      <p style={{ margin: '0.5rem 0', color: '#8a8580', fontSize: '0.9rem' }}>
                        {donation.photos.length} photo(s)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete('donation', donation.id)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#ef5350',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: '600',
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e53935'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#ef5350'}
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Ventes */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginBottom: '1.5rem' 
          }}>
            <ShoppingBag size={28} stroke="#66bb6a" strokeWidth={2} />
            <h2 style={{ fontSize: '1.8rem', color: '#5a5550', margin: 0 }}>
              Ventes ({sales.length})
            </h2>
          </div>

          {sales.length === 0 ? (
            <p style={{ color: '#8a8580' }}>Aucune vente pour le moment</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0.5rem 0', color: '#5a5550' }}>
                      <strong>Description:</strong> {sale.description}
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#5a5550' }}>
                      <strong>Prix:</strong> {sale.price}€
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#5a5550' }}>
                      <strong>Téléphone:</strong> {sale.phone}
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#5a5550' }}>
                      <strong>Code postal:</strong> {sale.postal_code}
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#8a8580', fontSize: '0.9rem' }}>
                      Posté le {new Date(sale.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    {sale.photos && sale.photos.length > 0 && (
                      <p style={{ margin: '0.5rem 0', color: '#8a8580', fontSize: '0.9rem' }}>
                        {sale.photos.length} photo(s)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete('sale', sale.id)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#ef5350',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: '600',
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e53935'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#ef5350'}
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Astuces */}
        <section>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginBottom: '1.5rem' 
          }}>
            <Lightbulb size={28} stroke="#ffa726" strokeWidth={2} />
            <h2 style={{ fontSize: '1.8rem', color: '#5a5550', margin: 0 }}>
              Astuces ({tips.length})
            </h2>
          </div>

          {tips.length === 0 ? (
            <p style={{ color: '#8a8580' }}>Aucune astuce pour le moment</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {tips.map((tip) => (
                <div
                  key={tip.id}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0.5rem 0', color: '#5a5550' }}>
                      <strong>Titre:</strong> {tip.title}
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#5a5550' }}>
                      {tip.content}
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#8a8580', fontSize: '0.9rem' }}>
                      Posté le {new Date(tip.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete('tip', tip.id)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#ef5350',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: '600',
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e53935'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#ef5350'}
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.75rem 2rem',
              background: '#d97757',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
