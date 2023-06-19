import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { apiUrl } from '../services/http/http';
import ActiveRequestsService from '../services/active-requests/active-requests';
import CompetencyService from '../services/competency/competency';

//const $ = window.$;

class AttributeDemap extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();

  constructor(props) {
    super(props);
    this.state = {
      resourceID: this.props.location.pathname.split('/')[2],
      attributeID: this.props.location.pathname.split('/')[4],
      resourceDetails: [],
      csrf: ''
    };
    this.demap = this.demap.bind(this);
  }

  async demap(e) {
    //alert("mapping removed");
    // let resource = 1034;
    // let items = [20, 21];
    //this.activeRequests.startRequest();
    // let result = await this.competencyService.demap(resource, items);
    //this.activeRequests.finishRequest();
    //this.props.history.push("/training-resources/"+this.props.location.pathname.split('/')[2]);
    //e.preventDefault();
  }

  componentDidMount() {
    //fetch(`${apiUrl}`+'/api/resources/?_format=hal_json&id='+ this.state.resourceID)
    fetch(`${apiUrl}/node/ ${this.state.resourceID}?_format=hal_json`)
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          resourceDetails: findresponse
        });
      });

    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.state.attributes === nextState.attributes;
  // }

  render() {
    return (
      <div>
        <h3>
          Are you sure you want to remove this mapping? This action cannot be
          undone!
        </h3>
        <button className="button" onClick={this.demap.bind(this)}>
          Yes
        </button>
      </div>
    );
  }
}

const AttributeDemapRoot = () => (
  <Switch>
    <Route
      exact
      path="/training-resources/:resource/demap/:attribute"
      component={AttributeDemap}
    />
  </Switch>
);

export default AttributeDemapRoot;
