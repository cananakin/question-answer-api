const User = require('../../models/User');
const Question = require('../../models/Question');
const Answer = require('../../models/Answer');
const CustomError = require('../../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if(!user) {
        next( new CustomError('There is no such user with that id ', 400))
    }

    req.user = user;
    next();
});

const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
    const id = req.params.id || req.params.question_id;
    
    const question = await Question.findById(id);
    
    if(!question) {
        next( new CustomError('There is no such question with that id', 400))
    }

    req.question = question;
    next();
});

const checkAnswerandQuestionExist = asyncErrorWrapper(async (req, res, next) => {
    const question_id = req.params.question_id;
    const answer_id = req.params.answer_id;
    
    const answer = await Answer.findOne({
        _id: answer_id,
        question: question_id
    });
    
    if(!answer) {
        next( new CustomError('There is no answer id with associated with question id', 400))
    }

    req.answer = answer;
    next();
});

module.exports = { checkUserExist, checkQuestionExist, checkAnswerandQuestionExist }