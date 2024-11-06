import React, { useEffect, useState } from 'react';
import { getPolls, deletePoll } from '../api';
import Poll from './Poll';
import socket from '../socket';

function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolls();
    socket.on('pollUpdated', fetchPolls);
    return () => {
      socket.off('pollUpdated', fetchPolls);
    };
  }, []);

  async function fetchPolls() {
    setLoading(true);
    setError(null);
    try {
      const data = await getPolls();
      setPolls(data);
    } catch (err) {
      setError('Не удалось загрузить опросы.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setError(null);
    try {
      await deletePoll(id);
      setPolls(prevPolls => prevPolls.filter(poll => poll.id !== id));
    } catch (err) {
      setError('Не удалось удалить опрос.');
    }
  }

  if (loading) {
    return <div className="text-center">Загрузка опросов...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="d-flex flex-column">
      <h2>Опросы</h2>
      <div className="row">
        {polls.length > 0 ? (
          polls.map((poll) => (
            <div key={poll.id}>
              <Poll poll={polls} onDelete={() => handleDelete(poll.id)} />
            </div>
          ))
        ) : (
          <div className="text-center">Нет доступных опросов.</div>
        )}
      </div>
    </div>
  );
}

export default PollList;
