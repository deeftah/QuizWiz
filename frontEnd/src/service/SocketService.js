import io from 'socket.io-client';
import socketStore from '../stores/socketStore.js';
import store from '../stores/store.js';

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/' : '//localhost:3000';
const socket = io(BASE_URL);

export default {
  on,
  emit,
  socket
};

function on(trigger, cb) {
  socket.on(trigger, cb);
}

function emit(trigger, data) {
  socket.emit(trigger, data);
}

on('serverTime', clock => {
  store.dispatch({ type: 'serverClock', clock });
});

on('startGameTimer', () => {
  store.dispatch({ type: 'gameStartListener' });
});

on('startTheGame', quiz => {
  store.dispatch({ type: 'changeGameStage', stage: 'quizQuest' });
  store.dispatch({ type: 'loadGameQuiz', quiz });
});

on('questionChange', currentQuestion => {
  console.log(currentQuestion);
  store.dispatch({ type: 'changeGameQuestion', currentQuestion });
});
on('endGame', () => {
  store.dispatch({ type: 'changeGameStage', stage: 'quizEnd' });
});
on('middleQuiz', () => {
  store.dispatch({ type: 'changeGameStage', stage: 'quizLobby' });
});
on('quizQuest', () => {
  store.dispatch({ type: 'changeGameStage', stage: 'quizQuest' });
});
