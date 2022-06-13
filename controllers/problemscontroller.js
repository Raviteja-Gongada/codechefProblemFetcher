const express = require("express");
const Question = require("../models/question");
const Tag = require("../models/tag");
const userDefined = require("../models/userDefinedTag");
// const User = require("../models/user")

exports.getAllQuestions = async (req,res) => {
    let {author, concept, userDefined} = req.body;
    let userId = null;
    if(req.session.isLoggedIn)
    userId= req.session.user._id;

        if (typeof(author) === "string") {
            author = [author];
        }
        if (typeof(concept) === "string") {
            concept = [concept];
        }
        if (typeof(userDefined) === "string") {
            userDefined = [userDefined]
        }

        if (typeof(author) === "undefined") {
            author = []
        }
        if (typeof(concept) === "undefined") {
            concept = []
        }
        if (typeof(userDefined) === "undefined") {
            userDefined = []
        }


        let tags = [
            ...author,
            ...concept,
            ...userDefined
        ]

        if (userId === null) {
            try {
                const questions = await Question.find({
                    tags: {
                        $all: tags
                    }
                }, {problemName: 1,_id:1})
                res.render("allproblem", {data: questions,tags});
            } catch (err) {
                res.status(500).send({err: "Error fetching problems"});
            }
        } else {
            try {
                const questions = await Question.find({
                    $or: [
                        {
                            tags: {
                                $all: tags
                            }
                        }, {
                            $and: [
                                {
                                    "userDefinedTags.tags": {
                                        $all: tags
                                    }
                                }, {
                                    "userDefinedTags.user_id": userId
                                },
                            ]
                        },
                    ]
                })
                res.render("allproblem", {data: questions,tags});
            } catch (err) {
                res.status(500).send({err: "Error fetching problems"});
            }
        }
    
}

exports.getProblem = async (req,res) => {
    let problemId = req.params.id;
    let tags=null;
    try{
        let problem = await Question.findById(problemId,{problemName:1,_id:1,body:1,tags:1});
        if(req.session.isLoggedIn){
            let  userId = req.session.user._id;
           let defined = await Question.findOne({
                _id: problemId,
                "userDefinedTags.user_id": {
                    $eq: userId
                }
            },{ "userDefinedTags.$": 1, _id: 0 });
            if(defined !== null)
            tags= defined.userDefinedTags[0].tags;
            else{
                tags = problem.tags;
            }
        }else{
            tags = problem.tags;
        }
        res.render("problem",{problem,tags});
    } catch(err){
        console.log("Error in finding the problem");
    }
}

exports.addNewTag = async (req,res) => {
    let  userId = req.session.user._id;

    let problemId = req.params.id;
    let {newTag} = req.body;
        try {
            let updateUserTags = await userDefined.findOneAndUpdate({user_id: userId},
                {
                    $addToSet: {
                        tags: newTag
                    }
                }
                );

                if(updateUserTags === null){
                    let update = await userDefined.create({
                            user_id: userId,
                            count:1,
                            tags: newTag
                    });
                }
            let problemTags = await Question.findById(problemId, {
                _id: 0,
                tags: 1
            });
    
            let updateProblem = await Question.findOneAndUpdate({
                _id: problemId,
                "userDefinedTags.user_id": {
                    $eq: userId
                }
            }, {
                $addToSet: {
                    "userDefinedTags.$.tags": newTag
                }
            });
            if (updateProblem === null) {
                updateProblem = await Question.findByIdAndUpdate(problemId, {
                    $push: {
                        userDefinedTags: {
                            user_id: userId,
                            tags: [
                                newTag,
                                ... problemTags.tags
                            ]
                        }
                    }
                }, {
                    userDefinedTags: 1,
                    _id: 0
                });
            }
            res.redirect("/questions/"+problemId);

        } catch (err) {
            console.log(err);
        }
}