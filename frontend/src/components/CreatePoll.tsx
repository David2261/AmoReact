import React, { useState } from 'react';
import { createPoll } from '../api';

function CreatePoll() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['']);

  const handleAddOption = () => {
	setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
	const newOptions = [...options];
	newOptions[index] = value;
	setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
	await createPoll({ title, description, options });
	setTitle('');
	setDescription('');
	setOptions(['']);
  };

  return (
	<div className="d-flex flex-column">
      <h2>Создать новый опрос</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Заголовок</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Описание</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Варианты ответов</label>
          {options.map((option, index) => (
            <div className="input-group mb-2" key={index}>
              <input
                type="text"
                className="form-control"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  setOptions(options.filter((_, i) => i !== index));
                }}
              >
                Удалить
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={handleAddOption}>
            Добавить вариант
          </button>
        </div>
        <button type="submit" className="btn btn-primary">
          Создать опрос
        </button>
      </form>
    </div>

  );
}

export default CreatePoll;
