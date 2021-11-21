const mongoose = require('mongoose');

const connection = async (url) => {
    if(url) {
        mongoose.connect(url)
            .then(() => {
                return Promise.resolve();
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }
    else {
        return Promise.reject('No url provided');
    }
}

const issueSchema = new mongoose.Schema({
    issue_title: String,
    issue_text: String,
    created_on: String,
    updated_on: String,
    created_by: String,
    assigned_to: String,
    open: Boolean,
    status_text: String,
    project: String
}, {
    versionKey: false
});

const Issue = mongoose.model('Issue', issueSchema);

const addIssue = async (newIssueObj) => {
    const newIssue = new Issue(newIssueObj);
    await newIssue.save();
    return await findOne(newIssue._id);
}

const findOne = async (id) => {
    const issue = await Issue.findById(id, '-project -__v')
    return issue;
}

const findIssue = async (obj) => {
    const issue = await Issue.find(obj, '-project -__v')
    return issue;
}

const updateIssue = async (id, updatedIssue) => {
    const issueToUpdate = await Issue.findById(id);
    for(let property in updatedIssue) {
        issueToUpdate[property] = updatedIssue[property];
    }
    await issueToUpdate.save();
}

const deleteIssue = async (id) => {
    let issueToDelete = await Issue.findById(id);
    if(issueToDelete) {
        await Issue.findByIdAndDelete(id).exec();
    }
    else {
        throw new Error('missing_id');
    }
}

module.exports = {
    connection,
    addIssue,
    findIssue,
    updateIssue,
    deleteIssue
}