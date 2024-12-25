const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const Users = new Schema({
  username: { type: String, require: true },
  email: { type: String, unique: true ,require: true },
  dateofbirth: { type: String },
  address: { type: String },
  phone: { type: Number},
  password: { type: String, require: true },
  role: { type: Number},
}, {
  timestamps: true,
});

// Hash the password
Users.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

Users.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) return done(err); 
      if (!isMatch) return done(null, false);
      return done(null, this);
  });
};

module.exports = mongoose.model('User', Users);