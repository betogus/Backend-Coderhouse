import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv'

dotenv.config()

const strategy = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, cb) {
        console.log('hemos recibido datos de Google')
        console.log(profile)
        return cb(null, profile);
    });

export default strategy