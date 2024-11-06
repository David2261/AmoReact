import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';

function App() {
  return (
    <div className='container-fluid'>
      <header className="bg-primary text-white text-center py-4">
        <h1 id="title">Опросы</h1>
        <p id="description">Создайте опрос и голосуйте!</p>
      </header>
      <div className="row">
        <div className="col-md-6">
          <CreatePoll />
        </div>
        <div className="col-md-6">
          <PollList />
        </div>
      </div>
    </div>
  );
}

export default App;
