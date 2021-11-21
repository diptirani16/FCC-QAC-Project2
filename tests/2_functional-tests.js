const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const issueKeys = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', '_id', 'created_on', 'updated_on', 'open']

suite('Functional Tests', function() {
    suite('testing post requests' , () => {
        // test 1
        test('create an issue with every field', () => {
            chai.request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'test with every field',
                    issue_text: 'this is a test to create an issue with every field',
                    created_by: 'Dipti Rani',
                    assigned_to: 'Ratan',
                    status_text: 'Checking...'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.hasAllKeys(res.body, issueKeys);

                    chai.request(server)
                        .delete('/api/issues/apitest')
                        .send({ _id: res.body['_id'] })
                        .end((err, res) => {
                            assert.equal(res.status, 200);
                            assert.hasAllKeys(res.body, ['result', '_id']);
                        })
                })
        });

        // test 2
        test('create an issue with only required fields', () => {
            chai.request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'test with only required fields',
                    issue_text: 'this test is to create an issue with only required fields',
                    created_by: 'Dipti',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.hasAllKeys(res.body, issueKeys);
                    
                    chai.request(server)
                    .delete('/api/issues/apitest')
                    .send({ _id: res.body['_id'] })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.hasAllKeys(res.body, ['result', '_id']);
                    })
                })
        });

        // test 3
        test('Create an issue with missing required fields', () => {
            chai.request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'test with missing required fields'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'required field(s) missing' })
                })
        });
    });

    suite('testing get requests', () => {
        // test 4
        test('view issues on a project', () => {
            chai.request(server)
                .get('/api/issues/apitest')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.isAbove(res.body.length, 0);
                    assert.hasAllKeys(res.body, issueKeys)
                })
        });

        // test 5
        test('view issues on a project with one filter', () => {
            chai.request(server)
                .get('/api/issues/apitest')
                .query({ open: true })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.equal(res.body.length, 1);
                })
        });

        // test 6
        test('view issues on a project with multiple filters', () => {
            chai.request(server)
                .get('/api/issues/apitest')
                .query({ open: true, issue_title: 'project with multiple filters' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                })
        });
    });

    suite('testing put requests', () => {
        // test 7
        test('Update one field on an issue' ,() => {
            chai.request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: "5fcd571a1f0511669621365a",
                    issue_title: 'changed issue title'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.hasAllKeys(res.body, ['result', '_id']);
                })
        });

        // test 8
        test('update multiple fields on an issue', () => {
            chai.request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: "5fcd571a1f0511669621365a",
                    issue_title: 'change issue title',
                    issue_text: 'change issue text'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.hasAllKeys(res.body, ['result', '_id']);
                })
        });

        // test 9
        test('Update an issue with missing _id', () => {
            chai.request(server)
                .put('/api/issues/apitest')
                .send({
                    issue_title: 'change issue title without id',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'missing_id' });
                })
        });

        // test 10
        test('Update an issue with no fields to update', () => {
            chai.request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '5ff0685efa0bdc2487b7595a',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: "5ff0685efa0bdc2487b7595a" });
                })
        });

        // test 11
        test('Update an issue with an invalid _id', () => {
            chai.request(server)
                .put('/api/issues/apitest')
                .send({
                    issue_title: 'change issue title with invalid id',
                    _id: 'invalid id'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'could not update', '_id': 'invalid id' });
                })
        });
    });

    suite('testing delete requests', () => {
        // test 12
        test('delete an issue', () => {
            chai.request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'test with every field',
                    issue_text: 'this is a test to create an issue with every field',
                    created_by: 'Dipti Rani',
                    assigned_to: 'Ratan',
                    status_text: 'Checking...'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.hasAllKeys(res.body, issueKeys);

                    chai.request(server)
                        .delete('/api/issues/apitest')
                        .send({ _id: res.body['_id'] })
                        .end((err, res) => {
                            assert.equal(res.status, 200);
                            assert.hasAllKeys(res.body, ['result', '_id']);
                        })
                })
        });

        // test 13
        test('delete an issue with invalid _id', () => {
            chai.request(server)
                .delete('/api/issues/apitest')
                .send({ _id: 'invalid id' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.hasAllKeys(res.body, ['error', '_id']);
                })
        });

        // test 14
        test('delete an issue with an missing _id', () => {
            chai.request(server)
                .delete('/api/issues/apitest')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, {'error': 'missing_id'});
                })
        });

    })

});
