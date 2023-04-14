import { Router } from "express";
import passport from "passport";
import { etherealMail } from "../middlewares/middlewares.js";
import { clearCookies, getGoogle, getLogin, getLoginError, getLogout, getRegister, getRegisterError, postLogin, postRegister } from "../controllers/auth.controller.js";

const router = Router()

router.get('/register', getRegister)

router.post('/register', passport.authenticate('register', 
{failureRedirect: '/auth/registerError'}), etherealMail, postRegister)

router.get('/login', getLogin)

router.post('/login', passport.authenticate('login',
{failureRedirect: '/auth/loginError'}), postLogin)

router.get('/logout', getLogout)

router.get('/clearCookies', clearCookies)

router.get('/loginError', getLoginError)

router.get('/registerError', getRegisterError)

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/auth/loginError'}), getGoogle)


export default router