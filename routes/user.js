'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');

// --- SUBMIT KATA ------
router.post('/me/katas', (req, res, next) => { // check kataId?
  const currentUserId = req.session.currentUser._id;
  const inputCode = req.body.inputCode;
  const kataId = req.body.kataId;

  if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  if (!inputCode || !kataId) {
    return res.status(422).json({ code: 'validation' });
  }

  User.findByIdAndUpdate(currentUserId, {
    $push: {
      katas: {
        kata: kataId,
        solution: inputCode
      }
    }
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ code: 'not-found' });
      }
      return res.status(204).send();
    })
    .catch(next);
});

// --- GET USER KATAS ------
router.get('/me/katas', (req, res, next) => { // check kataId?
  const currentUserId = req.session.currentUser._id;

  if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  User.findById(currentUserId).populate('katas.kata')
    .then((user) => {
      if (!user) {
        return res.status(404).json({ code: 'not-found' });
      }
      const katas = {
        katas: user.katas
      };
      return res.json(katas);
    })
    .catch(next);
});

// --- SEARCH FOR A USER ------
router.get('/search/:name', (req, res, next) => {
  const userName = req.params.name;

  if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  User.findOne({ 'username': userName }).populate('katas.kata')
    .then((user) => {
      if (!user) {
        return res.status(404).json({ code: 'not-found' });
      }
      return res.json(user);
    })
    .catch(next);
});

// --- ADD A FRIEND ------
router.post('/add/:userId', (req, res, next) => {
  const currentUserId = req.session.currentUser._id;
  const userId = req.params.userId;

  if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  User.find({ $and: [{ _id: currentUserId }, { friends: { $nin: [userId] } }] }) // makes sure friend does not exist
    .then((users) => {
      if (users.length === 0) {
        return res.status(404).json({ code: 'friend-already-exists' });
      }
      return User.findByIdAndUpdate(currentUserId, { $push: { friends: userId } })
        .then((user) => {
          if (!user) {
            return res.status(404).json({ code: 'not-found' });
          }
          return res.json(user);
        });
    })
    .catch(next);
});

// --- GET USER FRIENDS ------
router.get('/me/friends', (req, res, next) => {
  const currentUserId = req.session.currentUser._id;

  if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  User.findById(currentUserId).populate('friends')
    .then((user) => {
      if (!user) {
        return res.status(404).json({ code: 'not-found' });
      }
      const friends = {
        friends: user.friends
      };
      return res.json(friends);
    })
    .catch(next);
});

// // --- GET KATA SOLUTION ------
// router.get('/me/katas/:id/edit', (req, res, next) => {
//   const currentUserId = req.session.currentUser._id;
//   const kataId = req.params.id;

//   if (!req.session.currentUser) {
//     return res.status(401).json({ code: 'unauthorized' });
//   }

//   User.findById(currentUserId).populate('katas.kata')
//     .then((user) => {
//       if (!user) {
//         return res.status(404).json({ code: 'not-found' });
//       }
//       const katas = {
//         katas: user.katas
//       };
//       return res.json(katas);
//     })
//     .catch(next);
// });

// --- ADD A COMMENT TO A KATA ------
router.post('/add/:userId/comment', (req, res, next) => {
  const currentUserId = req.session.currentUser._id;
  const userId = req.params.userId;
  const comment = req.body.comment;
  const kataId = req.body.kataId;

  if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  User.findOneAndUpdate({ _id: userId, 'katas.kata': kataId }, { $push: { 'katas.$.comments': { text: comment, provider: currentUserId } } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ code: 'not-found' });
      }
      return res.json(user);
    })
    .catch(next);
});

module.exports = router;
