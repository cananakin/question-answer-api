const Question = require('../models/Question')
const asynErrorWrapper = require('express-async-handler')
const CustomError = require('../helpers/error/CustomError')

const getAllQuestions = asynErrorWrapper((req, res, next) => {

    return res.status(200)
        .json(res.queryResults)
})

const askNewQuestion = asynErrorWrapper(async (req, res, next) => {

    const data = req.body;

    const question = await Question.create({
        ...data,
        user: req.user.id
    })
    
    return res.status(200)
        .json({
            success: true,
            message: 'New question has been added',
            data: question
        })
})

const getSingleQuestion = asynErrorWrapper(async (req, res, next) => {

    // const { id } = req.params; 
    // const questions = await Question.findById(id);
    return res.status(200)
        .json(res.queryResults)
})

const updateQuestion = asynErrorWrapper(async (req, res, next) => {

    const { id } = req.params; 
    const { title, content } = req.body;
    const data = req.body;
    let question = await Question.findById(id)
    
    if(title !== undefined && title !== '')
        question.title = title; 
    if(content !== undefined && content !== '')
        question.content = content;
    
    await question.save();

    return res.status(200)
        .json({
            success: true,
            message: 'Successful',
            data: question
        })
})

const deleteQuestion = asynErrorWrapper(async (req, res, next) => {

    const { id } = req.params; 
    
    await Question.findByIdAndDelete(id);
    
    return res.status(200)
        .json({
            success: true,
            message: 'Successful'
        })
})

const likeQuestion = asynErrorWrapper(async (req, res, next) => {

    const { id } = req.params; 
    
    const question = await Question.findById(id);

    // user likes it
    if( question.likes.includes(req.user.id)){
        return next( new CustomError('You already like this question', 400))
    }

    question.likes.push(req.user.id)
    question.likeCount = question.likes.length;
    
    await question.save()
    
    return res.status(200)
        .json({
            success: true,
            message: 'You  have been liked',
            data: question
        })
})

const unLikeQuestion = asynErrorWrapper(async (req, res, next) => {

    const { id } = req.params; 
    
    const question = await Question.findById(id);

    // user unlikes it
    if( !question.likes.includes(req.user.id)){
        return next( new CustomError('You cannot unlike this question', 400))
    }
    const index = question.likes.indexOf(req.user.id)
    
    question.likes.splice(index, 1)
    question.likeCount = question.likes.length;

    await question.save()
    
    return res.status(200)
        .json({
            success: true,
            message: 'You  have been unliked',
            data:  question
        })
})

module.exports = { askNewQuestion, getAllQuestions, getSingleQuestion, updateQuestion, deleteQuestion, likeQuestion, unLikeQuestion }