const Comment = require('../models/commentModel');
const secretKey = 'TigerEyes39!';
const jwt = require('jsonwebtoken');

const verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token.slice(7), secretKey);
    console.log('Декодированный токен:', decoded);
    return decoded;
  } catch (error) {
    console.error('Ошибка при верификации токена:', error);
    return null;
  }
};

exports.createComment = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = await verifyToken(token);
  if (!tokenData) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  try {
    const { owner, content, objectReference } = req.body;
    const newComment = await Comment.create({
      owner,
      content,
      objectReference,
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteComment = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = await verifyToken(token);
  if ( String(tokenData.role) !== 'admin') {
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  try {
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCommentsForObject = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = await verifyToken(token);
  if (!tokenData) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  try {
    const { objectReference } = req.params;
    const comments = await Comment.find({ objectReference }).populate('owner');
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error getting comments for object:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
