import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Upload, Phone, ShoppingBag, FileText, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SalePage = () => {
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      toast.error('Maximum 3 photos autorisées');
      return;
    }
    
    setFiles(selectedFiles);
    
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phone || !postalCode || !description || !price) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('postal_code', postalCode);
      formData.append('description', description);
      formData.append('price', parseFloat(price));
      files.forEach(file => {
        formData.append('files', file);
      });
      
      await axios.post(`${API}/sales`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Annonce ajoutée avec succès !');
      setPhone('');
      setPostalCode('');
      setDescription('');
      setPrice('');
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'ajout de l\'annonce');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '3rem 2rem',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
    }}>
      <div style={{
        maxWidth: '800px',
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
            background: 'rgba(102, 187, 106, 0.2)',
            padding: '2rem',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <ShoppingBag size={60} stroke="#66bb6a" strokeWidth={1.5} />
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '1rem',
            color: '#2c2825'
          }} data-testid="sell-title">
            Vendre un objet
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#5a5550',
            lineHeight: '1.7'
          }}>
            Donnez une seconde vie à vos objets
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{
          background: '#fff',
          padding: '3rem',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <Label htmlFor="phone" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2c2825'
            }}>
              <Phone size={18} />
              Numéro de téléphone *
            </Label>
            <Input
              id="phone"
              data-testid="phone-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 12 34 56 78"
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
            <Label htmlFor="description" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2c2825'
            }}>
              <FileText size={18} />
              Description *
            </Label>
            <Textarea
              id="description"
              data-testid="description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre objet..."
              required
              rows={4}
              style={{
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                transition: 'all 0.3s ease',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <Label htmlFor="price" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2c2825'
            }}>
              <Euro size={18} />
              Prix (€) *
            </Label>
            <Input
              id="price"
              data-testid="price-input"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="50.00"
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
            <Label htmlFor="photos" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2c2825'
            }}>
              <Upload size={18} />
              Photos (1 à 3 maximum)
            </Label>
            
            <div style={{
              border: '2px dashed #66bb6a',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: 'rgba(102, 187, 106, 0.05)'
            }}
            onClick={() => document.getElementById('file-input').click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(102, 187, 106, 0.1)';
              e.currentTarget.style.borderColor = '#4caf50';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(102, 187, 106, 0.05)';
              e.currentTarget.style.borderColor = '#66bb6a';
            }}>
              <Upload size={40} stroke="#66bb6a" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#5a5550', fontSize: '1rem' }}>
                Cliquez pour sélectionner des photos
              </p>
              <input
                id="file-input"
                data-testid="photo-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            
            {previews.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                {previews.map((preview, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    paddingBottom: '100%'
                  }}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
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
                ))}
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            data-testid="submit-sale-button"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#66bb6a',
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
                e.currentTarget.style.background = '#4caf50';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 187, 106, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#66bb6a';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Envoi en cours...' : 'Publier l\'annonce'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SalePage;