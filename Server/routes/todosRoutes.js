const Task = require('../classModels/TodoTasks');
const mongoose = require('mongoose');

function validate(data) {
    let errors = {};

    if(data.title === '') errors.title = "Cannot be empty";
    if(data.note === '') errors.note = "Cannot be empty";

    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid };
}

module.exports = (app, db) => {

    app.get('/api/todoTasks', (req, res) => {
        db.collection('tasks').find({}).toArray((err, tasks) => {
            res.json({ tasks })
        });
    });

    ////////////////////////////////////////////////////////////////

    app.get(`/api/todoTasksSearch/:data`, (req, res) => {

        const { data } = req.params

        db.collection('tasks').find({
            "title": { $regex: new RegExp(data, "i" )}
        }).toArray((err, tasks) => {
            if(err) {
                res.status(500).json({ errors: { global: 'Something went wrong' }});
            } else {
                // console.log("result.ops[0]: ", result.ops[0])
                res.status(200).json({ tasks });
            }
        })
    });

    ////////////////////////////////////////////////////////////////
    // Sorting
    app.get(`/api/todoTasksSortBy/:selection`, (req, res) => {

        const { selection } = req.params;
        if(selection === 'aescending') {
            db.collection('tasks').find({}).sort('createdDate', 1).toArray((err, tasks) => {
                if(err) {
                    res.status(500).json({ errors: { global: 'Something went wrong' }});
                } else {
                    res.status(200).json({ tasks });
                }
            })
        }
        if(selection === 'descending') {
            db.collection('tasks').find({}).sort('createdDate', -1).toArray((err, tasks) => {
                if(err) {
                    res.status(500).json({ errors: { global: 'Something went wrong' }});
                } else {
                    res.status(200).json({ tasks });
                }
            });
        }
        if(selection === 'active') {
            db.collection('tasks').find({ TaskDone: false }).toArray((err, tasks) => {
                if(err) {
                    res.status(500).json({ errors: { global: 'Something went wrong' }});
                } else {
                    res.status(200).json({ tasks });
                }
            });
        }
        if(selection === 'completed') {
            db.collection('tasks').find({ TaskDone: true }).toArray((err, tasks) => {
                if(err) {
                    res.status(500).json({ errors: { global: 'Something went wrong' }});
                } else {
                    res.status(200).json({ tasks });
                }
            });
        }

        // switch(selection) {
        //     case 'aescending':
        //         db.collection('tasks').find({}).sort('createdDate', 1).toArray((err, tasks) => {
        //             if(err) {
        //                 return res.status(500).json({ errors: { global: 'Something went wrong' }});
        //             } else {
        //                 return res.status(200).json({ tasks });
        //             }
        //         });
            
        //     case 'descending':
        //         db.collection('tasks').find({}).sort('createdDate', -1).toArray((err, tasks) => {
        //             if(err) {
        //                 return res.status(500).json({ errors: { global: 'Something went wrong' }});
        //             } else {
        //                 return res.status(200).json({ tasks });
        //             }
        //         });

        //     case 'active':
        //         db.collection('tasks').find({ TaskDone: false }).toArray((err, tasks) => {
        //             if(err) {
        //                 return res.status(500).json({ errors: { global: 'Something went wrong' }});
        //             } else {
        //                 return res.status(200).json({ tasks });
        //             }
        //         });

        //     case 'completed':
        //         db.collection('tasks').find({ TaskDone: true }).toArray((err, tasks) => {
        //             if(err) {
        //                 return res.status(500).json({ errors: { global: 'Something went wrong' }});
        //             } else {
        //                 return res.status(200).json({ tasks });
        //             }
        //         });

        //     default:
        //         return null;
        // }
    })

    ////////////////////////////////////////////////////////////////

    app.post('/api/todoTasks', (req, res) => {

        const { errors, isValid } = validate(req.body);

        if(isValid) {
            const { title, note } = req.body;

            db.collection('tasks').insertOne({ 
                title, 
                note,
                TaskDone: false,
                createdDate: new Date(Date.now()).toLocaleString()
            }, 
                (err, result) => {
                    if(err) {
                        res.status(500).json({ errors: { global: 'Something went wrong' }});
                    } else {
                        // console.log("result.ops[0]: ", result.ops[0])
                        res.status(200).json({ task: result.ops[0] });
                    }
            })

        } else {
            console.log("errors: ", errors )
            return res.status(400).json({ errors })
        }
    });

    app.get('/api/todoTasks/:_id', (req, res) => {

        db.collection('tasks').findOne({ _id: new mongoose.Types.ObjectId(req.params._id)}, (err, task) => {
            res.json({ task });
        })
    });


    app.put('/api/saveTodoTask/:id', (req, res) => {

        const { title, note, TaskDone } = req.body;

        db.collection('tasks').findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.body._id) },
            // What infor needs to update
            { $set: { title, note, TaskDone } },
            { returnOriginal: false }, // This is important
            ( err, result ) => {
                if(err) {
                    return res.status(500).json({ error: { global: err } });
                }

                res.json({
                    task: result.value
                })
            }
        )
    })
    

    app.put('/api/todoTasks/:id', (req, res) => {
        const { errors, isValid } = validate(req.body);

        if(isValid) {
            const { title, note } = req.body;

            db.collection('tasks').findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(req.body._id) },
                // What infor needs to update
                { $set: { title, note } 
                },
                { returnOriginal: false }, // This is important
                ( err, result ) => {
                    if(err) {
                        return res.status(500).json({ error: { global: err } });
                    }

                    res.json({
                        task: result.value
                    })
                }
            )
            
        } else {
            res.status(400).json({ errors });
        }
    });

    app.delete('/api/todoTasks/:_id', (req, res, next) => {
        // console.log("req.params._id: ", req.params._id)

        // db.deleteOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, (err, user) => {
        //     if(err) {
        //         return res.status(500).json({ error: { global: err } });
        //     }

        //     res.json({ _id: req.params._id })
        // })

        db.collection('tasks').deleteOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, (err, r) => {
            if(err) {
                return res.status(500).json({ error: { global: err } });
            }

            res.json({ _id: req.params._id })
        })

    });

    // app.use((req, res) => {
    //     res.status(404).json({
    //         errors: {
    //             global: 'Still working on it... Please try again later when we implement it'
    //         }
    //     })
    // })
}