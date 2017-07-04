var express = require('express');
var router = express.Router();
var db = require('../services/databaseManager');

function isNull(parameter) {
    if (typeof (parameter) === 'undefined') {
        return true;
    }
    return false;
}

// get items
router.post('/get', (req, res, next) => {
    var reqBody = req.body;
    db.executePrcedure('Item_Get', (request) => {
        if (!isNull(reqBody)) {
            if (!isNull(reqBody.Id)) {
                request.input('Id', reqBody.Id)
            }
            if (!isNull(reqBody.CategoryId)) {
                request.input('CategoryId', reqBody.CategoryId);
            }
            if (!isNull(reqBody.NameAr)) {
                request.input('NameAr', reqBody.NameAr);
            }
            if (!isNull(reqBody.NameEn)) {
                request.input('NameEn', reqBody.NameEn);
            }
        }
    }).then((result) => {
        res.json(result);
    }).catch((result) => {
        res.json(result);
    });
});

// create item
router.post('/create', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.NameAr) || isNull(reqBody.CategoryId) || isNull(reqBody.Price) || isNull(reqBody.NameEn) || isNull(reqBody.ImageContent)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        })
    } else {
        db.executePrcedure('Item_Create', (request) => {
            var buf = Buffer.from(reqBody.ImageContent, 'base64');
            request.input('NameAr', reqBody.NameAr);
            request.input('NameEn', reqBody.NameEn);
            request.input('CategoryId', reqBody.CategoryId);
            request.input('Price', reqBody.Price);
            request.input('ImageContent', buf);
        }).then((result) => {
            var spRetVal = result.Data[0].Result;
            if (spRetVal == 3) {
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

// update item
router.post('/update', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.Id) || isNull(reqBody.Price) || isNull(reqBody.NameAr) || isNull(reqBody.NameEn) || isNull(reqBody.CategoryId)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        })
    } else {
        db.executePrcedure('Item_Update', (request) => {
            request.input('Id', reqBody.Id);
            request.input('NameAr', reqBody.NameAr);
            request.input('NameEn', reqBody.NameEn);
            request.input('CategoryId', reqBody.CategoryId);
            request.input('Price', reqBody.Price);
        }).then((result) => {
            var spRetVal = result.Data[0].Result;
            if (spRetVal == 4) {
                result.ErrorType = 4;
                result.ErrorMessage = 'Category does not exist';
                result.Data = null;
            }
            if (spRetVal == 3) {
                result.ErrorType = 8;
                result.ErrorMessage = 'Item does not exist';
                result.Data = null;
            }
            res.json(result);
        }).catch((result) => {
            res.json(result);
        });
    }
});


// delete item
router.post('/delete', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.Id)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        })
    } else {
        db.executePrcedure('Item_Delete', (request) => {
            request.input('Id', reqBody.Id);
        }).then((result) => {
            var spRetVal = result.Data[0].Result;
            if (spRetVal == 3) {
                result.ErrorType = 8;
                result.ErrorMessage = 'Item does not exist';
                result.Data = null;
            }
            res.json(result);
        }).catch((result) => {
            res.json(result);
        });
    }
});

module.exports = router;