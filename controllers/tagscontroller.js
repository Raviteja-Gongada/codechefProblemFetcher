const question = require("../models/question");
const Tag = require("../models/tag");
const User = require("../models/user");
const userDefined = require("../models/userDefinedTag");

exports.getAllTags = async (req,res) => {
    try {
                const actualTags = await Tag.find({
                    type: "actual_tag"
                }, {
                    _id: 0,
                    tag: 1
                });
        
                const authorTags = await Tag.find({
                    type: "author"
                }, {
                    tag: 1,
                    _id: 0
                });
    
                let userDefinedTags = null ;
                if(req.session.isLoggedIn){
                    const defined = await userDefined.find({user_id:req.session.user._id},
                        {tags:1,_id:0});
                        
                        if(defined.length)
                        userDefinedTags = defined[0].tags;
                }
                
                res.render("home", {authorTags, actualTags, userDefinedTags});
            } catch(err){
                console.log(err);
            }
}