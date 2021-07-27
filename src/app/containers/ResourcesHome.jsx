import React from 'react';
import { Switch, Route } from 'react-router-dom';
//import Parser from 'html-react-parser';
import { Link } from 'react-router-dom';

//import { apiUrl } from '../services/http/http';

class ResourcesHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      filterType: ''
    };
    //this.archiveHandle = this.archiveHandle.bind(this);
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
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.updateFlag) {
  //     this.fetchData();
  //     setTimeout(() => {
  //       this.setState({ updateFlag: false });
  //     }, 1000);
  //     console.log('componentDidUpdate');
  //   }
  // }

  // componentDidMount() {
  //   this.fetchData();
  // }

  // fetchData() {
  //   let csrfURL = `${apiUrl}/rest/session/token`;
  //   fetch(csrfURL)
  //     .then(Response => Response)
  //     .then(findresponse2 => {
  //       this.setState({ csrf: findresponse2 });
  //     });

  //   //let resourcesURL = `${apiUrl}/api/v1/training-resources/all?_format=json`;
  //   let resourcesURL = `${apiUrl}/api/resources?_format=json&timestamp=${Date.now()}`;
  //   fetch(resourcesURL)
  //     .then(Response => Response.json())
  //     .then(findresponse => {
  //       this.setState({
  //         resources: findresponse
  //       });
  //     });
  // }

  // filter(e) {
  //   this.setState({ filter: e.target.value });
  // }

  // filterTypeHandle(e) {
  //   this.setState({ filterType: e.target.value });
  // }

  // archiveHandle(rid, status, event) {
  //   //alert("competency "+ cid+ "is "+ status);
  //   let archivedStatus = '';
  //   if (status === 1) {
  //     archivedStatus = false;
  //   } else {
  //     archivedStatus = true;
  //   }
  //   let token = localStorage.getItem('csrf_token');
  //   fetch(`${apiUrl}/node/` + rid + '?_format=hal_json', {
  //     credentials: 'include',
  //     method: 'PATCH',
  //     cookies: 'x-access-token',
  //     headers: {
  //       Accept: 'application/hal+json',
  //       'Content-Type': 'application/hal+json',
  //       'X-CSRF-Token': token,
  //       Authorization: 'Basic'
  //     },
  //     body: JSON.stringify({
  //       _links: {
  //         type: {
  //           href: `${apiUrl}/rest/type/node/training_resource`
  //         }
  //       },
  //       field_archived: [
  //         {
  //           value: archivedStatus
  //         }
  //       ],
  //       type: [
  //         {
  //           target_id: 'training_resource'
  //         }
  //       ]
  //     })
  //   });

  //   this.setState({ updateFlag: true });

  //   event.preventDefault();
  // }

  render() {
    this.checkUser();
    // let resources = this.state.resources;
    // if (this.state.filter) {
    //   resources = resources.filter(
    //     item =>
    //       item.title.toLowerCase().includes(this.state.filter.toLowerCase()) ||
    //       item.description
    //         .toLocaleLowerCase()
    //         .includes(this.state.filter.toLowerCase())
    //   );
    // }

    // if (this.state.filterType !== 'All') {
    //   resources = resources.filter(item =>
    //     item.type
    //       .toLocaleLowerCase()
    //       .includes(this.state.filterType.toLowerCase())
    //   );
    // }

    // const ListOfResources = resources.map((item, index) => (
    //   <tr key={index}>
    //     <td>{index + 1} </td>
    //     <td>
    //       {' '}
    //       <h4>
    //         {' '}
    //         <Link to={'/training-resources/' + item.id}>{item.title} </Link>
    //       </h4>
    //       <p>{item.dates} </p>
    //       <strong>Learning resource type:</strong> {item.type} <br />
    //       {Parser(item.description.substr(0, 240) + '...')} <br />
    //       <br />
    //       <strong> URL: </strong>{' '}
    //       <a href={item.url} target={'_blank'}>
    //         {item.url}
    //       </a>
    //     </td>
    //     <td>
    //       {item.archived === '1' ? (
    //         <a // eslint-disable-line jsx-a11y/anchor-is-valid
    //           onClick={this.archiveHandle.bind(this, item.id, 1)}
    //         >
    //           {' '}
    //           <i className="fas fa-toggle-on" /> <span>Archived</span>{' '}
    //         </a>
    //       ) : (
    //         <a // eslint-disable-line jsx-a11y/anchor-is-valid
    //           onClick={this.archiveHandle.bind(this, item.id, 0)}
    //         >
    //           {' '}
    //           <i className="fas fa-toggle-off" />
    //         </a>
    //       )}
    //     </td>
    //     <td>
    //       <Link to={`/training-resource/edit/${item.id}`}>
    //         <i className="fas fa-edit" />{' '}
    //       </Link>
    //     </td>
    //   </tr>
    // ));
    return (
      <div className={'row'}>
        <h3>Training Resources</h3>
        <div className="row">
          <div className="column large-4 callout">
            <Link
              className={'button float-right'}
              to={'/all-training-resources'}
            >
              <i className="fas fa-list"> </i> View published training resources{' '}
            </Link>
          </div>
          <div className="column large-4 callout">
            <Link className={'button float-right'} to={'#'}>
              <i className="fas fa-list"> </i> View unpublished training
              resources{' '}
            </Link>
          </div>
          <div className={'column large-4 callout'}>
            <Link className={'button float-right'} to={'#'}>
              <i className="fas fa-tasks"> </i> Manage training resources{' '}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const ResourcesHomepage = () => (
  <Switch>
    <Route exact path="/training-resources-home" component={ResourcesHome} />
  </Switch>
);

export default ResourcesHomepage;
