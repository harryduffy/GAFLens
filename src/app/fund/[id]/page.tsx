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
  fundName?: string; // <-- added
};

type FundMeta = {
  id: number;
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
  const { id } = useParams();
  const router = useRouter();
  const [meetings, setMeetings] = useState<MeetingDetail[]>([]);
  const [fund, setFund] = useState<FundMeta | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/funds/${id}/meetings`)
      .then(res => res.json())
      .then(data => {
        // Store fund info
        setFund({
          id: parseInt(id as string),
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

        // Append fundName to each meeting for backend use
        const enrichedMeetings = data.meetings.map((m: any) => ({
          ...m,
          fundName: data.fundName
        }));

        setMeetings(enrichedMeetings);
      })
      .catch(err => console.error('Failed to fetch meetings', err));
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
              <div className="avatar">DW</div>
            </div>
        </div>

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
                  <th>Fund Size</th>
                  <th>GAF Attendees</th>
                  <th>External Attendees</th>
                  <th>Summarise</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.meetingDate).toLocaleDateString()}</td>
                    <td>${parseInt(m.fundSize).toLocaleString()}</td>
                    <td>{m.gafAttendees}</td>
                    <td>{m.externalAttendees}</td>
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