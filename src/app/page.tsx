"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./dashboard.css";

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
  const { data: session, status } = useSession();
  const [funds, setFunds] = useState<Fund[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownQuery, setDropdownQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  // Fetch funds for tools-search and general display
  useEffect(() => {
    if (status === "authenticated") {
      async function fetchFunds() {
        const res = await fetch("/api/funds");
        const data = await res.json();
        setFunds(data);
      }
      fetchFunds();
    }
  }, [status]);

  // tools-search: server search
  useEffect(() => {
    if (status === "authenticated") {
      if (searchQuery === "") {
        (async () => {
          const res = await fetch("/api/funds");
          const data = await res.json();
          setFunds(data);
        })();
      } else {
        const delayDebounce = setTimeout(async () => {
          try {
            const res = await fetch(`/api/funds?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setFunds(data);
          } catch (err) {
            console.error("Failed to search funds", err);
          }
        }, 300);
        return () => clearTimeout(delayDebounce);
      }
    }
  }, [searchQuery, status]);

  // Dropdown for top-bar search-input
  const filteredDropdownFunds = funds.filter((fund) =>
    fund.name.toLowerCase().includes(dropdownQuery.toLowerCase())
  );

  if (status === "loading" || status === "unauthenticated") return null;

  return (
    <div className="page">
      <aside className="sidebar">
        <img src="/gaf-logo.png" alt="GAF" className="sidebar-icon gaf-icon" />
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
          <div className="search-container" style={{ position: "relative" }}>
            <div className="search-box">
              <img src="/search-icon.png" alt="Search" className="search-icon" />
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
            </div>
            {showDropdown && dropdownQuery.trim() !== "" && (
              <div className="dropdown-results">
                {filteredDropdownFunds.length > 0 ? (
                  filteredDropdownFunds.slice(0, 8).map((fund) => (
                    <div
                      key={fund.id}
                      className="dropdown-item"
                      onClick={() => {
                        router.push(`/fund/${fund.id}`);
                        setShowDropdown(false);
                        setDropdownQuery("");
                      }}
                    >
                      {fund.name}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">No results</div>
                )}
              </div>
            )}
          </div>
          <div className="top-bar-right">
            <button className="create-button" onClick={() => router.push("/create")}>Create Form</button>
            <div className="avatar" onClick={() => signOut()}>Sign Out</div>
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
                <input
                  type="text"
                  className="tools-search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                  <tr
                    key={f.id}
                    className="clickable-row"
                    onClick={() => router.push(`/fund/${f.id}`)}
                  >
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