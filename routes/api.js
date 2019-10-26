/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

let dbConnection;

function getDBConnection() {
  if (!dbConnection) {
    dbConnection = MongoClient.connect(process.env.DB, { useNewUrlParser: true });
  }
  return dbConnection;
}

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
