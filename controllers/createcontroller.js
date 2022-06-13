const Question = require("../models/question");
const userDefined = require("../models/userDefinedTag");
const Tag = require("../models/tag");

exports.getInputForm = (req, res) => {
    res.render("createproblem.ejs");
}

exports.createProblem = async (req,res) => {
    const problemName = req.body.problemName;
    const body = req.body.problem;
    let tags = req.body.tags.split(" ");

    let user =req.session.user.fullName;
    let user_Id = req.session.user._id;

    try{

    let updateUserTags = await userDefined.findOneAndUpdate({user_id: user_Id},
        {
            $addToSet: { tags: { $each: [ ...tags ] }
        }
    });
        if(updateUserTags === null){
            let update = await userDefined.create({
                    user_id: user_Id,
                    count:1,
                    tags
            });

        }
        tags = [...tags,user];

        const data = await Question.create(
            {
            author: user, 
            problemName: problemName,
            body, 
            tags : user,
            userDefinedTags: {
                user_id: user_Id,
                tags
            }
        });

        const foundTag = await Tag.find({tag: user, type: "author"}); 
    if (! foundTag.length) {
        const newTag = await Tag.create({tag: user, type: "author"});
    }

        res.redirect("/home");
    } catch(err){
        console.log(err);
    }
};