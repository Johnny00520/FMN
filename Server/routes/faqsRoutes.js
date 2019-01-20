const mongoose = require('mongoose');

function validation(data) {
    let errors = {};
    if(data.question === '') errors.question = 'Cannot be empty';
    if(data.answer === '') errors.answer = 'Cannot be empty';
    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid };
}

module.exports = (app, db) => {

    app.get('/api/faqs', (req, res) => {
        db.collection('FAQs').find({}).toArray((err, faqs) => {
            res.json({ faqs })
        });
    });

    app.post('/api/faqs', (req, res) => {
        const { errors, isValid } = validation(req.body);

        if(isValid) {
            const { question, answer } = req.body;
            db.collection('FAQs').insertOne({ question, answer }, (err, result) => {
                if(err) {
                    res.status(500).json({ errors: { global: "Something went wrong" }});
                } else {
                    res.json({ faq: result.ops[0] })
                }
            })

        } else {
            res.status(400).json({ errors })
        }
    });

    app.put('/api/faqs/:_id', (req, res) => {
        const { errors, isValid } = validation(req.body);

        if(isValid) {
            const { question, answer } = req.body;
            db.collection('FAQs').findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(req.params._id) },
                // What infor needs to update
                { $set: { 
                    question,
                    answer
                    } 
                },
                { returnOriginal: false }, // This is important
                ( err, result ) => {
                    if(err) {
                        return res.status(500).json({ error: { global: err } });
                    }
                    res.json({
                        faq: result.value
                    })
                }
            )
        } else {
            res.status(400).json({ errors });
        }
    });

    app.delete('/api/faqs/:_id', (req, res) => {
        db.collection('FAQs').deleteOne({ _id: new mongoose.Types.ObjectId(req.params._id) }, (err, result) => {
            if(err) {
                return res.status(500).json({ error: { global: err } });
            }

            res.json({ message: result })
        })
    });

    app.get('/api/faqs/:_id', (req, res) => {
        db.collection('FAQs').findOne({ _id: new mongoose.Types.ObjectId(req.params._id)}, (err, faq) => {
            res.json({ faq });
        })
    });
}