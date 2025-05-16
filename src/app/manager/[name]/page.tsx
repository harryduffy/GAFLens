'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import '../../dashboard.css';

type MeetingDetail = {
  id: number;
  managerName: string;
  meetingDate: string;
  fundName: string;
  fundSize: string;
  assetClasses: string;
  investmentStrategies: string;
  fundTargetNetReturn: number;
  gafAttendees: string;
  externalAttendees: string;
};

export default function ManagerMeetingsPage() {
  const { name } = useParams();
  const [meetings, setMeetings] = useState<MeetingDetail[]>([]);

  useEffect(() => {
    if (!name) return;

    fetch(`/api/meetings/${encodeURIComponent(name as string)}`)
      .then(res => res.json())
      .then(data => {
        console.log('Meetings API response:', data);
        setMeetings(data);
      })
      .catch(err => console.error('Failed to fetch meetings', err));
  }, [name]);

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
            <button className="create-button">Create Form</button>
            <div className="avatar">DW</div>
          </div>
        </div>

        <div className="section manager-header">
          <img src="/database-icon.png" alt="Database" className="section-icon" />
          <div className="section-text">
            <h2>{decodeURIComponent(name as string)} Database</h2>
            <p>Meeting history for {decodeURIComponent(name as string)}</p>
          </div>
        </div>

        <div className="section">
          <div className="manager-table-container">
            <table className="manager-table">
              <thead>
                <tr>
                  <th>Meeting Date</th>
                  <th>Fund Name</th>
                  <th>Fund Size</th>
                  <th>Asset Classes</th>
                  <th>Strategies</th>
                  <th>Return Target (%)</th>
                  <th>GAF Attendees</th>
                  <th>External Attendees</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.meetingDate).toLocaleDateString()}</td>
                    <td>{m.fundName}</td>
                    <td>{`$${parseInt(m.fundSize).toLocaleString()}`}</td>
                    <td>{m.assetClasses}</td>
                    <td>{m.investmentStrategies}</td>
                    <td>{m.fundTargetNetReturn}%</td>
                    <td>{m.gafAttendees}</td>
                    <td>{m.externalAttendees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
