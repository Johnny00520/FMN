const keys = require('../config/keys');

module.exports = (
        firstname, 
        lastname, 
        contributorSelection, 
        websiteAddress, 
        facebook,
        email, 
        notes, 
        otherLink1, 
        otherLink2, 
        otherLink3,
        pleage1,
        pleage1Percent,
        pleage2,
        pleage2Percent,
        phoneNum
    ) => {
    return `
        <html>
            <body>
                <h3>Contact Detail</h3>
                <ul>
                    <li>Name: ${firstname + ' ' + lastname}</li>
                    <li>Email: ${email}</li>
                    <li>Phone number: ${phoneNum}</li>
                </ul>
                <h4>Note: </h4>
                <h3>${notes}</h3>
                <div>
                    <h3>Requested to be: ${contributorSelection}</h3>
                    <h4>My personal website: ${websiteAddress ? websiteAddress : 'N/A'}</h4>
                    <h4>My facebook website: ${facebook ? facebook : 'N/A'}</h4>
                    <h3>My other links:</h4>
                        <ul>
                            <li>Link 1: ${otherLink1 ? otherLink1 : 'N/A'}</li>
                            <li>Link 2: ${otherLink2 ? otherLink2 : 'N/A'}</li>
                            <li>Link 3: ${otherLink3 ? otherLink3 : 'N/A'}</li>
                        </ul>
                    <h3>My pleages:</h3>
                        <ul>
                            <li>Pleage 1: ${pleage1 ? pleage1 : 'N/A' } : ${pleage1Percent === null ? 'N/A' : `${pleage1Percent} %`} </li>
                            <li>Pleage 2: ${pleage2 ? pleage2 : 'N/A' } : ${pleage2Percent === null ? 'N/A' : `${pleage2Percent} %`} </li>
                        </ul>
                    <h2>Do you approve this user??</h2>
                    <div>
                        <a href="${keys.redirectDomain}/user/Login">Yes</a>
                    </div>
                    <div>
                        
                    </div>
                </div>
            </body>
        </html>
    `
};
{/* <a href="${keys.redirectDomain}/api/signup/thanks">No</a> */}