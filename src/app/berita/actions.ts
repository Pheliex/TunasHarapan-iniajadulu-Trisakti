'use server';

import { Client } from 'pg';

export interface TableDataResult {
  success: boolean;
  message: string;
  columns: string[];               // To hold dynamic column names
  rows: Record<string, any>[];     // To hold the actual row data
}

export async function fetchTableData(tableName: string): Promise<TableDataResult> {
  // Step 1: VERY IMPORTANT! Clean the variable so it only contains letters, numbers, or underscores.
  // This prevents SQL injection since we cannot use parameterized queries for table names.
  const cleanTableName = tableName.trim().replace(/[^a-zA-Z0-9_]/g, '');

  if (!cleanTableName) {
    return {
      success: false,
      message: 'Invalid table name provided.',
      columns: [],
      rows: [],
    };
  }

  // Step 2: Initialize the client
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Step 3: Open connection
    await client.connect();

    // Step 4: Construct the SELECT query using the variable.
    // We add LIMIT 100 so we don't crash the browser if the table has millions of rows.
    const sqlQuery = `SELECT * FROM "${cleanTableName}" LIMIT 100;`;

    // Step 5: Execute the query
    const result = await client.query(sqlQuery);

    // Step 6: Extract column names from the database driver metadata
    const columnNames: string[] = [];
    for (let i = 0; i < result.fields.length; i++) {
      columnNames.push(result.fields[i].name);
    }

    // Step 7: Close connection
    await client.end();

    return {
      success: true,
      message: `Successfully fetched ${result.rows.length} rows from "${cleanTableName}".`,
      columns: columnNames,
      rows: result.rows,
    };
  } catch (error) {
    // Make sure connection closes on error
    await client.end().catch(() => {});

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch table data.',
      columns: [],
      rows: [],
    };
  }
}
