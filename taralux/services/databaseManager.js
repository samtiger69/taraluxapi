var sql = require("mssql");


// config for your database
var config = {
    user: 'gfwvrlqictziyeij',
    password: 'BxmitkHRt5Gvgk4kMfLZ3FqAzgV5AcqAU8VvGiSeMkET3so3ZUQ2FBA5gTRmxLqq',
    server: '153d5503-694d-4ade-bbc6-a797012d4c6f.sqlserver.sequelizer.com',
    database: 'db153d5503694d4adebbc6a797012d4c6f'
};

var db = {};

db.executePrcedure = function (procedureName, fillParameters) {
    return new Promise((resolve, reject) => {
        sql.connect(config, function (err) {
            if (err) {
                reject({
                    ErrorType: 2,
                    ErrorMessage: err
                });
            } else {
                var request = new sql.Request();
                fillParameters(request);
                request.execute(procedureName, (error, recordsets, returnValue, affected) => {
                    if (error) {
                        sql.close();
                        reject({
                            ErrorType: 2,
                            ErrorMessage: error
                        });
                    } else {
                        sql.close();
                        resolve({
                            ErrorType: 0,
                            ErrorMessage: 'success',
                            Data: recordsets.recordset
                        });
                    }
                });
            }
        });
    });
}

module.exports = db;