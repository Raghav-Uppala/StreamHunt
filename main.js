async function fetchData() {
  try {
    const res = await fetch('/api/proxy'); // call your backend
    const data = await res.json();
    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById('result').textContent = 'Error fetching data';
  }
}

fetchData();
