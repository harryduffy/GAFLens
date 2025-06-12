'use client';

import '../dashboard.css';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const EditorClient = dynamic(() => import('../../components/EditorClient'), { ssr: false });

type FundOption = {
  id: number;
  name: string;
  managerName?: string;
  size?: string;
  targetNetReturn?: number;
  geographicFocus?: string;
  notes?: string;
};

export default function CreateFormPage() {
  const router = useRouter();

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
  const [allFunds, setAllFunds] = useState<FundOption[]>([]);
  const [dropdownQuery, setDropdownQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch('/api/funds')
      .then(res => res.json())
      .then((data: FundOption[]) => {
        setFundOptions(data);
        setAllFunds(data);
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
      if (!res.ok) throw new Error(result.error || 'Failed to submit');

      alert('Form submitted!');
    } catch (err) {
      console.error('❌ Submission error:', err);
    }
  };

  const filteredDropdownFunds = allFunds.filter((fund) =>
    fund.name.toLowerCase().includes(dropdownQuery.toLowerCase()) ||
    (fund.geographicFocus || '').toLowerCase().includes(dropdownQuery.toLowerCase()) ||
    (fund.managerName || '').toLowerCase().includes(dropdownQuery.toLowerCase())
  );

  return (
    <div className="page">
      <aside className="sidebar">
        <div onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          <img src="/gaf-logo.png" alt="GAF" className="sidebar-icon gaf-icon" />
        </div>
        <a className="sidebar-text" href="https://globalalternativefunds.sharepoint.com/_layouts/15/sharepoint.aspx" target="_blank" rel="noopener noreferrer"><p>SharePoint</p></a>
        <a className="sidebar-text" href="https://www.salesforce.com/au/" target="_blank" rel="noopener noreferrer"><p>Salesforce</p></a>
        <a className="sidebar-text" href="https://www.preqin.com/insights" target="_blank" rel="noopener noreferrer"><p>Preqin</p></a>
      </aside>

      <div className="main">
        <div className="top-bar">
          <div className="search-container">
            <div className="search-box">
              <img src="/search-icon.png" alt="Search" className="search-icon" />
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search GAF fund database..."
                  className="search-input"
                  value={dropdownQuery}
                  onChange={(e) => {
                    setDropdownQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
                {showDropdown && dropdownQuery.trim() !== '' && (
                  <div style={{
                    position: "absolute", top: "100%", left: 0, width: "100%", backgroundColor: "white",
                    border: "1px solid #ddd", borderTop: "none", maxHeight: "200px", overflowY: "auto",
                    zIndex: 1000, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", borderBottomLeftRadius: "6px",
                    borderBottomRightRadius: "6px"
                  }}>
                    {filteredDropdownFunds.length > 0 ? (
                      filteredDropdownFunds.slice(0, 8).map((fund) => (
                        <div
                          key={fund.name}
                          onClick={() => {
                            router.push(`/fund/${fund.id}`);
                            setShowDropdown(false);
                            setDropdownQuery('');
                          }}
                          style={{ padding: "8px 12px", cursor: "pointer" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                        >
                          <span style={{ fontWeight: 'bold' }}>{fund.name}</span>{' '}
                          <span style={{ color: 'grey' }}>
                            | {fund.geographicFocus}, {fund.managerName}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: "8px 12px", color: "grey" }}>No results</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="top-bar-right">
            <button
              className="create-button"
              style={{ backgroundColor: '#ADD8E6', color: 'black' }}
              onClick={async () => {
                await fetch('/api/signout', { method: 'POST' });
                window.location.href = '/auth';
              }}
            >
              Sign Out
            </button>
            <button className="create-button" onClick={() => router.back()} style={{ borderRadius: '8px', width: '91px' }}>
              ← Back
            </button>
            <button className="create-button" onClick={handleSubmit}>Submit Data</button>
          </div>
            </div>

            <div className="section manager-header">
              <img src="/database-icon.png" alt="Database" className="section-icon" />
              <div className="section-text">
                <h2>Fund Selection Form</h2>
                <p>
                  Please complete the form below to standardise fund meeting notes and support
                  comparison, collaboration, and transparency across the selection process.
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
                        {fundOptions.filter(fund => !!fund.name).map((fund, index) => (
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
                      { label: 'GAF Attendees (CSV)', name: 'gafAttendees', placeholder: 'e.g. Jane Smith, John Smith' },
                      { label: 'External Attendees (CSV)', name: 'externalAttendees', placeholder: 'e.g. Jane Smith, John Smith' },
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
                    onChange={(content) => setFormData({ ...formData, notes: content })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
