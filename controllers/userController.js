var express = require('express');
var router = express.Router();
const UserSchema = require('../models/userModel')
const PropertySchema = require('../models/propertyModel')
const AppointmentSchema = require('../models/appointmentModel');
const passport = require('passport');
const LocalStrategy = require('passport-local');
require('dotenv').config();
passport.use(UserSchema.createStrategy());

const homepage = async (req, res, next) => {
    try {
        const properties = await PropertySchema.find().populate('owner')
        res.render('index', {
            properties: properties,
            user: req.user,
            property: req.params.propertyId,
        })
    } catch (error) {
        console.log(error.message)
        res.send(error)
    }
}
const aboutpage = async (req, res, next) => {
    try {
        res.render('about', { user: req.user })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const currentUser = async (req, res, next) => {
    const properties = await PropertySchema.find().populate("owner")
    const appointments = await AppointmentSchema.find().populate("owner")
    res.render("profile", {
        properties: properties,
        appointments: appointments,
        user: req.user
    })
}
const getRegister = (req, res, next) => {
    res.render('register', {
        user: req.user
    })
}
const postRegister = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body
        const newUser = new UserSchema({ name, email, role })
        await UserSchema.register(newUser, password)
        await newUser.save()
        res.redirect("/user/login")
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const getLogin = (req, res, next) => {
    res.render("login", { user: req.user })
}
const postLogin = passport.authenticate("local", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/login",
})
const getLogout = (req, res, next) => {
    try {
        req.logout(() => {
            res.redirect('/user')
        })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
}
const profile = async (req, res, next) => {
    try {
        const properties = await PropertySchema.find().populate('owner')
        const appointments = await AppointmentSchema.find().populate('owner')
        res.render('profile', {
            properties: properties,
            appointments: appointments,
            user: req.user,
            propertyId: req.params.propertyId

        })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
}
module.exports = {
    homepage,
    aboutpage,
    currentUser,
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getLogout,
    profile
}