'use client';

import { useEffect, useState } from 'react';
import './dashboard.css';
import { useRouter } from 'next/navigation';

type Manager = {
  id: number;
  managerName: string;
  region: string;
  currency: string;
  AUM: string;
};

export default function Home() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const router = useRouter();

    useEffect(() => {
    fetch('/api/managers')
      .then(res => res.json())
      .then(data => {
        console.log('API response:', data);
        setManagers(data);
      })
      .catch(err => console.error('Failed to fetch data', err));
  }, []);


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
            <button className="create-button">Create Form</button>
            <div className="avatar">DW</div>
          </div>
        </div>

        <div className="section manager-header">
          <img src="/database-icon.png" alt="Database" className="section-icon" />
          <div className="section-text">
            <h2>Manager Database</h2>
            <p>
              Search, filter, and compare managers across strategy, asset class, performance, and more to support informed selection and collaboration.
            </p>
          </div>
        </div>

        <div className="section">
          <div className="tools-bar">
            <div className="tools-left">
              <span className="tool-link">Filter</span>
              <span className="tool-link">Sort</span>
              <span className="tool-link">⋯</span>
            </div>

            <div className="tools-right">
              <div className="search-box">
                <img src="/search-icon.png" alt="Search" className="search-icon" />
                <input
                  type="text"
                  className="tools-search"
                  placeholder="Search"
                />
              </div>
              <button className="tools-button">New</button>
            </div>
          </div>

          <div className="manager-table-container">
            <table className="manager-table">
              <thead>
                <tr>
                  <th>Manager Name</th>
                  <th>Last Meeting Date</th>
                  <th>Region</th>
                  <th>Currency</th>
                  <th>AUM</th>
                  <th>GAF Attendees</th>
                  <th>External Attendees</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((m) => (
                  <tr key={m.id} onClick={() => router.push(`/manager/${encodeURIComponent(m.managerName)}`)} className="clickable-row">
                    <td>{m.managerName}</td>
                    <td>TO DO</td>
                    <td>{m.region}</td>
                    <td>{m.currency}</td>
                    <td>
                      {m.AUM && !isNaN(parseInt(m.AUM))
                        ? `$${parseInt(m.AUM).toLocaleString()}`
                        : '—'}
                    </td>
                    <td>TO DO</td>
                    <td>TO DO</td>
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