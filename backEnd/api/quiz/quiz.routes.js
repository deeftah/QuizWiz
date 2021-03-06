const quizService = require('./quizService');
const express = require('express');

const router = express.Router();
module.exports = router;

//quiz list
router.get('/', async (req, res) => {
  try {
    const quizes = await quizService.query();
    return res.json(quizes);
  } catch (err) {
    console.log('err in list - backend quiz routes', err);
  }
});

// quiz Single
router.get('/:id', async (req, res) => {
  const quizId = req.params.id;
  try {
    const foundQuiz = await quizService.getById(quizId);
    return res.json(foundQuiz);
  } catch (err) {
    console.log('err in single - backend quiz routes', err);
  }
});

// quiz Delete
router.delete('/:id', async (req, res) => {
  const quizId = req.params.id;
  try {
    await quizService.remove(quizId);
    return res.json({});
  } catch (err) {
    console.log('err in delete - backend quiz routes', err);
  }
});

// quiz Add
router.post('/', async (req, res) => {
  const quiz = req.body;
  try {
    const quizWithId = await quizService.add(quiz);
    return res.json(quizWithId);
  } catch (err) {
    console.log('err in add - backend quiz routes', err);
  }
});

// quiz Edit
router.put('/:id', async (req, res) => {
  try {
    const quiz = req.body;
    const updatedQuiz = await quizService.update(quiz);
    return res.json(updatedQuiz);
  } catch (err) {
    console.log('err in update - backend quiz routes', err);
  }
});
