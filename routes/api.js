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
    dbConnection = MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
  }
  return dbConnection;
}

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(function (req, res){
      let project = req.params.project;
      let { query } = req;
      if (query.open) {
        if (query.open === 'true') query.open = true;
        if (query.open === 'false') query.open = false;
      }
      getDBConnection().then(client => {
        let db = client.db('test');
        db.collection(project).find(query).toArray()
          .then(result => res.send(result))
          .catch(err => Promise.reject(err));
      })
      .catch(err => res.send(err));
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to = '', status_text = '' } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.send('missing inputs');
      }
      let created_on = new Date();
      let updated_on = created_on;
      let open = true;
      getDBConnection().then(client => {
        let db = client.db('test');
        db.collection(project).insertOne({
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          created_on,
          updated_on,
          open
        })
          .then(result => res.json(result.ops[0]))
          .catch(err => Promise.reject(err));
      })
      .catch(err => res.send(err));
    })
    
    .put(function (req, res){
      let project = req.params.project;
      console.log(req.body)
      let { _id, open } = req.body;
      if (!_id) {
        res.send('missing input: _id');
      }
      let updatedFields = {};
      for (let key in req.body) {
        if (Object.prototype.hasOwnProperty.call(req.body, key) && req.body[key]) {
          updatedFields[key] = req.body[key]
        }
      }
      if (open) {
        updatedFields.open = false;
      }
      delete updatedFields._id;
      if (!Object.keys(updatedFields).length) res.send('no updated field sent');
      updatedFields.updated_on = new Date();
      getDBConnection().then(client => {
        let db = client.db('test');
        db.collection(project).updateOne({ '_id' : ObjectId(_id) }, { $set: updatedFields })
          .then(result => {
            if(result.modifiedCount) {
              res.send('successfully updated');
            } else {
              res.send('could not update '+_id);
            }
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => res.send(err));
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let { _id } = req.body;
      if (!_id) {
        res.send('_id error');
      }
      getDBConnection().then(client => {
        let db = client.db('test');
        db.collection(project).deleteOne({ _id: ObjectId(_id) })
          .then(() => res.send(`deleted ${_id}`))
          .catch(err => Promise.reject(err));
      })
      .catch(() => res.send(`could not delete ${_id}`));
    });
   
};