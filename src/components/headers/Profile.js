import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveCode, clearCode } from '../../store/actions/action1';
import { saveRole, clearRole } from '../../store/actions/action2';
import Modal from '../mains/ModalChangPassword';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Cookies from 'js-cookie';
import '../../styles/Profile.css';
import API from '../../api';

const Profile = ({ closeProfile }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [errorr, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const dispatch = useDispatch();
  const usercode = useSelector((state) => state.code.usercode);

  const handleAuthorize = async () => {
    try {
      const data = await API.Autorize(login, password);

      if (data.error) {
        setError(data.error);
      } else {
        const { role, code, token } = data;
        Cookies.set('jwt', token);
        dispatch(saveCode(code));
        dispatch(saveRole(role));
        setIsLoggedIn(true); 
        console.log('Role:', role);
        console.log('Code:', code);
        console.log('Token:', token);
      }
    } catch (error) {
      console.error('Error during authorization:', error);
    }
  };

  const fetchData = async () => {
    const token = Cookies.get('jwt');
    try {
      const response = await API.GetUserByCode(usercode, token);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('jwt');
    dispatch(clearCode());
    dispatch(clearRole());
    setUserData(null);
    setIsLoggedIn(false);
    window.location.reload();
  };

  useEffect(() => {
    if (isLoggedIn || Cookies.get('jwt') || usercode) {
      fetchData();
    }
  }, [isLoggedIn]);

  return (
    <div className="profile-dropdown">
      {userData ? (
        <div className="user-info">
          <p>Добро пожаловать</p>
          <p>{userData.firstName} {userData.lastName}</p>
          <Button variant="contained" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      ) : (
        <div className="login-form">
          <FormControl variant="outlined" style={{ marginBottom: 8 }}>
            <InputLabel htmlFor="outlined-login">Login</InputLabel>
            <OutlinedInput
              id="outlined-login"
              type="text"
              value={login}
              style={{ height: 50 }}
              onChange={(e) => {setLogin(e.target.value); setError(null); }}
              label="Login"
            />
          </FormControl>
          <FormControl variant="outlined" style={{ marginBottom: 8 }}>
            <InputLabel htmlFor="outlined-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-password"
              type="password"
              value={password}
              style={{ height: 50 }}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              label="Password"
            />
          </FormControl>
          {errorr && (
            <p style={{ color: "red", marginLeft: "auto", marginRight: "auto" }}>{errorr}</p>
          )}
          <Button variant="contained" onClick={handleAuthorize}>
            Войти
          </Button>
          <Modal />
        </div>
      )}
      <Button variant="contained" onClick={closeProfile}>
        Close
      </Button>
    </div>
  );
};

export default Profile;
