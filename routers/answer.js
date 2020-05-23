const express = require('express');
const { getAccessToRoute, getAnswerOwnerAccess } = require('../middlewares/authorization/auth')
const { checkAnswerandQuestionExist } = require('../middlewares/database/databaseErrorHelpers')
const { addNewAnswerToQuestion, getAllAnswersByQuestion, getSingleAnswer, updateAnswer, deleteAnswer, likeAnswer, unLikeAnswer } = require('../controllers/answer')

const router = express.Router({ mergeParams: true});

router.get('/', getAccessToRoute, getAllAnswersByQuestion )
router.post('/add', getAccessToRoute, addNewAnswerToQuestion )
router.get('/:answer_id', [getAccessToRoute, checkAnswerandQuestionExist], getSingleAnswer )
router.put('/:answer_id/edit', [getAccessToRoute, checkAnswerandQuestionExist, getAnswerOwnerAccess], updateAnswer )
router.delete('/:answer_id/delete', [getAccessToRoute, checkAnswerandQuestionExist, getAnswerOwnerAccess], deleteAnswer )
router.get('/:answer_id/like', [getAccessToRoute, checkAnswerandQuestionExist], likeAnswer )
router.get('/:answer_id/undo-like', [getAccessToRoute, checkAnswerandQuestionExist], unLikeAnswer )

module.exports = router;