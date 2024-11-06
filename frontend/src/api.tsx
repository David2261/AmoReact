const API_URL = 'http://localhost:3000/api';

export async function getPolls() {
  const response = await fetch(`${API_URL}/polls`);
  return await response.json();
}

export async function createPoll(data: []) {
  const response = await fetch(`${API_URL}/polls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deletePoll(id: number) {
  return await fetch(`${API_URL}/polls/${id}`, { method: 'DELETE' });
}

export async function voteOnPoll(id: number, option: string) {
  return await fetch(`${API_URL}/polls/${id}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ option }),
  });
}
