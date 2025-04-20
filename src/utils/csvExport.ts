
export const exportToCSV = (data: any[], filename: string) => {
  // Convert object array to CSV string
  const csvContent = [
    // Header row
    Object.keys(data[0]).join(','),
    // Data rows
    ...data.map(item => Object.values(item).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
