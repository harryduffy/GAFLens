"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
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

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

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

  const filteredDropdownFunds = funds.filter((fund) =>
    fund.name.toLowerCase().includes(dropdownQuery.toLowerCase()) ||
    fund.strategy.toLowerCase().includes(dropdownQuery.toLowerCase()) ||
    fund.geographicFocus.toLowerCase().includes(dropdownQuery.toLowerCase()) ||
    fund.region.toLowerCase().includes(dropdownQuery.toLowerCase())
  );

  const handleSort = (column: string, isNumeric: boolean) => {
    let direction = "asc";
    if (sortColumn === column) {
      direction = sortDirection === "asc" ? "desc" : "asc";
    }
    setSortColumn(column);
    setSortDirection(direction as "asc" | "desc");

    const sorted = [...funds].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (column === "managerName") {
        aValue = a.manager.managerName;
        bValue = b.manager.managerName;
      } else {
        aValue = a[column as keyof Fund];
        bValue = b[column as keyof Fund];
      }

      if (isNumeric) {
        return direction === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      } else {
        return direction === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    });
    setFunds(sorted);
  };

  const handleExportToXLSX = () => {
    if (funds.length === 0) return;

    const worksheetData = [
      ["Fund", "Manager", "Region", "Currency", "Target Return", "Size"],
      ...funds.map((f) => [
        f.name,
        f.manager.managerName,
        f.region,
        f.currency,
        `${f.targetNetReturn}%`,
        `$${parseInt(f.size).toLocaleString()}`
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FundDatabase");

    XLSX.writeFile(workbook, "fund-database.xlsx");
  };

  if (status === "loading" || status === "unauthenticated") return null;

  return (
    <div className="page">
      <aside className="sidebar">
        <div onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
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
                      <span style={{ color: "black", fontWeight: "bold" }}>{fund.name}</span>{" "}
                      <span style={{ color: "grey" }}>
                        | {fund.region}, {fund.strategy}
                      </span>
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
              <span className="tool-link" onClick={handleExportToXLSX} style={{ cursor: "pointer" }}>
                Export
              </span>
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
                  <th onClick={() => handleSort("name", false)}>Fund</th>
                  <th onClick={() => handleSort("managerName", false)}>Manager</th>
                  <th onClick={() => handleSort("region", false)}>Region</th>
                  <th onClick={() => handleSort("currency", false)}>Currency</th>
                  <th onClick={() => handleSort("targetNetReturn", true)}>Target Return</th>
                  <th onClick={() => handleSort("size", true)}>Size</th>
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