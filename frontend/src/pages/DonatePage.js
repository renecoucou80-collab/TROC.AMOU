import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Upload, Phone, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DonatePage = () => {
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
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
    
    if (!phone) {
      toast.error('Veuillez entrer votre numéro de téléphone');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('phone', phone);
      files.forEach(file => {
        formData.append('files', file);
      });
      
      await axios.post(`${API}/donations`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Don ajouté avec succès !');
      setPhone('');
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'ajout du don');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '3rem 2rem',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)'
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
            background: 'rgba(66, 165, 245, 0.2)',
            padding: '2rem',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <Heart size={60} stroke="#42a5f5" strokeWidth={1.5} />
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '1rem',
            color: '#2c2825'
          }} data-testid="donate-title">
            Faire un don
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#5a5550',
            lineHeight: '1.7'
          }}>
            Partagez vos objets avec ceux qui en ont besoin
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
              border: '2px dashed #42a5f5',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: 'rgba(66, 165, 245, 0.08)'
            }}
            onClick={() => document.getElementById('file-input').click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(66, 165, 245, 0.15)';
              e.currentTarget.style.borderColor = '#1e88e5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(66, 165, 245, 0.08)';
              e.currentTarget.style.borderColor = '#42a5f5';
            }}>
              <Upload size={40} stroke="#42a5f5" style={{ margin: '0 auto 1rem' }} />
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
            data-testid="submit-donation-button"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#42a5f5',
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
                e.currentTarget.style.background = '#1e88e5';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(66, 165, 245, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#42a5f5';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Envoi en cours...' : 'Publier le don'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DonatePage;