import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import '../../styles/WLTPage.css';
import CertificateConnect from './CertificateConnect';
import AddResource from './AddResource';
import { Checkbox, List, ListItem, Button } from '@mui/material';
import API from '../../api';

const ConnectionBlockTask = () => {
  const { webtype, webcode } = useSelector((state) => state.webData);
  const usercode = useSelector((state) => state.code.usercode);
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchTasks();
    setTimeout(() => {
      setIsVisible(true);
    }, 500);
    fetchAccessibleUsers();
  }, [usercode]);

  const fetchTasks = async () => {
    const token = Cookies.get('jwt');
    try {
      const tasksData = await API.GetTasksByOwner(usercode, token);
      setTasks(tasksData.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTasks((prevSelectedTasks) => {
      const newSelectedTasks = prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId];
      return newSelectedTasks;
    });
  };

  const fetchAccessibleUsers = async () => {
    const token = Cookies.get('jwt');
    try {
      let response = null;
  
      if (webtype === 'webinar') {
        response = await API.GetWebinarById(webcode, token);
      } else if (webtype === 'lecture') {
        response = await API.GetLectureById(webcode, token);
      } else if (webtype === 'training') {
        response = await API.GetTrainingById(webcode, token);
      }
  
      setData(response.data);
  
    } catch (error) {
      console.error('Error fetching accessible users:', error);
    }
  };
  

  const addUsersToTests = async () => {
    const token = Cookies.get('jwt');
    try {
      for (const taskId of selectedTasks) {
        for (const userId of data.accessibleTo) {
          await API.AddUserToTask(taskId, userId, token);
        }
      }
    } catch (error) {
      console.error('Error adding users to tests:', error);
    }
  };

  return (
    <div className='TaskBlock'>
      <h3>Ваши задачи:</h3>
      <List>
        {tasks.map((task) => (
          <ListItem key={task._id}>
            <label>
              <Checkbox
                value={task._id}
                checked={selectedTasks.includes(task._id)}
                onChange={() => handleTaskSelect(task._id)}
              />
              {task.name}
            </label>
          </ListItem>
        ))}
      </List>

      <Button variant="contained" onClick={addUsersToTests}>
        Добавить всех пользователей к выбранным заданиям
      </Button>
      <h3>Выдать пользователям сертификат:</h3>
      <List>
        {isVisible && (
          <>
            {data.accessibleTo
              .map((user) => (
                <ListItem key={user._id}>
                 <CertificateConnect userid={user} isGived={data.certificates.includes(user)} />
                </ListItem>
              ))}
          </>
        )}
      </List>
      {webtype === 'training' && (
        <>
          <h3>Ресурсы</h3>
          <AddResource />
        </>
      )}

    </div>
  );
};

export default ConnectionBlockTask;
