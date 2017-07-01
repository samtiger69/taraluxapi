var express = require('express');
var router = express.Router();
var db = require('../services/databaseManager');

function formTree(node, nodes) {
    if (typeof (node) !== 'undefined') {
        var i = 0;
        node.Children = [];
        while (typeof (nodes[i]) !== 'undefined') {
            var child = nodes[i++];
            if (child.ParentId == node.Id) {
                node.Children.push(child);
                formTree(child, nodes)
            }
        }
    }
}

function isNull(parameter) {
    if (typeof (parameter) === 'undefined') {
        return true;
    }
    return false;
}

// get categories
router.post('/get', (req, res, next) => {
    db.executePrcedure('Category_Get', (request) => {
    }).then((result) => {
        // var root = {
        //     Id: -1,
        //     NameAr: 'Root Ar',
        //     NameEn: 'Root En',
        //     ParentId: null,
        //     ImageId: -1,
        //     Children: []
        // };
        // var i = 0;
        // while (typeof (result.Data[i]) !== 'undefined') {
        //     var child = result.Data[i++];
        //     if (child.ParentId == null) {
        //         root.Children.push(child);
        //         formTree(child, result.Data)
        //     }
        // }
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