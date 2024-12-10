const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required:true} , 

});

// Export the model
module.exports = mongoose.model('user', userSchema);





