import passport from 'passport';
import local from 'passport-local'
import { users } from '../../models/User.js';
import { createHash, isValid } from '../../../utils.js';

const LocalStrategy = local.Strategy

export const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            {passReqToCallback: true},
            async (req, username, password, done) => {
                try {
                    let user = await users.findOne({username})
                    if (user) return done(null, false) //te envia un error (null) y la data(falso)
                    const newUser = {
                        username,
                        password: createHash(password), 
                        email: req.body.email, 
                        first_name: req.body.first_name, 
                        last_name: req.body.last_name,
                        age: req.body.age,
                        address: req.body.address
                    }
                    try {
                        let result = await users.create(newUser)
                        return done(null, result)
                    } catch (err) {
                        done(err)
                    }
                }
                catch (err) {
                    done(err)
                }
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user)
    })
    passport.deserializeUser( async (user, done) => {
        done(null, user);
    })

    passport.use(
        'login',
        new LocalStrategy(
            async(username, password, done) => {
                try {
                    let user = await users.findOne({username})
                    if (!user) return done(null, false)
                    if (!isValid(user, password)) return done(null, false)
                    return done(null,user)
                } catch(err) {
                    done(err)
                }
            }
        )
    )
}
