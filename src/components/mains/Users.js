import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import API from '../../api';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = Cookies.get('jwt');
    try {  
      const usersWithVerifications = await API.GetAllUsers(token);  
      setUsers(usersWithVerifications);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };  

  const deleteUser = async (id) => {
    const token = Cookies.get('jwt');
    try {
      await API.DeleteUser(id);
      await API.DeleteVerification(id, token);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  

  return (
    <div style={{margin:"20px"}}>
      <Typography style={{margin:"20px", textAlign: "center", color: "purple"}} variant="h4">Пользователи</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Photo</TableCell>
              <TableCell>Login</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>{user.logo}</TableCell>
                <TableCell>{user.login}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.phonenumber}</TableCell>
                <TableCell>{user.dCapacity}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<PersonRemoveIcon />}
                    onClick={() => deleteUser(user._id.toString())}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
