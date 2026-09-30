'use client';

import React, { useState } from 'react';
import { fetchTableData, TableDataResult } from './actions';

export default function ViewTablePage() {
  const [tableName, setTableName] = useState<string>('users');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TableDataResult | null>(null);

  const handleFetch = async () => {
    setIsLoading(true);
    setResult(null);

    // Pass the typed variable to the backend
    const data = await fetchTableData(tableName);

    setResult(data);
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>View Supabase Table Data</h2>

      {/* Search Input Area */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Enter table name to view..."
          style={{ padding: '8px 12px', fontSize: '14px', width: '250px' }}
        />
        <button
          onClick={handleFetch}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0f766e',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Loading Data...' : 'Fetch Data'}
        </button>
      </div>

      {/* Show Error or Success Message */}
      {result && (
        <div style={{ marginBottom: '20px', color: result.success ? 'green' : 'red' }}>
          <strong>{result.success ? 'Success: ' : 'Error: '}</strong>
          {result.message}
        </div>
      )}

      {/* Dynamically Rendered HTML Table */}
      {result && result.success && result.columns.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table
            border={1}
            cellPadding={10}
            cellSpacing={0}
            style={{ width: '100%', borderCollapse: 'collapse', borderColor: '#ccc' }}
          >
            {/* Table Header: Loop through the dynamic column names */}
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                {result.columns.map((colName) => (
                  <th key={colName} style={{ textAlign: 'left' }}>
                    {colName}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body: Loop through the rows, then loop through the columns to get values */}
            <tbody>
              {result.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {result.columns.map((colName) => (
                    <td key={colName}>
                      {/* Convert object/boolean/null values to string so React doesn't crash */}
                      {row[colName] !== null && typeof row[colName] === 'object'
                        ? JSON.stringify(row[colName])
                        : String(row[colName] ?? 'NULL')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
