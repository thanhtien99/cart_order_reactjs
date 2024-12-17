const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("../models/users");

//authentication with email, password
passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
          }
  
          user.comparePassword(password, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (!isMatch) {
              return done(null, false, { message: 'Incorrect email or password.' });
            }
            return done(null, user);
          });
  
        } catch (err) {
          return done(err);
        }
      }
    )
);
  
const cookiesExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["access_token"];
    }
    return token;
};

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: cookiesExtractor,
            secretOrKey: process.env.JWT_SECRET || "ThanhTien",
        },
        async (payload, done) => {
            try {
                if (!payload.sub) {
                    return done(null, false, { message: 'Invalid token' });
                }
                const user = await User.findById(payload.sub);
                if (user) {
                    return done(null, user); 
                } else {
                    return done(null, false, { message: 'User not found' });
                }
            } catch (err) {
                return done(err, false);
            }
        }
    )
);


