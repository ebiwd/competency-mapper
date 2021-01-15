import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Parser from 'html-react-parser';
import { Link } from 'react-router-dom';

import { apiUrl } from '../services/http/http';

class ResourcesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      filterType: '',
      filterMapping: '',
      userid: ''
    };
    this.archiveHandle = this.archiveHandle.bind(this);
  }

  checkUser() {
    if (!localStorage.getItem('roles')) {
      this.props.history.push('/');
    } else if (!localStorage.getItem('roles').includes('content_manager')) {
      alert(
        'You are not authorised to access this page. Contact the administrator'
      );
      this.props.history.push('/');
    }
    console.log(localStorage.getItem('roles'));
    //console.log(localStorage.getItem('userid'));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.updateFlag) {
      this.fetchData();
      setTimeout(() => {
        this.setState({ updateFlag: false });
      }, 1000);
      console.log('componentDidUpdate');
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });

    //let resourcesURL = `${apiUrl}/api/v1/training-resources/all?_format=json`;
    let resourcesURL = `${apiUrl}/api/resources?_format=json&timestamp=${Date.now()}`;
    fetch(resourcesURL)
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          resources: findresponse
        });
      });
  }

  checkAuthor(author_id) {
    let userid = localStorage.getItem('userid');
    if (userid == author_id) {
      return true;
    } else {
      return false;
    }
    //console.log(localStorage.getItem('userid'));
  }

  filter(e) {
    this.setState({ filter: e.target.value });
  }

  filterTypeHandle(e) {
    this.setState({ filterType: e.target.value });
  }

  filterMappingHandle(e) {
    if (this.state.filterMapping) {
      this.setState({ filterMapping: 0 });
    } else {
      this.setState({ filterMapping: 1 });
    }
  }

  archiveHandle(rid, status, event) {
    //alert("competency "+ cid+ "is "+ status);
    let archivedStatus = '';
    if (status === 1) {
      archivedStatus = false;
    } else {
      archivedStatus = true;
    }
    let token = localStorage.getItem('csrf_token');
    fetch(`${apiUrl}/node/` + rid + '?_format=hal_json', {
      credentials: 'include',
      method: 'PATCH',
      cookies: 'x-access-token',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/hal+json',
        'X-CSRF-Token': token,
        Authorization: 'Basic'
      },
      body: JSON.stringify({
        _links: {
          type: {
            href: `${apiUrl}/rest/type/node/training_resource`
          }
        },
        field_archived: [
          {
            value: archivedStatus
          }
        ],
        type: [
          {
            target_id: 'training_resource'
          }
        ]
      })
    });

    this.setState({ updateFlag: true });

    event.preventDefault();
  }

  render() {
    this.checkUser();
    let resources = this.state.resources;
    if (this.state.filter) {
      resources = resources.filter(
        item =>
          item.title.toLowerCase().includes(this.state.filter.toLowerCase()) ||
          item.description
            .toLocaleLowerCase()
            .includes(this.state.filter.toLowerCase())
      );
    }

    if (this.state.filterType !== 'All') {
      resources = resources.filter(item =>
        item.type
          .toLocaleLowerCase()
          .includes(this.state.filterType.toLowerCase())
      );
    }

    if (this.state.filterMapping) {
      resources = resources.filter(item =>
        item.competency_profile.some(
          profile =>
            profile.attribute_archived == 'archived' ||
            profile.competency_archived == 'archived' ||
            profile.domain == 'archived'
        )
      );
      console.log('filter applied');
    }

    const ListOfResources = resources.map((item, index) => (
      <tr key={index}>
        <td>{index + 1} </td>
        <td>
          {' '}
          <Link to={'/training-resources/' + item.id}>{item.title} </Link>
        </td>
        <td>{item.dates}</td>
        <td>{item.type}</td>
        <td>
          <a href={item.url} target={'_blank'}>
            {item.url}
          </a>
        </td>
        <td>
          {item.archived === '1' ? (
            <a // eslint-disable-line jsx-a11y/anchor-is-valid
              onClick={this.archiveHandle.bind(this, item.id, 1)}
            >
              {' '}
              <i className="fas fa-toggle-on" /> <span>Archived</span>{' '}
            </a>
          ) : (
            <a // eslint-disable-line jsx-a11y/anchor-is-valid
              onClick={this.archiveHandle.bind(this, item.id, 0)}
            >
              {' '}
              <i className="fas fa-toggle-off" />
            </a>
          )}
        </td>
        <td>
          {this.checkAuthor(item.author) ? (
            <Link to={`/training-resource/edit/${item.id}`}>
              <i className="fas fa-edit" />{' '}
            </Link>
          ) : (
            ''
          )}
        </td>
      </tr>
    ));
    return (
      <div className={'row'}>
        <h3>Training Resources</h3>
        <div className="row">
          <div className="column large-6">
            <div>
              <input
                type="text"
                onChange={this.filter.bind(this)}
                placeholder="Type to search"
              />
            </div>
          </div>
          <div className="column large-2">
            <div>
              <select ref={'type'} onChange={this.filterTypeHandle.bind(this)}>
                <option value={'All'}>All</option>
                <option value={'Online'}>Online</option>
                <option value={'Face-to-Face'}>Face-to-Face</option>
                <option value={'Webinar'}>Webinar</option>
                <option value={'Hackathon'}>Hackathon</option>
              </select>
            </div>
          </div>
          <div className="column large-3">
            <input
              type="checkbox"
              id="checkboxMapping"
              checked={this.state.filterMapping}
              onChange={this.filterMappingHandle.bind(this)}
            />
            <span id="checkboxMappingLabel" for="checkboxMapping">
              Items with deprecated mapping
            </span>
          </div>
          <div className={'column large-1'}>
            <Link
              className={'button float-right'}
              to={'/training-resource/create'}
            >
              <i className="fas fa-plus-circle"> </i> Add new{' '}
            </Link>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Title</th>
              <th>Date(s)</th>
              <th>Type</th>
              <th>URL</th>
              <th>Archive</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{ListOfResources}</tbody>
        </table>
      </div>
    );
  }
}

const Resources = () => (
  <Switch>
    <Route exact path="/all-training-resources" component={ResourcesList} />
  </Switch>
);

export default Resources;
