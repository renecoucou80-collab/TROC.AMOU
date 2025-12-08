import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, List, Lightbulb, Mail, Phone, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Home = () => {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('renecoucou80@gmail.com');
      toast.success('Email copié dans le presse-papier !');
    } catch (err) {
      // Fallback si clipboard API ne fonctionne pas
      const textArea = document.createElement('textarea');
      textArea.value = 'renecoucou80@gmail.com';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Email copié !');
    }
  };
  
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)',
      backgroundImage: 'url(https://customer-assets.emergentagent.com/job_5f5835cf-60fa-41a6-a1b3-cbe520928f5e/artifacts/t0t8m0zj_village%20amou.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      {/* Overlay pour toute la page */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.45) 0%, rgba(44, 40, 37, 0.50) 100%)',
        zIndex: 1
      }}></div>
      
      {/* Hero Section */}
      <section style={{
        padding: '4rem 2rem',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(217, 119, 87, 0.15)',
            padding: '3rem',
            borderRadius: '50%',
            marginBottom: '2rem'
          }}>
            <Heart size={80} stroke="#d97757" strokeWidth={1.5} />
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '1.5rem',
            lineHeight: '1.2',
            textShadow: '3px 3px 8px rgba(0, 0, 0, 0.8), 1px 1px 3px rgba(0, 0, 0, 0.9)'
          }} data-testid="home-title">
            Partage Solidaire
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#ffffff',
            maxWidth: '800px',
            margin: '0 auto 2rem',
            lineHeight: '1.8',
            fontWeight: '600',
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9), 1px 1px 3px rgba(0, 0, 0, 0.8)'
          }} data-testid="home-description">
            Une plateforme communautaire où générosité et solidarité se rencontrent.
            Donnez une seconde vie à vos objets, aidez ceux qui en ont besoin,
            et découvrez des astuces pratiques pour vos projets du quotidien.
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <p style={{
              fontSize: '1.1rem',
              color: '#ffffff',
              fontWeight: '600',
              textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9), 1px 1px 3px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: 0
            }}>
              <span>Un problème ? Email :</span>
              <a
                href="mailto:renecoucou80@gmail.com?subject=Demande d'information"
                data-testid="contact-email"
                style={{
                  color: '#ffd9c8',
                  textDecoration: 'underline',
                  fontWeight: '700',
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9)'
                }}
              >
                renecoucou80@gmail.com
              </a>
              <span style={{ margin: '0 0.25rem' }}>|</span>
              <span>Tél :</span>
              <span style={{
                color: '#ffd9c8',
                fontWeight: '700'
              }}>
                07 83 01 49 69
              </span>
            </p>
            
            <button
              onClick={copyEmail}
              data-testid="copy-email-button"
              style={{
                background: '#fff',
                color: '#d97757',
                padding: '0.6rem 1.2rem',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '2px solid #d97757',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 10px rgba(217, 119, 87, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d97757';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#d97757';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Copy size={16} />
              Copier l'email
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section style={{
        padding: '4rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#ffffff',
          fontWeight: '800',
          textShadow: '3px 3px 8px rgba(0, 0, 0, 0.8), 1px 1px 3px rgba(0, 0, 0, 0.9)'
        }}>
          Comment ça marche ?
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          <Link to="/donate" style={{ textDecoration: 'none' }} data-testid="feature-donate">
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '2.5rem',
              borderRadius: '20px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease',
              height: '100%',
              border: '2px solid transparent',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(217, 119, 87, 0.2)';
              e.currentTarget.style.borderColor = '#d97757';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #ffeee5 0%, #ffd9c8 100%)',
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <Heart size={36} stroke="#d97757" strokeWidth={2} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#2c2825'
              }}>Faire un don</h3>
              <p style={{
                color: '#5a5550',
                lineHeight: '1.7',
                fontSize: '1rem'
              }}>
                Partagez vos objets inutilisés avec ceux qui en ont besoin.
                Ajoutez quelques photos et votre numéro de téléphone.
              </p>
            </div>
          </Link>
          
          <Link to="/sell" style={{ textDecoration: 'none' }} data-testid="feature-sell">
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '2.5rem',
              borderRadius: '20px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease',
              height: '100%',
              border: '2px solid transparent',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(217, 119, 87, 0.2)';
              e.currentTarget.style.borderColor = '#d97757';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <ShoppingBag size={36} stroke="#66bb6a" strokeWidth={2} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#2c2825'
              }}>Vendre un objet</h3>
              <p style={{
                color: '#5a5550',
                lineHeight: '1.7',
                fontSize: '1rem'
              }}>
                Donnez une seconde vie à vos objets en les vendant.
                Ajoutez description, prix et photos.
              </p>
            </div>
          </Link>
          
          <Link to="/listings" style={{ textDecoration: 'none' }} data-testid="feature-listings">
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '2.5rem',
              borderRadius: '20px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease',
              height: '100%',
              border: '2px solid transparent',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(217, 119, 87, 0.2)';
              e.currentTarget.style.borderColor = '#d97757';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <List size={36} stroke="#42a5f5" strokeWidth={2} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#2c2825'
              }}>Parcourir les annonces</h3>
              <p style={{
                color: '#5a5550',
                lineHeight: '1.7',
                fontSize: '1rem'
              }}>
                Découvrez tous les dons et ventes disponibles.
                Contactez directement les donateurs.
              </p>
            </div>
          </Link>
          
          <Link to="/tips" style={{ textDecoration: 'none' }} data-testid="feature-tips">
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '2.5rem',
              borderRadius: '20px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease',
              height: '100%',
              border: '2px solid transparent',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(217, 119, 87, 0.2)';
              e.currentTarget.style.borderColor = '#d97757';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)',
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <Lightbulb size={36} stroke="#fbc02d" strokeWidth={2} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#2c2825'
              }}>Astuces pratiques</h3>
              <p style={{
                color: '#5a5550',
                lineHeight: '1.7',
                fontSize: '1rem'
              }}>
                Découvrez des conseils et astuces pour vos travaux quotidiens.
                Bricolage, jardinage et plus encore.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;