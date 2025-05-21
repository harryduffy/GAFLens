'use client';

import '../dashboard.css';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const EditorClient = dynamic(() => import('../../components/EditorClient'), { ssr: false });

type FundOption = {
  name: string;
  managerName?: string;
  size?: string;
  targetNetReturn?: number;
  geographicFocus?: string;
  notes?: string;
};

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
    fundName: '',
    managerAUM: '',
    fundSize: '',
    fundTargetNetReturn: '',
    notes: '',
  });

  const [fundOptions, setFundOptions] = useState<FundOption[]>([]);

  useEffect(() => {
    fetch('/api/funds')
      .then(res => res.json())
      .then((data: FundOption[]) => {
        console.log("Fetched fund options:", data); // 🐞
        setFundOptions(data);
      })
      .catch(err => console.error('Failed to load funds:', err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let error = '';

    if (['managerAUM', 'fundSize'].includes(name) && value && isNaN(Number(value))) {
      error = 'Input field requires a number';
    }

    if (name === 'fundTargetNetReturn' && value && isNaN(parseFloat(value))) {
      error = 'Input field requires a number';
    }

    if (name === 'fundName') {
      const selectedFund = fundOptions.find(f => f.name === value);
      setFormData(prev => ({
        ...prev,
        fundName: value,
        managerName: selectedFund?.managerName || '',
        fundSize: selectedFund?.size || '',
        fundTargetNetReturn: selectedFund?.targetNetReturn?.toString() || '',
        fundGeographicFocus: selectedFund?.geographicFocus || '',
        notes: selectedFund?.notes || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

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

      const result = await res.json();
      console.log('🛠️ Server response:', result);

      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

      alert('Form submitted!');
    } catch (err) {
      console.error('❌ Submission error:', err);
    }
  };

  return (
    <div className="page">
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
                <div className="form-field">
                  <label>Fund Name</label>
                  <select
                    name="fundName"
                    value={formData.fundName}
                    onChange={handleChange}
                    className={errors.fundName ? 'input-error' : ''}
                  >
                    <option value="">-- Select a Fund --</option>
                    {fundOptions
                      .filter(fund => !!fund.name)
                      .map((fund, index) => (
                        <option key={`${fund.name}-${index}`} value={fund.name}>
                          {fund.name}
                        </option>
                    ))}
                  </select>
                  {errors.fundName && (
                    <span className="error-message">{errors.fundName}</span>
                  )}
                </div>

                {[
                  { label: 'Manager Name', name: 'managerName', placeholder: 'e.g. Bain Capital' },
                  { label: 'Manager Country', name: 'managerCountry', placeholder: 'e.g. Australia' },
                  { label: 'Date of Meeting', name: 'meetingDate', type: 'date' },
                  { label: 'Manager AUM (USD)', name: 'managerAUM', placeholder: 'e.g. 100,000,000,000' },
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