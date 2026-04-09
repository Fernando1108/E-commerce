export function exportToCSV(data: Record<string, unknown>[], filename: string, columns?: { key: string; label: string }[]) {
  if (!data || data.length === 0) return

  const keys = columns ? columns.map(c => c.key) : Object.keys(data[0])
  const headers = columns ? columns.map(c => c.label) : keys

  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      keys.map(key => {
        const value = row[key]
        if (value === null || value === undefined) return ''
        const str = String(value)
        // Escapar comillas y valores con comas
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }).join(',')
    ),
  ]

  const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
