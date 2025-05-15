'use client';
import { useEffect, useState } from 'react';
import './dashboard.css';

type ManagerMeeting = {
  id: number;
  managerName: string;
  lastMeetingDate: string;
  region: string;
  currency: string;
  AUM: string;
  gafAttendees: string;
  externalAttendees: string;
};

export default function Home() {
  const [meetings, setMeetings] = useState<ManagerMeeting[]>([]);

  useEffect(() => {
    fetch('/api/managers')
      .then(res => res.json())
      .then(data => {
        console.log('API response:', data);
        setMeetings(data);
      })
      .catch(err => console.error('Failed to fetch data', err));
  }, []);

  return (
    <div className="page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="circle gray" />
        <div className="circle green" />
        <div className="circle blue" />
        <div className="circle purple" />
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

        <div className="section">
          <h2>Manager Database</h2>
          <p>
            Search, filter, and compare managers across strategy, asset class, performance,
            and more to support informed selection and collaboration.
          </p>
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
                {meetings.map((m) => (
                  <tr key={m.id}>
                    <td>{m.managerName}</td>
                    <td>{new Date(m.lastMeetingDate).toLocaleDateString()}</td>
                    <td>{m.region}</td>
                    <td>{m.currency}</td>
                    <td>
                      {m.AUM && !isNaN(parseInt(m.AUM))
                        ? `$${parseInt(m.AUM).toLocaleString()}`
                        : '—'}
                    </td>
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