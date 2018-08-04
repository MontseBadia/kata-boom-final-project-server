const ObjectId = require('mongoose').Types.ObjectId;

function isKataIdValid (req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(422).json({ code: 'unprocessable-entity' });
  }
  next();
}

module.exports = isKataIdValid;
