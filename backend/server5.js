const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const Question =require('./models/questioModel');
const UserResult =require('./models/UserResultModel');

const app = express();
const PORT = process.env.PORT || 5005;

mongoose.connect('mongodb://localhost:27017/WLT', {});

app.use(cors());
app.use(express.json());
app.use('/tasks', taskRoutes);

app.get('/questions/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const questions = await Question.find({ taskId });
    res.json(questions);
  } catch (error) {
    console.error('Error getting questions by taskId:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/questions', async (req, res) => {
  try {
    const questionData = req.body;
    const newQuestion = await Question.create(questionData);

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/userResults', async (req, res) => {
  try {
    const userResultData = req.body;
    const newUserResult = await UserResult.create(userResultData);

    res.status(201).json(newUserResult);
  } catch (error) {
    console.error('Error adding user result:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/userResultsByCode/:userCode', async (req, res) => {
  const userCode = req.params.userCode;

  try {
    const userResults = await UserResult.find({ userId: userCode });
    res.json(userResults);
  } catch (error) {
    console.error('Error getting user results by user code:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/userResults/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const userResults = await UserResult.find({ taskId });
    res.json(userResults);
  } catch (error) {
    console.error('Error getting user results by taskId:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
