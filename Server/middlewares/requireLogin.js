const jwt = require('jsonwebtoken');

/* This middle can apply any routes */
/* i.e  app.post('/api/signup', requireLogin, async (req, res) => { } */
/* Remember to require as requireLogin on top  */

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
        req.userData = decoded;
        
        next(); // This means when user logs in for sure, then apply

    } catch (error) {
        return res.status(401).send({ error: 'You must log in!'});
    }

    // if(!req.user) {
    //     return res.status(401).send({ error: 'You must log in!'});
    // }

};