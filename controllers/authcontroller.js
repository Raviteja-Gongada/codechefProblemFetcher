const database = require("../models/user");
const bcrypt =require("bcrypt");

exports.logout = (req,res) => {
    req.session.isLoggedIn = false;
    res.redirect("/login");
}

exports.postSignUp = async (req,res) => {
    let fullname = req.body.fullname,
    email = req.body.email,
    password = req.body.password;

    let usertaken = await database.findOne({email : req.body.email});
    if(usertaken){
        await req.flash('message','Already registered');
        res.render("register/signup",{message: req.flash('message')});
    }else{
        let username = email.split("@")[0];
        
        let hashedPassword = await bcrypt.hash(password,12);

        const user = await database.create({
            fullName: fullname,
            email,
            password : hashedPassword,
            username,
            tags: [{}]
        });
        req.session.isLoggedIn = true;
        req.session.user=user;
        res.redirect("/");
    }
}

exports.postLogin = async (req, res) => {
    try{
        let user = await database.findOne({email : req.body.email});
        if(user){
            let password=req.body.password, hashedPassword=user.password;
            const result = await bcrypt.compare(password,hashedPassword);
            if(result){
                req.session.isLoggedIn = true;
                req.session.user=user;
                res.redirect("/");
            }
            else{
                await req.flash('message',"Invalid email or password");
                res.render("register/login",{message: req.flash('message')});
            }
        } 
        else {
            await req.flash('message',"Invalid email");
            res.render("register/login",{message: req.flash('message')});
        }
    } catch(err){
        console.log(err);
    }
}

exports.getLogin = async (req, res) => { 
    if(req.session.isLoggedIn){
        return res.redirect("/");
    }
    req.flash('message','');
    res.render("register/login",{message: req.flash('message')});
}
exports.getSignUp = async (req, res) => {
    if(req.session.isLoggedIn){
        return res.redirect("/");
    }
    req.flash('message','');
    res.render("register/signup",{message: req.flash('message')});
}
