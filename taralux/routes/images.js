var express = require('express');
var router = express.Router();
var db = require('../services/databaseManager');

function isNull(parameter) {
    if (typeof (parameter) === 'undefined') {
        return true;
    }
    return false;
}

// get image
router.post('/get', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.Id)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        });
    } else {
        db.executePrcedure('Image_Get_By_Id', (request) => {
            request.input('Id', reqBody.Id);
        }).then((result) => {
            if (isNull(result.Data[0])) {
                res.json({
                    ErrorType: 6,
                    ErrorMessage: 'image does not exist'
                })
            } else {
                var img = new Buffer(result.Data[0].Content).toString('base64');
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.end(img, 'base64');
            }
        }).catch((result) => {
            res.json(result);
        });
    }
});

// create image
router.post('/create', (req, res, next) => {
    var reqBody = req.body;
    if (isNull(reqBody) || isNull(reqBody.SourceId) || isNull(reqBody.Type) || isNull(reqBody.ImageContent)) {
        res.json({
            ErrorType: 1,
            ErrorMessage: 'empty required field'
        })
    } else {
        db.executePrcedure('Image_Create', (request) => {
            var buf = Buffer.from(reqBody.ImageContent, 'base64');
            request.input('SourceId', reqBody.SourceId);
            request.input('Type', reqBody.Type);
            request.input('Content', buf);
            if (isNull(reqBody.ImageIsDefault)) {
                request.input('IsDefault', 0);
            } else {
                request.input('IsDefault', reqBody.ImageIsDefault);
            }
        }).then((result) => {
            var spRetVal = result.Data[0].Result;
            if (spRetVal == -1) {
                result.ErrorType = 8;
                result.ErrorMessage = 'Source does not exist';
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
            if (spRetVal == 4) {
                result.ErrorType = 5;
                result.ErrorMessage = 'cannot delete default image';
                result.Data = null;
            }
            if (spRetVal == 3) {
                result.ErrorType = 6;
                result.ErrorMessage = 'Image does not exist';
                result.Data = null;
            }
            res.json(result);
        }).catch((result) => {
            res.json(result);
        });
    }
});

module.exports = router;