import React, { useState } from 'react';
import { voteOnPoll } from '../api';

function Poll({ poll, onDelete }) {
  const [voted, setVoted] = useState(false);

  async function handleVote(option) {
    await voteOnPoll(poll.id, option);
    setVoted(true);
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">{poll.title}</h5>
        <p className="card-text">{poll.description}</p>
        {voted ? (
          <div>
            <h6>Результаты голосования:</h6>
            <ul className="list-group">
              {poll.map((option) => (
                <li key={option.key} className="list-group-item">
                  {option.option}: {option.votes} голосов
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul className="list-group">
            {poll.map((option) => (
              <li key={option.key} className="list-group-item">
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleVote(option.option)}
                >
                  {option.option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="card-footer text-muted">
        <button className="btn btn-danger" onClick={onDelete}>Удалить</button>
      </div>
    </div>
  );
}

export default Poll;
