async function pingUrl() {
    const url = document.getElementById('urlInput').value;
    const response = await fetch('/ping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });
    const result = await response.json();
    displayResult(result);
  }

  function displayResult(result) {
    const resultsTable = document.getElementById('resultsTable');
    const row = `
      <tr>
        <td>${result.url}</td>
        <td>${result.status}</td>
        <td>${result.responseTime}</td>
        <td>${result.lastRefreshedTime}</td>
      </tr>
    `;
    resultsTable.innerHTML += row;
  }

  function exportResults() {
    // Implement export functionality here
  }