var express = require('express');
var router = express.Router();
var db = require('../services/databaseManager');

function isNull(parameter) {
    if (typeof (parameter) === 'undefined') {
        return true;
    }
    return false;
}

// get categories
router.post('/get', (req, res, next) => {
    db.executePrcedure('Category_Get', (request) => {
        var reqBody = req.body;
        if( !isNull(reqBody) ){
            if(!isNull(reqBody.Id)) {
                request.input('Id', reqBody.Id);
            }
            if(!isNull(reqBody.NameEn)) {
                request.input('NameEn', reqBody.NameEn);
            }
            if(!isNull(reqBody.NameAr)) {
                request.input('NameAr', reqBody.NameAr);
            }
            if( !isNull(reqBody.ParentId)) {
                request.input('ParentId', reqBody.ParentId);
            }
        }
    }).then((result) => {
        res.json({
            ErrorType: 0,
            ErrorMessage: 'success',
            Data: result.Data
        })
    }).catch((result) => {
        res.json(result);
    })
});

// create category
router.post('/create', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.NameAr) || isNull(reqBody.NameEn) || isNull(reqBody.ImageContent)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        })
    } else {
        db.executePrcedure('Category_Create', (request) => {
            var buf = Buffer.from(reqBody.ImageContent, 'base64');
            request.input('NameAr', reqBody.NameAr);
            request.input('NameEn', reqBody.NameEn);
            if (!isNull(reqBody.ParentId) && reqBody.ParentId != 0) {
                request.input('ParentId', reqBody.ParentId);
            }
            request.input('ImageContent', buf);
        }).then((result) => {
            var spRetVal = result.Data[0].Result;
            if(spRetVal == 1){
                result.ErrorType = 3;
                result.ErrorMessage = 'Parent category does not exist';
                result.Data = null;
            }
            res.json(result);
        }).catch((result) => {
            res.json(result);
        });
    }
});

// update category
router.post('/update', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.Id) || isNull(reqBody.NameAr) || isNull(reqBody.NameEn)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        })
    } else {
        db.executePrcedure('Category_Update', (request) => {
            request.input('Id', reqBody.Id);
            request.input('NameAr', reqBody.NameAr);
            request.input('NameEn', reqBody.NameEn);
            if (!isNull(reqBody.ParentId) && reqBody.ParentId != 0) {
                request.input('ParentId', reqBody.ParentId);
            }
        }).then((result) => {
            var spRetVal = result.Data[0].Result;
            if(spRetVal == 4){
                result.ErrorType = 3;
                result.ErrorMessage = 'Parent does not exist';
                result.Data = null;
            }
            if(spRetVal == 3){
                result.ErrorType = 4;
                result.ErrorMessage = 'Category does not exist';
                result.Data = null;
            }
            res.json(result);
        }).catch((result) => {
            res.json(result);
        });
    }
});


module.exports = router;