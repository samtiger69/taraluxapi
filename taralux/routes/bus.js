var express = require('express');
var router = express.Router();
var db = require('../services/databaseManager');

function isNull(parameter) {
    if (typeof (parameter) === 'undefined') {
        return true;
    }
    return false;
}

// get bus
router.post('/get', (req, res, next) => {
    var reqBody = req.body;
    db.executePrcedure('Bus_Get', (request) => {
    }).then((result) => {
        res.json(result);
    }).catch((result) => {
        res.json(result);
    });
});

// save bus
router.post('/save', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.CurrentLocation) || isNull(reqBody.PhoneNumber)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        })
    } else {
        db.executePrcedure('Bus_Save', (request) => {
            request.input('CurrentLocation', reqBody.CurrentLocation);
            request.input('PhoneNumber', reqBody.PhoneNumber);
            if (!isNull(reqBody.SecondPhoneNumber)) {
                request.input('SecondPhoneNumber', reqBody.SecondPhoneNumber);
            }
        }).then((result) => {
            res.json(result);
        }).catch((result) => {
            res.json(result);
        });
    }
});

module.exports = router;