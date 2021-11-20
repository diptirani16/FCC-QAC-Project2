'use strict';

const Server = require('../database/server');
Server.connection(process.env.MONGO).then(() => {
  console.log('Database connected!')
}).catch((err) => {
  console.log(err);
})

const updatedIssueObject = (data) => {
  let output = {};

  if(data['open']) {
    output['open'] = false;
  }
  else {
    output['open'] = true;
  }

  for(let property in data) {
    if(property === 'open') {
      continue;
    }
    if(data[property] !== '' && property !== '_id') {
      output[property] = data[property];
    }
  }

  output['updated_on'] = new Date().toISOString();
  return output;
}

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let issueData = {};

      if(Object.keys(req.query).length !== 0) {
        issueData = {...req.query};
      }
      else {
        issueData.project = project; 
      }

      Server.findIssue(issueData)
        .then((data) => {
        res.json(data);
        })
        .catch((err) => {
          res.send('Error !!');
        })

    })
    
    .post(function (req, res){
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by || issue_title === '' || issue_text === '' || created_by === '') {
        return res.json({ error: 'required field(s) missing' });
      }

      const created_on = new Date().toISOString();
      const updated_on = created_on;
      const open = true;

      if(!assigned_to) {
        assigned_to = "";
      }
      if(!status_text) {
        status_text = "";
      }

      Server.addIssue({issue_title, issue_text, created_on, updated_on, created_by, assigned_to, open, status_text, project})
        .then((newData) => {
          return res.json(newData)
        })
        .catch(() => {
          return res.send("Error !!");
        })
    })
    
    .put(function (req, res){
      let idToUpdate = req.body['_id'];
      
      if(!idToUpdate || idToUpdate === "") {
        return res.json({ error: 'missing_id' });
      }

      if(Object.keys(req.body).length <= 1) {
        return res.json({ 
          error: 'no update field(s) sent',
          '_id': idToDelete
        })
      }

      const updatedIssue = updatedIssueObject(req.body);

      Server.updateIssue(idToUpdate, updatedIssue)
        .then(() => {
          return res.json({
            result: 'successfully updated',
            '_id': idToUpdate
          })
        })
        .catch(() => {
          res.json({
            error: 'could not update',
            '_id': idToUpdate
          })
        })
    })
    
    .delete(function (req, res){
      let idToDelete = req.body['_id'];

      if(!idToDelete || idToDelete === ""){
        return res.json({ error: 'missing_id'});
      }

      Server.deleteIssue(idToDelete)
        .then(() =>
          res.json({
            result: 'successfully deleted',
            '_id': idToDelete
          }))
        .catch(() => {
          res.json({ 
            error: 'could not delete',
            '_id': idToDelete
          })
        })
      
    });
    
};
