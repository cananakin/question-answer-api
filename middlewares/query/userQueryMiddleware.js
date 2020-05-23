const asynErrorWrapper = require('express-async-handler')

const { searchHelper, userSortHelper, paginationHelper } = require('./queryMiddlewareHelpers')

const userQueryMiddleware = function(model, options) {

    return asynErrorWrapper(async function(req, res, next) {
        let query = model.find();
        
        query = searchHelper('name', query, req)

        // if(options && options.population) {
        //     query = populateHelper(query, options.population);
        // }

        query = userSortHelper(query, req)
        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total, query, req);

        query = paginationResult.query;
        const pagination = paginationResult.pagination;

        const queryResults = await query; 
        
        res.queryResults = {
            success: true,
            count: queryResults.length,
            pagination: pagination,
            data: queryResults
        }
        return next()
    })
}

module.exports = userQueryMiddleware;
