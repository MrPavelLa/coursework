import axios from 'axios';

const API = {
  Autorize: async (login, password) => {    
    try {
      const response = await axios.post('http://localhost:5000/login', { login, password });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  GetUserByCode: async (usercode, token) => {
    try {
      if(usercode){
      const response = await axios.get(`http://localhost:5001/users/${usercode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      return response;}
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  GetAllUsers: async (token) => {
    try {
      const [usersResponse, verificationsResponse] = await Promise.all([
        axios.get('http://localhost:5001/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get('http://localhost:5000/verification', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);      
  
      const usersData = usersResponse.data; 
      const verificationsData = verificationsResponse.data;
  

      const mergedData = verificationsData.map((verification) => {
        const user = usersData.find((u) => u._id === verification.itemId);
        return { ...verification, ...user };

      });
  
      return mergedData;
    } catch (error) {
      console.error('Error fetching users with verifications:', error);
      throw error;
    }
  },
  
  CreateUser: async (userData) => {
    try {
      const response = await axios.post('http://localhost:5001/users', userData);
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  DeleteUser: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5001/users/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  UpdateUserCapacity: async (usercode, newDCapacity, token) => {
    try {
      const response = await axios.put(`http://localhost:5001/users/${usercode}/updateCapacity`, { dCapacity: newDCapacity }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error updating user capacity:', error);
      throw error;
    }
  },
  // Верификации
  CreateVerification: async (verificationData) => {
    try {
      const response = await axios.post('http://localhost:5000/verification', verificationData);
      return response;
    } catch (error) {
      console.error('Error creating verification:', error);
      throw error;
    }
  },
  CheckLoginVerification: async (login, phoneNumber) => {
    try {
      const response = await axios.post('http://localhost:5000/verification/check-login', {
        login,
        phonenumber: phoneNumber,
      });
      return response;
    } catch (error) {
      console.error('Error checking login:', error);
      throw error;
    }
  },
  UpdateVerificationPassword: async (login, newPas) => {
    try {
      const response = await axios.put(`http://localhost:5000/verification/${login}`, {
        login,
        password: newPas,
      });
      return response;
    } catch (error) {
      console.error('Error updating verification password:', error);
      throw error;
    }
  },
  DeleteVerification: async (id, token) => {
    try {
      const response = await axios.delete(`http://localhost:5000/verification/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting verification:', error);
      throw error;
    }
  },
  // Вебинары
  DeleteWebinar: async (id, token) => {
    try {
      const response = await axios.delete(`http://localhost:5002/webinars/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting webinar:', error);
      throw error;
    }
  },
  GetAllWebinars: async () => {
    try {
      const response = await axios.get('http://localhost:5002/webinars');
      return response;
    } catch (error) {
      console.error('Error fetching webinars:', error);
      throw error;
    }
  },
  GetWebinarById: async (id, token) => {
    try {
      const response = await axios.get(`http://localhost:5002/webinars/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching webinar by ID:', error);
      throw error;
    }
  },
  AddUserToWebinar: async (webinarId, usercode, token) => {
    try {
      const response = await axios.post(
        `http://localhost:5002/webinars/${webinarId}/addUser/${usercode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );      
      return response;
    } catch (error) {
      console.error('Error adding user to webinar:', error);
      throw error;
    }
  },
  CreateWebinar: async (webinarData, token) => {
    try {
      const response = await axios.post('http://localhost:5002/webinars', webinarData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error creating webinar:', error);
      throw error;
    }
  },   
  AddUserToCertificateWebinar: async (webcode, userid, token) => {
    try {
      const response = await axios.post(
        `http://localhost:5002/webinars/${webcode}/addUserToCertificate/${userid}`,
        null, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error adding user to certificate for webinar:', error);
      throw error;
    }
  },
  // Лекции
  CreateLecture: async (lectureData, token) => {
    try {
      const response = await axios.post('http://localhost:5003/lectures', lectureData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error creating lecture:', error);
      throw error;
    }
  },

  DeleteLecture: async (id, token) => {
    try {
      const response = await axios.delete(`http://localhost:5003/lectures/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting lecture:', error);
      throw error;
    }
  },

  GetAllLectures: async () => {
    try {
      const response = await axios.get('http://localhost:5003/lectures');
      return response;
    } catch (error) {
      console.error('Error fetching lectures:', error);
      throw error;
    }
  },

  GetLectureById: async (id, token) => {
    try {
      const response = await axios.get(`http://localhost:5003/lectures/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching lecture by ID:', error);
      throw error;
    }
  },

  AddUserToLecture: async (lectureId, usercode, token) => {
    try {
      const response = await axios.post(`http://localhost:5003/lectures/${lectureId}/addUser/${usercode}`,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error adding user to lecture:', error);
      throw error;
    }
  },
  AddUserToCertificateLecture: async (webcode, userid, token) => {
    try {
      const response = await axios.post(
        `http://localhost:5003/lectures/${webcode}/addUserToCertificate/${userid}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error adding user to certificate for lecture:', error);
      throw error;
    }
  },
  // Тренинги
CreateTraining: async (trainingData, token) => {
  try {
    const response = await axios.post('http://localhost:5004/trainings', trainingData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating training:', error);
    throw error;
  }
},


  DeleteTraining: async (id, token) => {
    try {
      const response = await axios.delete(`http://localhost:5004/trainings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting training:', error);
      throw error;
    }
  },

  GetAllTrainings: async () => {
    try {
      const response = await axios.get('http://localhost:5004/trainings');
      return response;
    } catch (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }
  },

  GetTrainingById: async (id, token) => {
    try {
      const response = await axios.get(`http://localhost:5004/trainings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching training by ID:', error);
      throw error;
    }
  },

  AddUserToTraining: async (trainingId, usercode, token) => {
    try {
      const response = await axios.post(`http://localhost:5004/trainings/${trainingId}/addUser/${usercode}`,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error adding user to training:', error);
      throw error;
    }
  },
  AddUserToCertificateTraining: async (webcode, userid, token) => {
    try {
      const response = await axios.post(
        `http://localhost:5004/trainings/${webcode}/addUserToCertificate/${userid}`,
        null, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error adding user to certificate for training:', error);
      throw error;
    }
  },
  AddMaterialToTraining: async (webcode, resName, link, token) => {
    try {
      const response = await axios.post(`http://localhost:5004/trainings/${webcode}/addMaterial`, {
        title: resName,
        link: link,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error adding material to training:', error);
      throw error;
    }
  },

   AddResourceToTraining: async (webcode, resName, fileName, token) => {
    try {
      const response = await axios.post(`http://localhost:5004/trainings/${webcode}/addResource`, {
  title: resName,
  link: fileName,
}, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      return response;
    } catch (error) {
      console.error('Error adding resource to training:', error);
      throw error;
    }
  },
  // Задания
  GetTasksByOwner: async (usercode, token) => {
    try {
      const response = await axios.get(`http://localhost:5005/tasks/owner/${usercode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching tasks by owner:', error);
      throw error;
    }
  },

  AddUserToTask: async (taskId, userId, token) => {
    try {
      const response = await axios.post(`http://localhost:5005/tasks/${taskId}/addUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error adding user to task:', error);
      throw error;
    }
  },

  CreateTask: async (taskData, token) => {
    try {
      const response = await axios.post('http://localhost:5005/tasks', taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  CreateQuestion: async (questionData, token) => {
    try {
      const response = await axios.post('http://localhost:5005/questions', questionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  GetQuestionsByTaskCode: async (taskcode, token) => {
    try {
      const response = await axios.get(`http://localhost:5005/questions/${taskcode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching questions by task code:', error);
      throw error;
    }
  },

  GetAccessibleTasksWithInfo: async (usercode, token) => {
    try {
      const responseTask = await axios.get(`http://localhost:5005/tasks/accessibleToWithInfo/${usercode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return responseTask.data;
    } catch (error) {
      console.error('Error fetching accessible tasks with info:', error);
      throw error;
    }
  },

  SaveUserResult: async (usercode, Mark, taskcode, token) => {
    try {
      const response = await axios.post('http://localhost:5005/userResults', {
        userId: usercode,
        result: Mark,
        taskId: taskcode,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error saving user result:', error);
      throw error;
    }
  },
  GetTasksWithResultsByCode: async (usercode, token) => {
    try {
      const [taskResponse, resultResponse] = await Promise.all([
        axios.get(`http://localhost:5005/tasks/accessibleToWithInfo/${usercode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`http://localhost:5005/userResultsByCode/${usercode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const taskData = taskResponse;
      const resultData = resultResponse;

      const mergedData = taskData.map(task => {
        const result = resultData.find(r => r.taskId === task._id);
        return { ...(result || {}), ...task };
      });

      return mergedData;
    } catch (error) {
      console.error('Error fetching tasks with results by code:', error);
      throw error;
    }
  },
  GetTasksWithUsersAndResultsByOwnerCode: async (usercode, token) => {
    try {
      const response = await axios.get(`http://localhost:5005/tasks/owner/${usercode}`);
      const tasksData = response;

      const tasksWithUsersAndResults = await Promise.all(tasksData.map(async (task) => {
        const connectedUsersResponse = await axios.get(`http://localhost:5005/tasks/connectedUsers/${task._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const connectedUsers = connectedUsersResponse;

        const userResultsResponse = await axios.get(`http://localhost:5005/userResults/${task._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userResults = userResultsResponse;

        return { ...task, connectedUsers, userResults };
      }));

      return tasksWithUsersAndResults;
    } catch (error) {
      console.error('Error fetching tasks with users and results by owner code:', error);
      throw error;
    }
  },
  // комментарии
  GetCommentsByObjectReference: async (objectReference, token) => {
    try {
      const response = await axios.get(`http://localhost:5007/comments/${objectReference}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  CreateComment: async (usercode, commentInput, objectReference, token) => {
    try {
      await axios.post('http://localhost:5007/comments', {
        owner: usercode,
        content: commentInput,
        objectReference: objectReference,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },
};

export default API;
