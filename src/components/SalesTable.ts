import React from 'react';

// 1. Define the shape of a single Sale object
interface SaleRecord {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Refunded'; // Union type limits values to these three
}

const SalesTable: React.FC = () => {
  // 2. Dummy data typed with the interface above
  const salesData: SaleRecord[] = [
    { id: "TRX-8801", date: "2025-12-16", customer: "Walk-in", amount: 1500.00, status: "Completed" },
    { id: "TRX-8802", date: "2025-12-16", customer: "John Doe", amount: 450.50, status: "Pending" },
    { id: "TRX-8803", date: "2025-12-15", customer: "Jane Smith", amount: 3200.00, status: "Completed" },
    { id: "TRX-8804", date: "2025-12-14", customer: "Walk-in", amount: 120.00, status: "Refunded" },
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Recent Sales History</h3>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Transaction ID</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((sale) => (
            <tr key={sale.id} style={styles.tableRow}>
              <td style={styles.td}>{sale.id}</td>
              <td style={styles.td}>{sale.date}</td>
              <td style={styles.td}>{sale.customer}</td>
              <td style={styles.td}>${sale.amount.toFixed(2)}</td>
              <td style={styles.td}>
                {/* Conditional styling based on status */}
                <span style={
                  sale.status === "Completed" ? styles.badgeSuccess : 
                  sale.status === "Pending" ? styles.badgeWarning : 
                  styles.badgeDanger
                }>
                  {sale.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 3. Define styles with React.CSSProperties for type safety
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: '20px'
  },
  header: {
    marginBottom: '15px',
    color: '#333',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',