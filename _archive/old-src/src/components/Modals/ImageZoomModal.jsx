import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageZoomModal = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, handlePrevious, handleNext]);

  if (!images || images.length === 0) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .zoom-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          z-index: 10001;
        }
        .zoom-nav-btn:hover { background: rgba(255, 255, 255, 0.3); }
        .zoom-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          z-index: 10001;
          backdrop-filter: blur(10px);
        }
        .zoom-close-btn:hover { background: rgba(239, 68, 68, 0.8); }
      `}</style>

      {/* Close button */}
      <button
        className="zoom-close-btn"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Fermer"
      >
        <X size={22} />
      </button>

      {/* Main image */}
      <img
        src={images[currentIndex]}
        alt={`Vue ${currentIndex + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '80vh',
          objectFit: 'contain',
          borderRadius: '8px',
          userSelect: 'none',
          pointerEvents: 'auto',
        }}
      />

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            className="zoom-nav-btn"
            style={{ left: '16px' }}
            onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
            aria-label="Image précédente"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            className="zoom-nav-btn"
            style={{ right: '16px' }}
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            aria-label="Image suivante"
          >
            <ChevronRight size={28} />
          </button>

          {/* Counter */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
            }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageZoomModal;