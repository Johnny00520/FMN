import React from 'react';
import { Link } from 'react-router-dom';

export default function UsersListTable({ user, deleteUser }) {
    // debugger
    // {user.data ? }
    return ( 
        <tr>
            <td>{user.firstname}</td>
            <td>{user.lastname}</td>
            <td>{user.email}</td>
            <td>{user.contributor}</td>
            <td>{user.createdDate}</td>
            <td>{user.websiteAddress ? user.websiteAddress : 'N/A'}</td>

            <td>{user.otherLink1 ? user.otherLink1 : 'N/A'}<br/>
                {user.otherLink2 ? user.otherLink2 : 'N/A'}<br/>
                {user.otherLink3 ? user.otherLink3 : 'N/A'}</td>


            <td>{user.pleage1 ? user.pleage1 : 'N/A'}</td>
            <td>{user.pleage1Percent ? user.pleage1Percent + " %": 'N/A'}</td>
            <td>{user.pleage2 ? user.pleage2 : 'N/A'}</td>
            <td>{user.pleage2Percent ? user.pleage2Percent + " %": 'N/A'}</td>
            <td>
                <Link to={`/user/${user._id}`} className="ui basic button green">Edit</Link>
            </td>
            <td>
                <div className="ui basic button red" onClick={() => deleteUser(user._id)} >Delete</div>
            </td>
                
        </tr>
    );
}