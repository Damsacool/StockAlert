import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageZoomModal = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="image-zoom-modal"
      onClick={handleBackdropClick}
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
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10001,
        }}
      >
        <X size={24} />
      </button>

      {/* Image Container */}
      <div
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <img
          src={images[currentIndex]}
          alt={`Product view ${currentIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '85vh',
            objectFit: 'contain',
            borderRadius: '8px',
          }}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              style={{
                position: 'absolute',
                left: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
              onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.1)')}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
              onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.1)')}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Counter */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Mobile Navigation */}
      <style>{`
        @media (max-width: 768px) {
          .image-zoom-modal button:not([style*="position: absolute; top"]) {
            left: auto !important;
            right: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageZoomModal;
