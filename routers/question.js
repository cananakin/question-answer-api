const express = require('express')
const Question = require('../models/Question')
const { askNewQuestion, getAllQuestions, getSingleQuestion, updateQuestion, deleteQuestion, likeQuestion, unLikeQuestion } = require('../controllers/question')
const { getAccessToRoute, getQuestionOwnerAccess } = require('../middlewares/authorization/auth')
const { checkQuestionExist } = require('../middlewares/database/databaseErrorHelpers')
const questionQueryMiddleware = require('../middlewares/query/questionQueryMiddleware')
const answerQueryMiddleware = require('../middlewares/query/answerQueryMiddleware')

const answer = require('./answer')

const router = express.Router();

router.get('/',questionQueryMiddleware(Question,{
    population: {
        path: "user",
        select: "name profile_image"
    }
}), getAllQuestions)
router.get('/:id/like',[getAccessToRoute ,checkQuestionExist], likeQuestion )
router.get('/:id/unlike',[getAccessToRoute ,checkQuestionExist], unLikeQuestion )
router.put('/:id/edit',[getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], updateQuestion )
router.delete('/:id/delete',[getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion )
router.get('/:id',[checkQuestionExist, answerQueryMiddleware(Question,
    {
        population: [
            {
                path: "answers",
                select: "content"
            },
            {
                path: "user",
                select: "name profile_image"
            }
        ]
    }
)], getSingleQuestion )
router.post('/ask', getAccessToRoute, askNewQuestion)

router.use('/:question_id/answers', checkQuestionExist, answer)

module.exports = router;