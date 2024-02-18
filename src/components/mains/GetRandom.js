import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../../styles/GetRandom.css';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import API from '../../api';

const GetRandom = ({ type }) => {
  const [data, setData] = useState([]);
  const usercode = useSelector((state) => state.code.usercode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (type === 'webinar') {
          response = await API.GetAllWebinars();
        } else if (type === 'lecture') {
          response = await API.GetAllLectures();
        } else if (type === 'training') {
          response = await API.GetAllTrainings();
        }

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [type]);

  const getRandomItem = () => {
    if (data && data.length > 0) {
      const accessibleData = data.filter(item => !item.accessibleTo.includes(usercode));
  
      if (accessibleData.length > 0) {
        const randomIndex = Math.floor(Math.random() * accessibleData.length);
        return accessibleData[randomIndex];
      }
    }
    return null;
  };
  

  const randomItem = getRandomItem();



  const handleAdd = async () => {
    const token = Cookies.get('jwt');
    try {
      let response;
  
      if (type === 'lecture') {
        response = await API.AddUserToLecture(randomItem._id, usercode, token);
      } else if (type === 'webinar') {
        response = await API.AddUserToWebinar(randomItem._id, usercode, token);
      } else if (type === 'training') {
        response = await API.AddUserToTraining(randomItem._id, usercode, token);
      }
  
      setData(response.data);
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };
  

  return (
    <div className='getRandomItem'>
      {randomItem && (
        <>
          {(randomItem.cost === 0) && (
            <img src='free.png' alt='freelog' className='freelog' />
          )}
          <img src={`./image/${randomItem.logo}`} alt={`Logo for ${randomItem.title}`} />
          <h3>{randomItem.title}</h3>
          <p>{randomItem.speaker}</p>
          <p>{type !== 'lecture' && new Date(randomItem.datetime).toLocaleString()}</p>
          <div className='WebinarModal'>
            {usercode === null ? (
              <p>войдите или зарегестрируйтесь</p>) : (
              <Button variant="outlined" onClick={handleAdd}>
                Записаться {randomItem.cost}р.
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GetRandom;
