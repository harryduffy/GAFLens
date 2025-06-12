'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

export default function AddFund() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    strategy: '',
    assetClass: '',
    targetNetReturn: '',
    geographicFocus: '',
    tier: '',
    size: '',
    currency: '',
    region: '',
    status: 'pending',
    managerName: '',
    tierJustification: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          targetNetReturn: formData.targetNetReturn ? parseFloat(formData.targetNetReturn) : null,
          tier: formData.tier ? parseInt(formData.tier) : null,
        }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create fund');
      }
    } catch (err) {
      setError('An error occurred while creating the fund');
      console.error('Error creating fund:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <aside className="sidebar">
        <div onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          <img src="/gaf-logo.png" alt="GAF" className="sidebar-icon gaf-icon" />
        </div>
        <a className="sidebar-text" href="https://globalalternativefunds.sharepoint.com/_layouts/15/sharepoint.aspx" target="_blank" rel="noopener noreferrer">
          <p>SharePoint</p>
        </a>
        <a className="sidebar-text" href="https://www.salesforce.com/au/" target="_blank" rel="noopener noreferrer">
          <p>Salesforce</p>
        </a>
        <a className="sidebar-text" href="https://www.preqin.com/insights" target="_blank" rel="noopener noreferrer">
          <p>Preqin</p>
        </a>
      </aside>

      <div className="main">
        <div className="top-bar">
          <div className="search-container">
            <button 
              onClick={() => router.push('/')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #ccc',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <div className="section manager-header">
          <img src="/database-icon.png" alt="Database" className="section-icon" />
          <div className="section-text">
            <h2>Add New Fund</h2>
            <p>Enter the details for the new fund to add to the database.</p>
          </div>
        </div>

        <div className="section">
          <form onSubmit={handleSubmit} className="fund-form">
            {error && (
              <div style={{ 
                backgroundColor: '#f8d7da', 
                color: '#721c24', 
                padding: '12px', 
                borderRadius: '4px', 
                marginBottom: '20px',
                border: '1px solid #f5c6cb'
              }}>
                {error}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Fund Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="managerName">Manager Name</label>
                <input
                  type="text"
                  id="managerName"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="strategy">Strategy</label>
                <input
                  type="text"
                  id="strategy"
                  name="strategy"
                  value={formData.strategy}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="assetClass">Asset Class</label>
                <select
                  id="assetClass"
                  name="assetClass"
                  value={formData.assetClass}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Asset Class</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Private Equity">Private Equity</option>
                  <option value="Hedge Fund">Hedge Fund</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Credit">Credit</option>
                  <option value="Natural Resources">Natural Resources</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="targetNetReturn">Target Net Return (%)</label>
                <input
                  type="number"
                  step="0.01"
                  id="targetNetReturn"
                  name="targetNetReturn"
                  value={formData.targetNetReturn}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tier">Tier</label>
                <select
                  id="tier"
                  name="tier"
                  value={formData.tier}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Tier</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="geographicFocus">Geographic Focus</label>
                <input
                  type="text"
                  id="geographicFocus"
                  name="geographicFocus"
                  value={formData.geographicFocus}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="region">Region</label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Region</option>
                  <option value="Australia">Australia</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="Global">Global</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="size">Fund Size</label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., 500000000"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Currency</option>
                  <option value="AUD">AUD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="tierJustification">Tier Justification</label>
              <textarea
                id="tierJustification"
                name="tierJustification"
                value={formData.tierJustification}
                onChange={handleInputChange}
                rows={4}
                className="form-textarea"
                placeholder="Provide justification for the tier assignment..."
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="cancel-button"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Fund...' : 'Create Fund'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}