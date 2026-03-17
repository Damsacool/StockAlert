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

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

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
      {/* Close Button - CENTERED TOP, not overlapping header */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          marginTop: '-50vh', // Push to top center
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.15)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10001,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.25)')}
        onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.15)')}
      >
        <X size={24} />
      </button>

      {/* Main Image */}
      <img
        src={images[currentIndex]}
        alt={`Product view ${currentIndex + 1}`}
        style={{
          maxWidth: '90vw',
          maxHeight: '80vh',
          objectFit: 'contain',
          borderRadius: '8px',
          userSelect: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Navigation - INSIDE viewport, mobile-friendly */}
      {images.length > 1 && (
        <>
          {/* Previous Button - LEFT SIDE */}
          <button
            onClick={handlePrevious}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              zIndex: 10001,
            }}
            onMouseEnter={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.25)')}
            onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.15)')}
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next Button - RIGHT SIDE */}
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              zIndex: 10001,
            }}
            onMouseEnter={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.25)')}
            onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.15)')}
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Counter - BOTTOM CENTER */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Swipe Instructions for Mobile */}
      <div
        style={{
          position: 'absolute',
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '12px',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        {images.length > 1 && 'Tap arrows or use keyboard ← →'}
      </div>
    </div>
  );
};

export default ImageZoomModal;