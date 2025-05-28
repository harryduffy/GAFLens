'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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
};

export default function FundMeetingsPage() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [meetings, setMeetings] = useState<MeetingDetail[]>([]);
  const [fund, setFund] = useState<FundMeta | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && id) {
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
            managerName: data.managerName
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
    }
  }, [status, id]);

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

  const displayValue = (val: any) => (val !== undefined && val !== null && val !== '' ? val : '–');

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
        fundTier: updated.tier,
        size: updated.size,
        assetClass: updated.assetClass,
        strategy: updated.strategy,
        targetNetReturn: updated.targetNetReturn,
        geographicFocus: updated.geographicFocus,
        currency: updated.currency,
        region: updated.region,
        managerName: updated.managerName
      }));

      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Could not save changes.');
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return null; // prevents page from showing until auth is confirmed
  };

  const formatNotes = (htmlString: string, limit = 65) => {
    const strippedText = htmlString.replace(/<[^>]+>/g, ''); // Strip HTML
    return strippedText.length > limit
      ? strippedText.substring(0, limit) + '...'
      : strippedText;
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
              <input type="text" placeholder="Search GAF manager database..." className="search-input" />
            </div>
          </div>
          <div className="top-bar-right">
            <button className="create-button" onClick={() => router.push('/create')}>Create Form</button>
            <div className="avatar" onClick={() => signOut()}>Sign Out</div>
          </div>
        </div>

        {fund && (
          <div className="section fund-dashboard">
            <div className="fund-summary-header">
              <h3>{fund?.name} — Summary</h3>
              <button className="edit-button"
                  onClick={() => {
                  setEditableFund(fund); // make a working copy
                  setIsEditing(true);
                }}
              >EDIT</button>
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
            <h2>{fund?.name}</h2>
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