var express = require('express');
var router = express.Router();
var db = require('../services/databaseManager');

function isNull(parameter) {
    if (typeof (parameter) === 'undefined') {
        return true;
    }
    return false;
}

// get electricianComments
router.post('/get', (req, res, next) => {
    var reqBody = req.body;
    db.executePrcedure('ElectricianComment_Get', (request) => {
        if (!isNull(reqBody)) {
            if (!isNull(reqBody.Id)) {
                request.input('Id', reqBody.Id)
            }
            if (!isNull(reqBody.ElectricianId)) {
                request.input('ElectricianId', reqBody.ElectricianId);
            }
            if (!isNull(reqBody.CommentedBy)) {
                request.input('CommentedBy', reqBody.CommentedBy);
            }
        }
    }).then((result) => {
        res.json(result);
    }).catch((result) => {
        res.json(result);
    });
});

// create electricianComment
router.post('/save', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.ElectricianId) || isNull(reqBody.CommentedBy) || isNull(reqBody.Rate)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        })
    } else {
        db.executePrcedure('ElectricianComment_Save', (request) => {
            request.input('ElectricianId', reqBody.ElectricianId);
            request.input('CommentedBy', reqBody.CommentedBy);
            request.input('Rate', reqBody.Rate);
            if (!isNull(reqBody.Comment)) {
                request.input('Comment', reqBody.Comment);
            }
        }).then((result) => {
            res.json(result);
        }).catch((result) => {
            res.json(result);
        });
    }
});

module.exports = router;