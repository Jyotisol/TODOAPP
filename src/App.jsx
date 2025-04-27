// App.jsx
import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() === '') return;

    axios.post('http://localhost:3000/tasks', { task: newTask })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask('');
      })
      .catch(error => console.log(error));
  };

  const handleDeleteTask = (id) => {
    axios.delete(`http://localhost:3000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch(error => console.log(error));
  };

  const handleEditTask = (task) => {
    setEditTask(task);
  };

  const handleUpdateTask = () => {
    if (!editTask || editTask.task.trim() === '') return;

    axios.put(`http://localhost:3000/tasks/${editTask._id}`, { task: editTask.task })
      .then(response => {
        setTasks(tasks.map(task => task._id === editTask._id ? response.data : task));
        setEditTask(null);
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <input
        type="text"
        placeholder="Add a new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleAddTask}>Add</button>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.task}
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            <button onClick={() => handleEditTask(task)}>Edit</button>
          </li>
        ))}
      </ul>

      {editTask && (
        <div>
          <input
            type="text"
            value={editTask.task}
            onChange={(e) => setEditTask({ ...editTask, task: e.target.value })}
          />
          <button onClick={handleUpdateTask}>Update</button>
        </div>
      )}
    </div>
  );
}

export default App;
