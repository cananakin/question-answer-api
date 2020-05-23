const Question = require('../models/Question')
const Answer = require('../models/Answer')
const asynErrorWrapper = require('express-async-handler')
const CustomError = require('../helpers/error/CustomError')

const addNewAnswerToQuestion = asynErrorWrapper(async (req, res, next) => {
    const { question_id } = req.params;
    const user_id = req.user.id;

    const information = req.body;

    const answer = await Answer.create({
        ...information,
        question: question_id,
        user: user_id
    })
    
    
    return res.status(200).json({
        success: true,
        data: answer
    })
})
const getAllAnswersByQuestion = asynErrorWrapper(async (req, res, next) => {
    const { question_id } = req.params;
    
    const question = await Question.findById(question_id).populate('answers')
    const answers = question.answers;

    return res.status(200).json({
        success: true,
        count: answers.length,
        data: answers
    })
})

const getSingleAnswer = asynErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params;
    
    const answer = await Answer.findById(answer_id)
        .populate(
            { 
                'path': 'question',
                'select': 'title content'
            }
        )
        .populate({
            'path' : 'user',
            'select': 'name profile_image'
        })
    
    return res.status(200).json({
        success: true,
        data: answer
    })
})

const updateAnswer = asynErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params;
    const { content } = req.body;
    
    const answer = await Answer.findById(answer_id)

    answer.content = content;

    await answer.save()
    
    return res.status(200).json({
        success: true,
        data: answer
    })
})

const deleteAnswer = asynErrorWrapper(async (req, res, next) => {
    const { answer_id, question_id } = req.params;
    
    await Answer.findByIdAndRemove(answer_id)
    
    const question = await Question.findById(question_id)
    const index = question.answers.indexOf(answer_id)
    
    question.answers.splice(index,1)

    await question.save()
    
    return res.status(200).json({
        success: true,
        message: 'Answer has been deleted - id: ' + answer_id
    })
})

const likeAnswer = asynErrorWrapper(async (req, res, next) => {

    const { answer_id } = req.params; 
    
    const answer = await Answer.findById(answer_id);

    // user likes it
    if( answer.likes.includes(req.user.id)){
        return next( new CustomError('You already like this question', 400))
    }

    answer.likes.push(req.user.id)
    
    await answer.save()
    
    return res.status(200)
        .json({
            success: true,
            message: 'You  have been liked',
            data: answer
        })
})

const unLikeAnswer = asynErrorWrapper(async (req, res, next) => {

    const { answer_id } = req.params; 
    
    const answer = await Answer.findById(answer_id);

    // user unlikes it
    if( !answer.likes.includes(req.user.id)){
        return next( new CustomError('You can not undo like operation for this answer', 400))
    }
    const index = answer.likes.indexOf(req.user.id)
    
    answer.likes.splice(index, 1)
    
    await answer.save()
    
    return res.status(200)
        .json({
            success: true,
            message: 'You have been undo liked',
            data:  answer
        })
})

module.exports = { addNewAnswerToQuestion, getAllAnswersByQuestion, getSingleAnswer, updateAnswer, deleteAnswer, likeAnswer, unLikeAnswer }

