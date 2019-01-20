// Figure out which set of credential to return


/* This is for localhost */
// if(process.env.NODE_ENV === 'development') {
//     // In production, return production set keys
//     module.exports = require('./dev');
// } else {
//     // In development, return development set keys
//     module.exports = require('./prod');
// }

/* This is for the deplyment */
if(process.env.NODE_ENV === 'production') {
    // In production, return production set keys
    module.exports = require('./prod');
} else {
    // In development, return development set keys
    module.exports = require('./dev');
}