'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '../../dashboard.css';

type MeetingDetail = {
  id: number;
  meetingDate: string;
  fundSize: string;
  gafAttendees: string;
  externalAttendees: string;
  notes: string;
  fundName?: string;
};

type FundMeta = {
  id: number;
  fundTier: string;
  name: string;
  strategy: string;
  assetClass: string;
  targetNetReturn: number;
  geographicFocus: string;
  size: string;
  currency: string;
  region: string;
  managerName: string;
  tierJustification?: string;
  status?: 'accepted' | 'declined' | 'pending';
};

export default function FundMeetingsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [meetings, setMeetings] = useState<MeetingDetail[]>([]);
  const [fund, setFund] = useState<FundMeta | null>(null);

  // Fetch fund + meeting data
  useEffect(() => {
    if (!id) return;

    fetch(`/api/funds/${id}/meetings`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed with status ${res.status}`);
        const data = await res.json();
        setFund({
          id: data.id,
          fundTier: data.fundTier,
          name: data.fundName,
          strategy: data.strategy,
          assetClass: data.assetClass,
          targetNetReturn: data.targetNetReturn,
          geographicFocus: data.geographicFocus,
          size: data.size,
          currency: data.currency,
          region: data.region,
          managerName: data.managerName,
          tierJustification: data.tierJustification,
          status: data.status
        });
        const enrichedMeetings = data.meetings.map((m: any) => ({
          ...m,
          fundName: data.fundName
        }));
        setMeetings(enrichedMeetings);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch meetings:', err);
        alert('Failed to load fund data. See console for details.');
      });
  }, [id]);

  const handleSummarise = async (meeting: MeetingDetail) => {
    const res = await fetch('/api/summarise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meeting, fund })
    });

    if (!res.ok) {
      alert('Failed to generate summary PDF');
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${fund?.name?.replace(/\s+/g, '_') || 'meeting'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const displayValue = (val: any) =>
    val !== undefined && val !== null && val !== '' ? val : '–';

  const formatNotes = (htmlString: string, limit = 65) => {
    const strippedText = htmlString.replace(/<[^>]+>/g, '');
    return strippedText.length > limit
      ? strippedText.substring(0, limit) + '...'
      : strippedText;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editableFund, setEditableFund] = useState<FundMeta | null>(null);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/funds/${editableFund!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableFund)
      });

      if (!res.ok) throw new Error('Failed to update fund');
      const updated = await res.json();

      setFund((prev) => ({
        ...prev!,
        name: updated.name,
        fundTier: updated.tier,
        size: updated.size,
        assetClass: updated.assetClass,
        strategy: updated.strategy,
        targetNetReturn: updated.targetNetReturn,
        geographicFocus: updated.geographicFocus,
        currency: updated.currency,
        region: updated.region,
        managerName: updated.managerName,
        tierJustification: updated.tierJustification,
        status: updated.status
      }));

      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Could not save changes.');
    }
  };

  const [allFunds, setAllFunds] = useState<FundMeta[]>([]);
  const [dropdownQuery, setDropdownQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {

    const fetchFunds = async () => {
      try {
        const res = await fetch('/api/funds');
        const data = await res.json();
        const formatted = data.map((f: any) => ({
          id: f.id,
          fundTier: f.tier || '',
          name: f.name,
          strategy: f.strategy,
          assetClass: f.assetClass,
          targetNetReturn: f.targetNetReturn,
          geographicFocus: f.geographicFocus,
          size: f.size,
          currency: f.currency,
          region: f.region,
          managerName: f.manager.managerName
        }));
        setAllFunds(formatted);
      } catch (err) {
        console.error('❌ Failed to load funds for search:', err);
      }
    };

    fetchFunds();
  }, []);

  const filteredDropdownFunds = allFunds.filter((fund) =>
    fund.name.toLowerCase().includes(dropdownQuery.toLowerCase()) ||
    fund.strategy.toLowerCase().includes(dropdownQuery.toLowerCase()) ||
    fund.geographicFocus.toLowerCase().includes(dropdownQuery.toLowerCase()) ||
    fund.region.toLowerCase().includes(dropdownQuery.toLowerCase())
  );

  return (
    <div className="page">
      <aside className="sidebar">
        <div
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
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
            <div className="search-box">
              <img src="/search-icon.png" alt="Search" className="search-icon" />
              <div style={{ position: "relative" }}>
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

                {showDropdown && dropdownQuery.trim() !== "" && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    minWidth: "100%",   // Match the input width
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderTop: "none",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    borderBottomLeftRadius: "6px",
                    borderBottomRightRadius: "6px"
                  }}>
                    {filteredDropdownFunds.length > 0 ? (
                      filteredDropdownFunds.slice(0, 8).map((fund) => (
                        <div
                          key={fund.id}
                          onClick={() => {
                            router.push(`/fund/${fund.id}`);
                            setShowDropdown(false);
                            setDropdownQuery("");
                          }}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer"
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                        >
                          <span style={{ color: "black", fontWeight: "bold" }}>{fund.name}</span>{" "}
                          <span style={{ color: "grey" }}>
                            | {fund.region}, {fund.strategy}
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
            <button className="create-button" onClick={() => router.push('/create')}>Create Form</button>
          </div>
        </div>

        {fund && (
          <div className="section fund-dashboard">
            <div className="fund-summary-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap'}}>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editableFund?.name || ''}
                      onChange={(e) => setEditableFund(prev => ({ ...prev!, name: e.target.value }))}
                      className="edit-input fund-name-input"
                      style={{ minWidth: '200px', flex: '0 0 auto', fontSize: '16px', fontWeight: '700'}}
                    />
                    <span style={{ whiteSpace: 'nowrap' }}>— Summary</span>
                  </>
                ) : (
                  `${fund?.name} — Summary`
                )}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {isEditing ? (
                  <div className="status-toggle-wrapper">
                    <div className={`status-toggle-switch-multi ${editableFund?.status?.toLowerCase().replace(/ /g, '-')}`}>
                      {['accepted', 'pending', 'declined'].map((status) => (
                        <div
                          key={status}
                          className="status-toggle-option"
                          onClick={() =>
                            setEditableFund((prev) => 
                              prev ? { ...prev, status: status } : null
                            )
                          }
                        >
                          <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                        </div>
                      ))}
                      <div className={`status-toggle-slider ${editableFund?.status?.toLowerCase().replace(/ /g, '-')}`}></div>
                    </div>
                  </div>
                ) : (
                  <span className={`status-display-pill ${fund.status?.toLowerCase().replace(/ /g, '-') || 'unknown'}`}>
                    {fund.status}
                  </span>
                )}
                <button className="edit-button" onClick={() => { setEditableFund(fund); setIsEditing(true); }}>EDIT</button>
              </div>
            </div>
            <hr className="dashboard-divider" />
            <div className="dashboard-grid">
              <div className="dashboard-field">
                <span className="dashboard-label">Tier</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableFund?.fundTier || ''}
                    onChange={(e) => setEditableFund(prev => ({ ...prev!, fundTier: e.target.value }))}
                    className="edit-input"
                  />
                ) : (
                  <span className="dashboard-value">{displayValue(fund.fundTier)}</span>
                )}
              </div>

              <div className="dashboard-field">
                <span className="dashboard-label">Asset Class</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableFund?.assetClass || ''}
                    onChange={(e) => setEditableFund(prev => ({ ...prev!, assetClass: e.target.value }))}
                    className="edit-input"
                  />
                ) : (
                  <span className="dashboard-value">{displayValue(fund.assetClass)}</span>
                )}
              </div>

              <div className="dashboard-field">
                <span className="dashboard-label">Target Net IRR</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editableFund?.targetNetReturn || ''}
                    onChange={(e) => setEditableFund(prev => ({ ...prev!, targetNetReturn: parseFloat(e.target.value) || 0 }))}
                    className="edit-input"
                  />
                ) : (
                  <span className="dashboard-value">{displayValue(fund.targetNetReturn)}%</span>
                )}
              </div>

              <div className="dashboard-field">
                <span className="dashboard-label">Geographic Focus</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableFund?.geographicFocus || ''}
                    onChange={(e) => setEditableFund(prev => ({ ...prev!, geographicFocus: e.target.value }))}
                    className="edit-input"
                  />
                ) : (
                  <span className="dashboard-value">{displayValue(fund.geographicFocus)}</span>
                )}
              </div>

              <div className="dashboard-field">
                <span className="dashboard-label">Fund Size (AUD)</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editableFund?.size || ''}
                    onChange={(e) => setEditableFund(prev => ({ ...prev!, size: e.target.value }))}
                    className="edit-input"
                  />
                ) : (
                  <span className="dashboard-value">
                    {fund.size ? `$${Number(fund.size).toLocaleString()}` : '–'}
                  </span>
                )}
              </div>

              <div className="dashboard-field">
                <span className="dashboard-label">Currency</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableFund?.currency || ''}
                    onChange={(e) => setEditableFund(prev => ({ ...prev!, currency: e.target.value }))}
                    className="edit-input"
                  />
                ) : (
                  <span className="dashboard-value">{displayValue(fund.currency)}</span>
                )}
              </div>

              <div className="dashboard-field">
                <span className="dashboard-label">Region</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableFund?.region || ''}
                    onChange={(e) => setEditableFund(prev => ({ ...prev!, region: e.target.value }))}
                    className="edit-input"
                  />
                ) : (
                  <span className="dashboard-value">{displayValue(fund.region)}</span>
                )}
              </div>

              <div className="dashboard-field">
                <span className="dashboard-label">Manager Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableFund?.managerName || ''}
                    onChange={(e) => setEditableFund(prev => ({ ...prev!, managerName: e.target.value }))}
                    className="edit-input"
                  />
                ) : (
                  <span className="dashboard-value">{displayValue(fund.managerName)}</span>
                )}
              </div>
            </div>
            <div className="dashboard-field-full">
              <span className="dashboard-label">Tier Justification</span>
              {isEditing ? (
                <textarea
                  value={editableFund?.tierJustification || ''}
                  onChange={(e) =>
                    setEditableFund((prev) => ({ ...prev!, tierJustification: e.target.value }))
                  }
                  className="edit-textarea"
                  rows={3}
                />
              ) : (
                <span className="dashboard-value">{displayValue(fund.tierJustification)}</span>
              )}
            </div>

            {isEditing && (
              <div className="edit-controls">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            )}
          </div>
        )}

        <div className="main">
          <div className="section manager-header">
          <img src="/database-icon.png" alt="Database" className="section-icon" />
          <div className="section-text">
            <h2>{fund?.name} — Engagement History</h2>
            <p>Review previous meeting records and apply AI to summarise due diligence efforts for this fund.</p>
          </div>
        </div>

        <div className="section">
          <div className="manager-table-container">
            <table className="manager-table">
              <thead>
                <tr>
                  <th>Meeting Date</th>
                  <th>GAF Attendees</th>
                  <th>External Attendees</th>
                  <th>General Notes</th>
                  <th>Summarise</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.meetingDate).toLocaleDateString()}</td>
                    <td>{m.gafAttendees}</td>
                    <td>{m.externalAttendees}</td>
                    <td>{formatNotes(m.notes)}</td>
                    <td>
                      <button className="summarise-button" onClick={() => handleSummarise(m)}>
                        Summarise
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}