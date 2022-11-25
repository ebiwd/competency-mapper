import React, { useEffect, useState } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { apiUrl } from '../../services/http/http';

const ManageFrameworks = props => {
  const [frameworks, setFrameworks] = useState();
  let user = localStorage.getItem('user');
  let token = localStorage.getItem('csrf_token');

  //API change needed here
  // API should not need to be sent the user id

  useEffect(() => {
    const fetchData = () => {
      fetch(`${apiUrl}/api/authorisation/${user}?_format=json`, {
        method: 'GET',
        credentials: 'include'
      })
        .then(Response => Response.json())
        .then(findresponse => {
          setFrameworks(findresponse);
        });
    };
    fetchData();
  }, [user, token]);

  return (
    <div className="vf-activity">
      <h2>Manage frameworks</h2>
      <ul className="vf-activity__list | vf-list">
        {frameworks ? (
          frameworks.map(framework => {
            return (
              <li className="vf-activity__item" key={framework}>
                <Link
                  to={`/framework/${framework
                    .toLowerCase()
                    .replace(/\s+/g, '')}/manage/data`}
                >
                  {framework}
                </Link>
              </li>
            );
          })
        ) : (
          <li style={{ color: '#000' }}>No Framework assigned to this user.</li>
        )}
      </ul>
    </div>
  );
};

const exportURL = () => (
  <Switch>
    <Route exact path="/manage-frameworks" component={ManageFrameworks} />
  </Switch>
);

export default exportURL;
