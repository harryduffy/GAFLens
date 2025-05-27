// src/components/ErrorPage.tsx
'use client';
import React from 'react';

interface ErrorPageProps {
  errorCode?: string | number;
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  errorCode = '404',
  title = 'Page Not Found',
  message = 'The page you are looking for could not be found.',
  onRetry,
  showRetryButton = true
}) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

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
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
        {/* Error Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #fecaca',
          borderRadius: '50%',
          margin: '0 auto 16px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fef2f2'
        }}>
          <div style={{
            color: '#dc2626',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'system-ui, sans-serif'
          }}>
            !
          </div>
        </div>
        
        {/* Error Code */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          color: '#dc2626',
          margin: '0 0 8px 0',
          fontFamily: 'system-ui, sans-serif'
        }}>
          {errorCode}
        </h1>
        
        {/* Error Title */}
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '8px',
          margin: '0 0 8px 0',
          color: '#4b5563',
          fontFamily: 'system-ui, sans-serif'
        }}>
          {title}
        </h2>
        
        {/* Error Message */}
        <p style={{ 
          fontSize: '14px',
          margin: '0 0 24px 0',
          color: '#6b7280',
          fontFamily: 'system-ui, sans-serif',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        
        {/* Brand */}
        <div style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginBottom: '24px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          Fund Lens
        </div>
        
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleGoHome}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Go Home
          </button>
          
          {showRetryButton && (
            <button 
              onClick={onRetry || (() => window.location.reload())}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#4b5563',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;