const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique : true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role:{
        type: String,
        default: "Basic",
        required: true,
    },
    CNIC:{
      type: String,
      required: true,
      unique:true,
  },
  email:{
    type: String,
    unique:true,
  },
  age:{
    type: Number,
    // required: true,
  },
  address:{
    type: String,
    // required: true,
    },
    mobile: {
      type: String
  },
  role:{
    type: String,
    enum: ['voter','admin'],
    default:'voter'
  },
  isVoted:{
    type: Boolean,
    default: false
  }
  
  },
  { timestamps: true }
);

// userSchema.methods.comparePassword = async function(candidatePassword){
//   try{
//       // Use bcrypt to compare the provided password with the hashed password
//       const isMatch = await bcrypt.compare(candidatePassword, this.password);
//       return isMatch;
//   }catch(err){
//       throw err;
//   }
// }

const USER = mongoose.model("user", userSchema);

module.exports = USER;
