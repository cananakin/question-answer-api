const asynErrorWrapper = require('express-async-handler')

const { populateHelper, paginationHelper } = require('./queryMiddlewareHelpers')

const answerQueryMiddleware = function(model, options) {

    return asynErrorWrapper(async function(req, res, next) {
        const { id } = req.params;
        
        const arrayName = "answers";

        const total = (await model.findById(id))["answerCount"]
        
        const paginationResult = await paginationHelper(total, undefined, req);
        
        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;

        let queryObject = {};

        queryObject[arrayName] = { $slice : [startIndex, limit]}

        let query = model.find({_id : id}, queryObject);
        
        // query = searchHelper('name', query, req)

        if(options && options.population) {
            query = populateHelper(query, options.population);
        }

        // query = userSortHelper(query, req)
        // const total = await model.countDocuments();
        

        // query = paginationResult.query;
        // const pagination = paginationResult.pagination;

        const queryResults = await query; 
        
        res.queryResults = {
            success: true,
            //count: queryResults.length,
            pagination: paginationResult.pagination,
            data: queryResults
        }
        return next()
    })
}

module.exports = answerQueryMiddleware;
