var express = require('express');
var router = express.Router();
var db = require('../services/databaseManager');
// var mongojs = require('mongojs');
// var db = mongojs('mongodb://sam:123@ds131621.mlab.com:31621/meantodosam', ['todos']);

function isNull(parameter) {
    if (typeof (parameter) === 'undefined') {
        return true;
    }
    return false;
}

// get electricians
router.post('/get', (req, res, next) => {
    var reqBody = req.body;
    db.executePrcedure('Electrician_Get', (request) => {
        if (!isNull(reqBody) || !isNull(reqBody.Id) && reqBody.Id != 0) {
            request.input('Id', reqBody.Id)
        }
    }).then((result) => {
        res.json(result);
    }).catch((result) => {
        res.json(result);
    });
});

// create electrician
router.post('/create', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.NameAr) || isNull(reqBody.PhoneNumber) ||
        isNull(reqBody.Location) || isNull(reqBody.Description) || isNull(reqBody.NameEn) || isNull(reqBody.ImageContent)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        })
    } else {
        db.executePrcedure('Electrician_Create', (request) => {
            var buf = Buffer.from(reqBody.ImageContent, 'base64');
            request.input('NameAr', reqBody.NameAr);
            request.input('NameEn', reqBody.NameEn);
            request.input('PhoneNumber', reqBody.PhoneNumber);
            request.input('Location', reqBody.Location);
            request.input('Description', reqBody.Description);
            request.input('ImageContent', buf);
            if (isNull(reqBody.ImageIsDefault)) {
                request.input('ImageIsDefault', 0);
            } else {
                request.input('ImageIsDefault', reqBody.ImageIsDefault);
            }
        }).then((result) => {
            res.json(result);
        }).catch((result) => {
            res.json(result);
        });
    }
});

// update electrician
router.post('/update', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.Id) || isNull(reqBody.NameAr) || isNull(reqBody.PhoneNumber) ||
        isNull(reqBody.Location) || isNull(reqBody.Description) || isNull(reqBody.NameEn)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        })
    } else {
        db.executePrcedure('Electrician_Update', (request) => {
            request.input('Id', reqBody.Id);
            request.input('NameAr', reqBody.NameAr);
            request.input('NameEn', reqBody.NameEn);
            request.input('PhoneNumber', reqBody.PhoneNumber);
            request.input('Location', reqBody.Location);
            request.input('Description', reqBody.Description);
        }).then((result) => {
            res.json(result);
        }).catch((result) => {
            res.json(result);
        });
    }
});

// delete electrician
router.post('/delete', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.Id)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        })
    } else {
        db.executePrcedure('Electrician_Delete', (request) => {
            request.input('Id', reqBody.Id);
        }).then((result) => {
            res.json(result);
        }).catch((result) => {
            res.json(result);
        });
    }
});

module.exports = router;