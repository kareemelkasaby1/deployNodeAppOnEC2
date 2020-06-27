const mongoose = require('mongoose')

const reviewBookSchema = new mongoose.Schema({
  book: {type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  review: {type: String, required: true}
})  

const reviewBookModel = mongoose.model('reviewBook',reviewBookSchema)

module.exports = reviewBookModel

