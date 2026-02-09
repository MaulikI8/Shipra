// Export utilities for PDF, CSV, and Excel

export function exportToCSV(data: any[], filename: string = 'export') {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value ?? ''
      }).join(',')
    )
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportToJSON(data: any[], filename: string = 'export') {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.json`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// For Excel export, we'll use a simple CSV approach
// For full Excel support, you'd need a library like xlsx
export function exportToExcel(data: any[], filename: string = 'export') {
  // For now, export as CSV with .xlsx extension
  // In production, use xlsx library for proper Excel format
  exportToCSV(data, filename)
}

// PDF export requires jsPDF library
export async function exportToPDF(
  title: string,
  data: any[],
  columns: string[],
  filename: string = 'export'
) {
  try {
    // Try dynamic import, fallback to CSV if not available
    const jsPDF = await import('jspdf').catch(() => null)
    
    if (!jsPDF) {
      // Fallback: export as CSV with PDF extension
      exportToCSV(data, filename)
      throw new Error('PDF library not installed. Exported as CSV instead. Install jspdf for PDF support: npm install jspdf')
    }
    
    const doc = new jsPDF.default()
    
    // Add title
    doc.setFontSize(16)
    doc.text(title, 14, 22)
    
    // Add date
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)
    
    // Simple table (for complex tables, use jspdf-autotable plugin)
    let y = 40
    doc.setFontSize(10)
    
    // Headers
    doc.setFont('helvetica', 'bold')
    columns.forEach((col, i) => {
      doc.text(col, 14 + (i * 50), y)
    })
    y += 10
    
    // Data rows
    doc.setFont('helvetica', 'normal')
    data.slice(0, 20).forEach((row) => { // Limit to 20 rows for simple PDF
      columns.forEach((col, i) => {
        const value = String(row[col] ?? '')
        doc.text(value.substring(0, 15), 14 + (i * 50), y) // Truncate long values
      })
      y += 7
      if (y > 280) {
        doc.addPage()
        y = 20
      }
    })
    
    doc.save(`${filename}.pdf`)
  } catch (error: any) {
    console.error('PDF export error:', error)
    throw error
  }
}

