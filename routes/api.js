'use strict';

const Server = require('../database/server');
Server.connection(process.env.MONGO).then(() => {
  console.log('Database connected!')
}).catch((err) => {
  console.log(err);
})

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
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
      let project = req.params.project;
      
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
