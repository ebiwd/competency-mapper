import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { apiUrl } from '../services/http/http';
//import { Draggable, Droppable } from 'react-drag-and-drop';
import List from './List';

const UserView = () => {
  const [user, setUser] = useState();
  const [test, setTest] = useState();
  const [frameworks, setFrameworks] = useState();
  const [frm, setFrm] = useState();

  let colors = [
    { id: '101', position: '10', title: 'First' },
    { id: '102', position: '11', title: 'Second' },
    { id: '103', position: '21', title: 'Third' },
    { id: '104', position: '32', title: 'Fourth' }
  ];

  let uid = localStorage.getItem('userid');
  //let dt = '';
  //let year = '';
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${apiUrl}/user/${uid}?_format=json`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': localStorage.getItem('csrf_token')
        }
      })
        .then(Response => Response.json())
        .then(findResponse => setUser(findResponse));

      await fetch(`${apiUrl}/api/version_manager/?_format=json`)
        .then(Response => Response.json())
        .then(findResponse => setFrameworks(findResponse));
    };
    fetchData();
  }, [test]);

  if (!frm && user && frameworks) {
    let test = [];
    frameworks.map(item => {
      user.field_frameworks.map(frm => {
        if (frm.target_id == item.nid) test.push(item.title);
      });
    });
    setFrm(test.join());
  }

  const onDrop = data => {
    console.log(data);
    // => banana
  };

  return (
    <div>
      <h2>My profile</h2>
      <div className="row">
        <div className="column medium-3">&nbsp;</div>
        <div className="column medium-6">
          {user ? (
            <table className="responsive-table userprofile-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Username:</strong>
                  </td>
                  <td>{user.name[0].value}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Email:</strong>
                  </td>
                  <td>{user.mail[0].value}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Frameworks:</strong>
                  </td>
                  <td>{frm ? frm : ''}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            'Loading profile'
          )}
        </div>
        <div className="column medium-3" />
      </div>
    </div>
  );
};

export const path = () => (
  <Switch>
    <Route exact path="/user/view" component={UserView} />
  </Switch>
);

export default path;
