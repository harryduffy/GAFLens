'use client';

import '../dashboard.css';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const EditorClient = dynamic(() => import('../../components/EditorClient'), { ssr: false });

export default function CreateFormPage() {
  const [formData, setFormData] = useState({
    managerName: '',
    managerCountry: '',
    meetingDate: '',
    managerAUM: '',
    fundName: '',
    fundSize: '',
    assetClasses: '',
    investmentStrategies: '',
    fundGeographicFocus: '',
    fundTargetNetReturn: '',
    gafAttendees: '',
    externalAttendees: '',
    notes: ''
  });

  const [errors, setErrors] = useState({
    managerAUM: '',
    fundSize: '',
    fundTargetNetReturn: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let error = '';

    if (['managerAUM', 'fundSize'].includes(name) && value && isNaN(Number(value))) {
      error = 'Input field requires a number';
    }
    if (name === 'fundTargetNetReturn' && value && isNaN(parseFloat(value))) {
      error = 'Input field requires a number';
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const assetClassOptions = [
    'Private Credit', 'Infrastructure', 'Private Equity', 'Growth Equity',
    'Venture Cap.', 'Hedge Fund', 'Real Estate', 'Other'
  ];

  const strategyOptions = [
    'Primaries', 'Secondaries', 'Co-Invest', 'Direct',
    'Buyout', 'Special Sits.', 'Mezzanine', 'Other'
  ];

  const toggleSelection = (key: 'assetClasses' | 'investmentStrategies', value: string) => {
    const selected = formData[key].split(',').map(s => s.trim()).filter(Boolean);
    const updated = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    setFormData({ ...formData, [key]: updated.join(', ') });
  };

  const handleSubmit = async () => {
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      alert('Fix errors before submitting.');
      return;
    }

    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to submit');
      alert('Form submitted!');
    } catch (err) {
      console.error(err);
      alert('Submission failed');
    }
  };

  return (
    <div className="page">
      {/* Sidebar */}
      <aside className="sidebar">
        <img src="/gaf-logo.png" alt="GAF" className="sidebar-icon gaf-icon" />
        <a href="https://globalalternativefunds.sharepoint.com/_layouts/15/sharepoint.aspx" target="_blank" rel="noopener noreferrer">
          <img src="/sharepoint-logo.png" alt="SharePoint" className="sidebar-icon" />
        </a>
        <a href="https://www.salesforce.com/au/" target="_blank" rel="noopener noreferrer">
          <img src="/salesforce-logo.png" alt="Salesforce" className="sidebar-icon" />
        </a>
        <a href="https://www.preqin.com/insights" target="_blank" rel="noopener noreferrer">
          <img src="/preqin-logo.jpg" alt="Preqin" className="sidebar-icon" />
        </a>
      </aside>

      {/* Main */}
      <div className="main">
        <div className="top-bar">
          <div className="search-container">
            <div className="search-box">
              <img src="/search-icon.png" alt="Search" className="search-icon" />
              <input
                type="text"
                placeholder="Search GAF manager database..."
                className="search-input"
              />
            </div>
          </div>
          <div className="top-bar-right">
            <button className="create-button" onClick={handleSubmit}>Submit Data</button>
            <div className="avatar">DW</div>
          </div>
        </div>

        <div className="section manager-header">
          <img src="/database-icon.png" alt="Database" className="section-icon" />
          <div className="section-text">
            <h2>Fund Selection Form</h2>
            <p>
              Please complete the form below to standardise fund meeting notes and support comparison, collaboration, and transparency across the selection process.
            </p>
          </div>
        </div>

        <div className="section create-form-section">
          <div className="form-body">
            <div className="form-left">
              <div className="section-title">Required Fields</div>
              <div className="form-grid">
                {[
                  { label: 'Manager Name', name: 'managerName', placeholder: 'e.g. Bain Capital' },
                  { label: 'Manager Country', name: 'managerCountry', placeholder: 'e.g. Australia' },
                  { label: 'Date of Meeting', name: 'meetingDate', type: 'date' },
                  { label: 'Manager AUM (USD)', name: 'managerAUM', placeholder: 'e.g. 100,000,000,000' },
                  { label: 'Fund Name', name: 'fundName', placeholder: 'e.g. Bain Capital Distressed and Special Situations 2019' },
                  { label: 'Fund Size (USD)', name: 'fundSize', placeholder: 'e.g. 2,500,000,000' },
                  { label: 'Fund Geographic Focus', name: 'fundGeographicFocus', placeholder: 'e.g. North America' },
                  { label: 'Fund Target Net IRR', name: 'fundTargetNetReturn', placeholder: 'e.g. 15%' },
                  { label: 'GAF Attendees (CSV)', name: 'gafAttendees', placeholder: 'e.g. Jane Smith, John Smith, Henri Dufé' },
                  { label: 'External Attendees (CSV)', name: 'externalAttendees', placeholder: 'e.g. Jane Smith, John Smith, Henri Dufé' },
                ].map(({ label, name, placeholder, type }) => (
                  <div className="form-field" key={name}>
                    <label>{label}</label>
                    <input
                      type={type || 'text'}
                      name={name}
                      placeholder={placeholder}
                      value={formData[name as keyof typeof formData]}
                      onChange={handleChange}
                      className={errors[name as keyof typeof errors] ? 'input-error' : ''}
                    />
                    {errors[name as keyof typeof errors] && (
                      <span className="error-message">{errors[name as keyof typeof errors]}</span>
                    )}
                  </div>
                ))}

                <div className="form-field">
                  <label>Select the Asset Class(s)</label>
                  <div className="button-grid-wrapper">
                    <div className="button-grid">
                      {assetClassOptions.map((label) => (
                        <button
                          key={label}
                          type="button"
                          className={`select-button ${formData.assetClasses.includes(label) ? 'selected' : ''}`}
                          onClick={() => toggleSelection('assetClasses', label)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-field">
                  <label>Select the Investment Strategy(s)</label>
                  <div className="button-grid-wrapper">
                    <div className="button-grid">
                      {strategyOptions.map((label) => (
                        <button
                          key={label}
                          type="button"
                          className={`select-button ${formData.investmentStrategies.includes(label) ? 'selected' : ''}`}
                          onClick={() => toggleSelection('investmentStrategies', label)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-right">
              <div className="section-title">General Notes</div>
              <EditorClient
                value={formData.notes}
                onChange={(content) =>
                  setFormData({ ...formData, notes: content })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
