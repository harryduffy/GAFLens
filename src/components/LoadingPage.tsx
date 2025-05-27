// src/components/LoadingPage.tsx
'use client';
import React, { useState, useEffect } from 'react';

interface LoadingPageProps {
  onLoadingComplete?: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{ textAlign: 'center' }}>
        {/* Spinning wheel */}
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #dbeafe',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px auto'
        }}></div>
        
        {/* Text */}
        <div style={{ color: '#4b5563' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '4px',
            margin: '0 0 4px 0',
            fontFamily: "system-ui, sans-serif"
          }}>
            Fund Lens
          </h2>
          <p style={{ 
            fontSize: '14px',
            margin: 0,
            fontFamily: "system-ui, sans-serif"
          }}>
            Loading...
          </p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
};

export default LoadingPage;