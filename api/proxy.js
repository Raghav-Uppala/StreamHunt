export default async function handler(req, res) {
  // Normally you could use process.env.MY_SECRET_KEY here
  // For this test we just call jsonplaceholder
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

