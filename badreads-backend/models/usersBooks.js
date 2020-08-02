const mongoose = require('mongoose')

// many to many realation between users and books
const usesrsBooksSchema = new mongoose.Schema({

    userId: {type: mongoose.Schema.Types.ObjectId, ref : 'User'},
    bookId: {type: mongoose.Schema.Types.ObjectId, ref : 'Book'},
    //specify the action twards books like if the user want to read the book -> -1 or curently reading -> 0 or read -> 1
    action: {type: String, default:"Want to Read"},
});
usesrsBooksSchema.index({userId: 1, bookId: 1}, { unique: true })
const authModel = mongoose.model('UsesrsBooks', usesrsBooksSchema);
module.exports = authModel
