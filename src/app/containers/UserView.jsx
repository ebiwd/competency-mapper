import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { apiUrl } from '../services/http/http';

const UserView = () => {
  const [user, setUser] = useState();
  //const [test, setTest] = useState();
  const [frameworks, setFrameworks] = useState();
  const [frm, setFrm] = useState();

  let uid = localStorage.getItem('userid');
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
  }, [uid]);

  if (!frm && user && frameworks) {
    let test = [];
    frameworks.map(item => {
      user.field_frameworks.map(framework => {
        if (framework.target_id === item.nid) {
          test.push(item.title);
        }
        return null;
      });
      return null;
    });
    if (test.length > 0) {
      setFrm(test.join());
    }
  }

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
                  <td>{frm ? frm : 'NA'}</td>
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
