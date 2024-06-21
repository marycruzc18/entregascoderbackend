import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import UserDao from '../dao/mongodb/users.dao.js';
import 'dotenv/config';

const userDao = new UserDao();


const strategyConfig = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
};

const registerOrLogin = async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
    try {
        const email = profile._json.email ?? '';
        const name = profile._json.name;
        let first_name = '';
        let last_name = '';

        if (name) {
            const nameParts = name.split(' ');
            first_name = nameParts[0] || '';
            if (nameParts.length > 1) {
                last_name = nameParts.slice(1).join(' ');
            }
        }

        const user = await userDao.getByEmail(email);
        if (user) {
            return done(null, user);
        }

        const newUser = await userDao.register({
            first_name,
            last_name,
            email,
            password: ' ',
            isGithub: true
        });

        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
};
passport.use('github', new GithubStrategy(strategyConfig, registerOrLogin));

passport.serializeUser((user, done)=>{
    done(null, user._id)
});

passport.deserializeUser(async(id, done)=>{
    try {
        const user = await userDao.getById(id);
        return done(null, user);
    } catch (error) {
        done(error)
    }
});