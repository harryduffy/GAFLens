'use client';

import { useEffect, useState } from 'react';
import './dashboard.css';
import { useRouter } from 'next/navigation';

interface Fund {
  id: number;
  name: string;
  strategy: string;
  assetClass: string;
  targetNetReturn: number;
  geographicFocus: string;
  size: string;
  currency: string;
  region: string;
  manager: {
    managerName: string;
  };
}

export default function Home() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/funds');
        const data = await res.json();
        setFunds(data);
      } catch (err) {
        console.error('Failed to fetch funds', err);
      }
    }

    fetchData();
  }, []);

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
              <input type="text" placeholder="Search GAF fund database..." className="search-input" />
            </div>
          </div>
          <div className="top-bar-right">
            <button className="create-button" onClick={() => router.push('/create')}>Create Form</button>
            <div className="avatar">DW</div>
          </div>
        </div>

        <div className="section manager-header">
          <img src="/database-icon.png" alt="Database" className="section-icon" />
          <div className="section-text">
            <h2>Fund Database</h2>
            <p>
              Search, filter, and compare funds across strategy, asset class, manager, and more to support informed selection and collaboration.
            </p>
          </div>
        </div>

        <div className="section">
          <div className="tools-bar">
            <div className="tools-left">
              <span className="tool-link">Filter</span>
              <span className="tool-link">Sort</span>
              <span className="tool-link">···</span>
            </div>
            <div className="tools-right">
              <div className="search-box">
                <img src="/search-icon.png" alt="Search" className="search-icon" />
                <input type="text" className="tools-search" placeholder="Search" />
              </div>
              <button className="tools-button">New</button>
            </div>
          </div>

          <div className="manager-table-container">
            <table className="manager-table">
              <thead>
                <tr>
                  <th>Fund</th>
                  <th>Manager</th>
                  <th>Region</th>
                  <th>Currency</th>
                  <th>Target Return</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((f) => (
                  <tr key={f.id} className="clickable-row">
                    <td>{f.name}</td>
                    <td>{f.manager.managerName}</td>
                    <td>{f.region}</td>
                    <td>{f.currency}</td>
                    <td>{f.targetNetReturn}%</td>
                    <td>${parseInt(f.size).toLocaleString()}</td>
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
