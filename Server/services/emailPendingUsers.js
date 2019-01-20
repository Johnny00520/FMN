const keys = require('../config/keys');

module.exports = (
    pendingUsers
) => {
    return `
        <html>
            <body>
                <h3>This week pending users</h3>
                <ul>
                    <li>Name: ${pendingUsers.map(pendingUser => pendingUser.firstname + ' ' + pendingUser.lastname + ' ,')}</li>
                </ul>
                <ul>
                    <li>Email: ${pendingUsers.map(pendingUser => pendingUser.email + ' ,')} </li>
                </ul>

                <h2>Do you want to login and add users??</h2>
                <div>
                    <a href="${keys.redirectDomain}/user/Login">Yes</a>
                </div>

            </body>
        </html>
    `
}