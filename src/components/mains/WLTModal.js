import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import '../../styles/WLTModal.css';
import API from '../../api';

const WLTModal = ({ id, updateFunc }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const usercode = useSelector((state) => state.code.usercode);
  const { webtype, webcode } = useSelector((state) => state.webData);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('jwt');
      try {
        let WLT = null;
    
        if (webtype === 'lecture') {
          WLT = await API.GetLectureById(id, token);
        } else if (webtype === 'webinar') {
          WLT = await API.GetWebinarById(id, token);
        } else if (webtype === 'training') {
          WLT = await API.GetTrainingById(id, token);
        }
    
        setData(WLT.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    fetchData();
  }, [id, webtype]);

  const handleAddAccessibleTo = async () => {
    const token = Cookies.get('jwt');
    try {
      if (webtype === 'lecture') {
        const lecture = await API.AddUserToLecture(id, usercode, token);
        setData(lecture.data);
      } else if (webtype === 'webinar') {
        const webinar = await API.AddUserToWebinar(id, usercode, token);
        setData(webinar.data);
      } else if (webtype === 'training') {
        const training = await API.AddUserToTraining(id, usercode, token);
        setData(training.data);
      }
      updateFunc();
      handleClose();
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };
  

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Записаться
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <div className='Dialog'>
          {data && (
            <>
              <h1>{data.title}</h1>
              <img src={`./image/${data.logo}`} alt="Logo" />
              <p>{data.description}</p>
              <Button variant="contained" onClick={handleAddAccessibleTo}>
                {data.cost === 0 ? 'Записаться' : `Оплатить ${data.cost} рублей`}
              </Button>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default WLTModal;