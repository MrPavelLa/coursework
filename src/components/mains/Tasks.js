import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { saveTask, clearTask } from '../../store/actions/action3';
import CreateTest from './CreateTest';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import '../../styles/Tasks.css';

const Tasks = () => {
  const usercode = useSelector((state) => state.code.usercode);
  const userrole = useSelector((state) => state.role.userrole);
  const [tasks, setTasks] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('jwt');
      try {
        if (userrole === 'user') {
          const [taskResponse, resultResponse] = await Promise.all([
            axios.get(`http://localhost:5005/tasks/accessibleToWithInfo/${usercode}`),
            axios.get(`http://localhost:5005/userResultsByCode/${usercode}`),
          ]);

          const taskData = taskResponse.data;
          const resultData = resultResponse.data;

          const mergedData = taskData.map(task => {
            const result = resultData.find(r => r.taskId === task._id);
            return { ...(result || {}), ...task };
          });

          setTasks(mergedData);
        } else if (userrole === 'organizer') {
          const response = await axios.get(`http://localhost:5005/tasks/owner/${usercode}`);
          const tasksData = response.data;

          const tasksWithUsersAndResults = await Promise.all(tasksData.map(async (task) => {
            const connectedUsersResponse = await axios.get(`http://localhost:5005/tasks/connectedUsers/${task._id}`);
            const connectedUsers = connectedUsersResponse.data;

            const userResultsResponse = await axios.get(`http://localhost:5005/userResults/${task._id}`);
            const userResults = userResultsResponse.data;

            return { ...task, connectedUsers, userResults };
          }));

          setTasks(tasksWithUsersAndResults);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userrole, usercode]);

  const startTest = (taskId) => {
    navigate('/Test');
    dispatch(saveTask(taskId));
  };

  return (
    <div className='Tasks'>
      {(userrole === 'user' && tasks && tasks.length > 0) ? (
        <>
          <h2>Ваши задачи:</h2>
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Максимальное время (минуты)</th>
                <th>Результат</th>
                <th style={{borderRight: "1px solid black"}}>Время</th>
                <th style={{border: "none"}}></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.maxTime}</td>
                  <td>{task.result}</td>
                  <td style={{borderRight: "none"}}>{task.dateTime && new Date(task.dateTime).toLocaleString()}</td>
                  <td style={{border: "none"}}>
                    {task.result === undefined && (
                      <Button onClick={() => startTest(task._id)}>Пройти тест</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (userrole === 'user') ? (
        <p><ErrorOutlineIcon /> Вы не подключены ни к одному тесту</p>
      ) : (
        <></>
      )}
      {(userrole === 'organizer' && tasks && tasks.length > 0) ? (
        <>
          <h2>Ваши тесты:</h2>
          <table >
            <thead>
              <tr>
                <th>Название</th>
                <th>Время выполнения</th>
                <th style={{borderRight: "1px solid black"}}>Имя пользователя/ Результат</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td style={{ textAlign: "center"}}>{task.maxTime} минут</td>
                  <td style={{borderRight: "1px solid black"}}>
                    {task.connectedUsers && task.connectedUsers.length > 0 ? (
                      <table>

                        <tbody>
                          {task.connectedUsers.map((user) => (
                            <tr key={user._id}>
                              <td style={{ width: '60%', border: "none",  borderBottom: "1px dashed black"}}>{`${user.firstName} ${user.lastName}`}</td>
                              <td style={{ width: '40%', border: "none", borderLeft: "1px solid black", borderBottom: "1px dashed black"}}>
                                {task.userResults && task.userResults.length > 0 ? (
                                  task.userResults.map((result) => (
                                    result.userId === user._id && (
                                      <span key={result._id}>{`${result.result}`}</span>
                                    )
                                  ))
                                ) : (
                                  'Нет результатов'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      'Нет подключенных пользователей'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (userrole === 'organizer') ? (
        <p><ErrorOutlineIcon /> У вас нет ни одного теста</p>
      ) : (
        <></>
      )}
      {userrole === 'organizer' && (
        <>
          <h2>Создать новый тест: </h2>
          <CreateTest />
        </>
      )}
    </div>
  );
};

export default Tasks;

