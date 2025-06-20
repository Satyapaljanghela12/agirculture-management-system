interface ExportData {
  title: string;
  data: any[];
  columns: { key: string; label: string; width?: number }[];
  summary?: { [key: string]: any };
}

export const exportToPDF = async (exportData: ExportData) => {
  try {
    // Create a new window for the PDF content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please check your popup blocker.');
    }

    // Generate HTML content for the PDF
    const htmlContent = generatePDFHTML(exportData);
    
    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
    
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

const generatePDFHTML = (exportData: ExportData): string => {
  const { title, data, columns, summary } = exportData;
  const currentDate = new Date().toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title} - AgriManage Report</title>
      <style>
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #1f2937;
          margin: 0;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #059669;
          padding-bottom: 20px;
        }
        
        .header h1 {
          color: #059669;
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: bold;
        }
        
        .header .subtitle {
          color: #6b7280;
          font-size: 16px;
          margin: 5px 0;
        }
        
        .header .date {
          color: #9ca3af;
          font-size: 14px;
        }
        
        .summary {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .summary h2 {
          color: #1f2937;
          margin: 0 0 15px 0;
          font-size: 18px;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }
        
        .summary-item {
          background: white;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        
        .summary-item .label {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .summary-item .value {
          color: #1f2937;
          font-size: 20px;
          font-weight: bold;
        }
        
        .table-container {
          margin-top: 20px;
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        
        th {
          background: #059669;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }
        
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 13px;
        }
        
        tr:nth-child(even) {
          background: #f9fafb;
        }
        
        tr:hover {
          background: #f3f4f6;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        
        .no-data {
          text-align: center;
          color: #6b7280;
          font-style: italic;
          padding: 40px;
        }
        
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .status-active { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-completed { background: #dbeafe; color: #1e40af; }
        .status-overdue { background: #fee2e2; color: #dc2626; }
        
        @media print {
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>AgriManage</h1>
        <div class="subtitle">${title}</div>
        <div class="date">Generated on ${currentDate}</div>
      </div>
      
      ${summary ? generateSummaryHTML(summary) : ''}
      
      <div class="table-container">
        ${data.length > 0 ? generateTableHTML(data, columns) : '<div class="no-data">No data available for this report.</div>'}
      </div>
      
      <div class="footer">
        <p>This report was generated by AgriManage Farm Management System</p>
        <p>© ${new Date().getFullYear()} AgriManage. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

const generateSummaryHTML = (summary: { [key: string]: any }): string => {
  const summaryItems = Object.entries(summary).map(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    const formattedValue = typeof value === 'number' ? 
      (key.toLowerCase().includes('cost') || key.toLowerCase().includes('revenue') || key.toLowerCase().includes('profit') ? 
        `₹${value.toLocaleString('en-IN')}` : value.toLocaleString('en-IN')) : value;
    
    return `
      <div class="summary-item">
        <div class="label">${label}</div>
        <div class="value">${formattedValue}</div>
      </div>
    `;
  }).join('');
  
  return `
    <div class="summary">
      <h2>Summary</h2>
      <div class="summary-grid">
        ${summaryItems}
      </div>
    </div>
  `;
};

const generateTableHTML = (data: any[], columns: { key: string; label: string; width?: number }[]): string => {
  const headerRow = columns.map(col => `<th style="${col.width ? `width: ${col.width}px;` : ''}">${col.label}</th>`).join('');
  
  const dataRows = data.map(row => {
    const cells = columns.map(col => {
      let value = row[col.key];
      
      // Format different types of data
      if (value === null || value === undefined) {
        value = '-';
      } else if (typeof value === 'boolean') {
        value = value ? 'Yes' : 'No';
      } else if (typeof value === 'number') {
        if (col.key.toLowerCase().includes('cost') || col.key.toLowerCase().includes('price') || col.key.toLowerCase().includes('amount')) {
          value = `₹${value.toLocaleString('en-IN')}`;
        } else if (col.key.toLowerCase().includes('percent') || col.key.toLowerCase().includes('progress')) {
          value = `${value}%`;
        } else {
          value = value.toLocaleString('en-IN');
        }
      } else if (col.key.toLowerCase().includes('date')) {
        value = new Date(value).toLocaleDateString();
      } else if (col.key.toLowerCase().includes('status')) {
        value = `<span class="status-badge status-${value.toLowerCase().replace(/\s+/g, '-')}">${value}</span>`;
      }
      
      return `<td>${value}</td>`;
    }).join('');
    
    return `<tr>${cells}</tr>`;
  }).join('');
  
  return `
    <table>
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      <tbody>
        ${dataRows}
      </tbody>
    </table>
  `;
};

// Export functions for different data types
export const exportCropsToPDF = (crops: any[]) => {
  const summary = {
    totalCrops: crops.length,
    totalArea: crops.reduce((sum, crop) => sum + crop.area, 0),
    activeCrops: crops.filter(c => c.status !== 'harvested').length,
    averageProgress: Math.round(crops.reduce((sum, crop) => sum + crop.progress, 0) / crops.length)
  };
  
  return exportToPDF({
    title: 'Crops Report',
    data: crops,
    columns: [
      { key: 'name', label: 'Crop Name', width: 120 },
      { key: 'variety', label: 'Variety', width: 100 },
      { key: 'field', label: 'Field', width: 80 },
      { key: 'area', label: 'Area (acres)', width: 80 },
      { key: 'status', label: 'Status', width: 80 },
      { key: 'progress', label: 'Progress (%)', width: 80 },
      { key: 'health', label: 'Health', width: 80 },
      { key: 'plantedDate', label: 'Planted', width: 100 },
      { key: 'expectedHarvest', label: 'Expected Harvest', width: 120 }
    ],
    summary
  });
};

export const exportTasksToPDF = (tasks: any[]) => {
  const summary = {
    totalTasks: tasks.length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    overdueTasks: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  };
  
  return exportToPDF({
    title: 'Tasks Report',
    data: tasks,
    columns: [
      { key: 'title', label: 'Task', width: 150 },
      { key: 'category', label: 'Category', width: 100 },
      { key: 'priority', label: 'Priority', width: 80 },
      { key: 'status', label: 'Status', width: 80 },
      { key: 'assignee', label: 'Assignee', width: 100 },
      { key: 'dueDate', label: 'Due Date', width: 100 },
      { key: 'estimatedHours', label: 'Est. Hours', width: 80 },
      { key: 'actualHours', label: 'Actual Hours', width: 80 }
    ],
    summary
  });
};

export const exportFinanceToPDF = (transactions: any[]) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  const summary = {
    totalTransactions: transactions.length,
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses
  };
  
  return exportToPDF({
    title: 'Financial Report',
    data: transactions,
    columns: [
      { key: 'date', label: 'Date', width: 100 },
      { key: 'description', label: 'Description', width: 200 },
      { key: 'category', label: 'Category', width: 120 },
      { key: 'type', label: 'Type', width: 80 },
      { key: 'amount', label: 'Amount', width: 100 },
      { key: 'paymentMethod', label: 'Payment Method', width: 120 }
    ],
    summary
  });
};

export const exportInventoryToPDF = (inventory: any[]) => {
  const summary = {
    totalItems: inventory.length,
    lowStockItems: inventory.filter(i => i.currentStock <= i.minStock).length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0),
    categories: [...new Set(inventory.map(i => i.category))].length
  };
  
  return exportToPDF({
    title: 'Inventory Report',
    data: inventory,
    columns: [
      { key: 'name', label: 'Item Name', width: 150 },
      { key: 'category', label: 'Category', width: 100 },
      { key: 'currentStock', label: 'Current Stock', width: 100 },
      { key: 'unit', label: 'Unit', width: 60 },
      { key: 'minStock', label: 'Min Stock', width: 80 },
      { key: 'costPerUnit', label: 'Cost/Unit', width: 80 },
      { key: 'supplier', label: 'Supplier', width: 120 },
      { key: 'location', label: 'Location', width: 100 }
    ],
    summary
  });
};

export const exportEquipmentToPDF = (equipment: any[]) => {
  const summary = {
    totalEquipment: equipment.length,
    activeEquipment: equipment.filter(e => e.status === 'active').length,
    maintenanceDue: equipment.filter(e => new Date(e.nextMaintenance) <= new Date()).length,
    totalMaintenanceCost: equipment.reduce((sum, e) => sum + e.maintenanceCost, 0)
  };
  
  return exportToPDF({
    title: 'Equipment Report',
    data: equipment,
    columns: [
      { key: 'name', label: 'Equipment Name', width: 150 },
      { key: 'type', label: 'Type', width: 100 },
      { key: 'model', label: 'Model', width: 120 },
      { key: 'status', label: 'Status', width: 80 },
      { key: 'hoursUsed', label: 'Hours Used', width: 80 },
      { key: 'lastMaintenance', label: 'Last Maintenance', width: 120 },
      { key: 'nextMaintenance', label: 'Next Maintenance', width: 120 },
      { key: 'maintenanceCost', label: 'Maintenance Cost', width: 120 }
    ],
    summary
  });
};

export const exportFieldsToPDF = (fields: any[]) => {
  const summary = {
    totalFields: fields.length,
    totalArea: fields.reduce((sum, field) => sum + field.area, 0),
    activeFields: fields.filter(f => f.status === 'active').length,
    averageSoilPH: (fields.reduce((sum, field) => sum + field.soilPH, 0) / fields.length).toFixed(1)
  };
  
  return exportToPDF({
    title: 'Fields Report',
    data: fields,
    columns: [
      { key: 'name', label: 'Field Name', width: 120 },
      { key: 'area', label: 'Area (acres)', width: 100 },
      { key: 'soilType', label: 'Soil Type', width: 100 },
      { key: 'soilPH', label: 'Soil pH', width: 80 },
      { key: 'currentCrop', label: 'Current Crop', width: 120 },
      { key: 'status', label: 'Status', width: 80 },
      { key: 'irrigationSystem', label: 'Irrigation', width: 100 },
      { key: 'lastTested', label: 'Last Tested', width: 100 }
    ],
    summary
  });
};