'use strict';
const socketIO = require('socket.io');
const gameService = require('./game-service');
const TIME_PER_GAME_PART = 10000;
const TIMEOUT_FOR_GAME_START = 51000;

var io;
function setup(http) {
  io = socketIO(http);

  io.on('connection', function(socket) {
    let currGame;
    socket.emit('returnAllLiveGames', gameService.getAllonlineGames());

    socket.on('loggingToGame', infoToLog => {
      socket.join(infoToLog.gameId);
      currGame = gameService.getGameById(infoToLog.gameId);

      gameService.joinGame(infoToLog.gameId, infoToLog.user);
      sendLoggedUsersToClient('preGame', io, infoToLog.gameId, currGame);

      socket.on('disconnect', function(socket) {
        // logic for DC of joined USER
      });
    });
    socket.on('updateAns', answer => {
      gameService.setAnswer(currGame._id, answer.userId, answer.answerInfo);
    });

    socket.on('onCreateGame', quiz => {
      currGame = createAndJoinGame(quiz, socket);
      sendLoggedUsersToClient('preGame', io, currGame._id, currGame);
      startLobbyTimer(currGame._id);

      let gameInterval;
      setTimeout(() => {
        gameInterval = setInterval(
          gameSequence,
          TIME_PER_GAME_PART,
          currGame,
          io
        );
      }, TIMEOUT_FOR_GAME_START);

      socket.on('disconnect', function(socket) {
        // logic for DC of game Creator
      });

      function gameSequence(currGame, io) {
        console.log(gameInterval);
        if (currGame.currQuest === currGame.quiz.quests.length) {
          console.log('Game Stage - ENDGAME', 'GAME ID', currGame._id);
          handleEndGame(currGame, io, gameInterval);
          return;
        } else if (
          currGame.status === 'lobby' ||
          currGame.status === 'middle'
        ) {
          console.log(
            'Game Stage - after middle/lobby',
            'GAME ID',
            currGame._id
          );
          afterMiddleOrLobby(currGame, io);
        } else if (currGame.status === 'quest') {
          console.log('Game Stage - after quiz', 'GAME ID', currGame._id);

          afterQuest(currGame, io);
        }
      }
    });
  });
}

module.exports = {
  setup
};

//Socket Service functions

function startLobbyTimer(gameId) {
  let lobbyTimer = 60;
  let lobbyTimerInterval = setInterval(() => {
    io.to(gameId).emit('sendLobbyTimer', lobbyTimer); //need to send server time insted
    lobbyTimer--;
    if (lobbyTimer === 0) clearInterval(lobbyTimerInterval);
  }, 1000);
}

function createAndJoinGame(quiz, socket) {
  let createdGame = gameService.createGame(quiz);
  socket.join(createdGame._id);
  io.emit('returnAllLiveGames', gameService.getAllonlineGames());
  gameService.joinGame(createdGame._id, quiz.creator);
  return createdGame;
}

function handleEndGame(currGame, io, gameInterval) {
  currGame.currQuest--;
  currGame.status = 'endGame';
  io.to(currGame._id).emit('endGame', currGame);
  clearInterval(gameInterval);
  //SHOULD SEND TO DATABASE

  gameService.removeGame(currGame._id);
  sendLoggedUsersToClient('endGame', io, currGame._id);
  io.emit('returnAllLiveGames', gameService.getAllonlineGames());
}

function afterQuest(newGame, io) {
  newGame.status = 'middle';
  io.to(newGame._id).emit('middleQuiz', newGame);
  newGame.currQuest++;
  io.to(newGame._id).emit('questionChange', newGame.currQuest);
}

function afterMiddleOrLobby(newGame, io) {
  newGame.isGameOn = true;
  io.emit('returnAllLiveGames', gameService.getAllonlineGames());
  newGame.status = 'quest';
  io.to(newGame._id).emit('quizQuest');
}

function sendLoggedUsersToClient(state, io, gameId, game) {
  if (state === 'preGame') {
    io.to(gameId).emit('loggedUsers', game.gamePlayers);
  } else if (state === 'endGame') {
    io.to(gameId).emit('loggedUsers', []);
  }
}
