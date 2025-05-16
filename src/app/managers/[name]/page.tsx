'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import '../dashboard.css';

export default function ManagerDetailPage() {
  const { name } = useParams();
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    fetch(`/api/meetings/${encodeURIComponent(name)}`)
      .then(res => res.json())
      .then(data => setMeetings(data))
      .catch(err => console.error('Failed to fetch meetings', err));
  }, [name]);

  return (
    <div className="main">
      <div className="section">
        <h2>{name} Database</h2>
        <p>View historical meetings with {name} across strategies, regions, and funds.</p>
      </div>

      <div className="section">
        <table className="manager-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Fund Name</th>
              <th>Asset Classes</th>
              <th>Strategies</th>
              <th>Return Target (%)</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m: any) => (
              <tr key={m.id}>
                <td>{new Date(m.meetingDate).toLocaleDateString()}</td>
                <td>{m.fundName}</td>
                <td>{m.assetClasses}</td>
                <td>{m.investmentStrategies}</td>
                <td>{m.fundTargetNetReturn}%</td>
                <td>{m.notes.slice(0, 60)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
