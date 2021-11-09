import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import CKEditor from 'react-ckeditor-component';
import { apiUrl } from '../services/http/http';
import { editApiUrl } from '../services/http/http';
import ActiveRequestsService from '../services/active-requests/active-requests';
import CompetencyService from '../services/competency/competency';

class ResourceEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      csrf: '',
      updateFlag: false,
      path: this.props.location.pathname.split('/'),
      nid: '',
      title: '',
      dates: '',
      dates2: '',
      type: '',
      description: '',
      location: '',
      url: '',
      target_audience: '',
      learning_outcomes: '',
      keywords: '',
      organisers: '',
      trainers: ''
    };
    this.redirectTo = this.redirectTo.bind(this);
  }

  changeDescription(evt) {
    let newContent = evt.editor.getData();
    this.setState({ description: newContent });
  }

  changeTargetAudience(evt) {
    let newContent = evt.editor.getData();
    this.setState({ target_audience: newContent });
  }

  changeLearningOutcomes(evt) {
    let newContent = evt.editor.getData();
    this.setState({ learning_outcomes: newContent });
  }

  changeOrganisers(evt) {
    let newContent = evt.editor.getData();
    this.setState({ organisers: newContent });
  }

  changeTrainers(evt) {
    let newContent = evt.editor.getData();
    this.setState({ trainers: newContent });
  }

  componentDidMount() {
    this.setState({ nid: this.state.path[3] });

    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });

    let fetchResource = `${apiUrl}/node/${this.state.path[3]}?_format=json`;
    //let fetchResource = `${apiUrl}/api/v1/training-resources/all?_format=json`;
    //let fetchResource = `${apiUrl}/api/resources?_format=json&timestamp=${Date.now()}`;
    fetch(fetchResource)
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          data: findresponse
        });
      });
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
    //console.log(localStorage.getItem('roles'));
  }

  redirectTo() {
    //alert(this.state.nid)
    this.props.history.push('/training-resources/' + this.state.nid);
  }

  render() {
    this.checkUser();
    let nid = '';
    let title = '';
    let dates = '';
    let dates2 = '';
    let type = '';
    let description = '';
    let location = '';
    let url = '';
    let target_audience = '';
    let learning_outcomes = '';
    let keywords = '';
    let organisers = '';
    let trainers = '';

    //this.state.data.forEach(item => {
    //  if (item.id === this.state.nid) {
    if (this.state.data.nid) {
      let item = this.state.data;
      nid = item.nid[0].value;
      title = item.title[0].value;
      dates = item.field_dates[0] ? item.field_dates[0].value : null;
      dates2 = item.field_end_date[0] ? item.field_end_date[0].value : null;
      type = item.field_type[0].value;
      description = item.field_description[0]
        ? item.field_description[0].value
        : null;
      location = item.field_location[0] ? item.field_location[0].value : null;
      url = item.field_url[0] ? item.field_url[0].value : null;
      target_audience = item.field_target_audience[0]
        ? item.field_target_audience[0].value
        : null;
      learning_outcomes = item.field_learning_outcomes[0]
        ? item.field_learning_outcomes[0].value
        : null;
      keywords = item.field_domain_topics[0]
        ? item.field_domain_topics[0].value
        : null;
      organisers = item.field_organisers[0]
        ? item.field_organisers[0].value
        : null;
      trainers = item.field_trainers[0] ? item.field_trainers[0].value : null;
      //console.log(item.nid[0].value)
    }

    //  }
    //});
    if (this.state.data.nid) {
      console.log(dates);
      return (
        <EditForm
          nid={nid}
          title={title}
          dates={dates}
          dates2={dates2}
          type={type}
          description={description}
          location={location}
          url={url}
          target_audience={target_audience}
          learning_outcomes={learning_outcomes}
          keywords={keywords}
          organisers={organisers}
          trainers={trainers}
          redirectTo={this.redirectTo}
        />
      );
    } else {
      return null;
    }
  }
}

class EditForm extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();
  constructor(props) {
    super(props);
    this.state = {
      nid: this.props.nid,
      title: this.props.title,
      dates: this.props.dates,
      dates2: this.props.dates2,
      type: this.props.type,
      description: this.props.description,
      location: this.props.location,
      url: this.props.url,
      target_audience: this.props.target_audience,
      learning_outcomes: this.props.learning_outcomes,
      keywords: this.props.keywords,
      organisers: this.props.organisers,
      trainers: this.props.trainers,
      redirect: false,
      updateFlag: false,
      csrf: ''
    };
    this.handleTitle = this.handleTitle.bind(this);
    this.handleDates = this.handleDates.bind(this);
    this.handleDates2 = this.handleDates2.bind(this);
    this.handleType = this.handleType.bind(this);
    this.handleDesc = this.handleDesc.bind(this);
    this.handleLocation = this.handleLocation.bind(this);
    this.handleURL = this.handleURL.bind(this);
    this.handleTargetAudience = this.handleTargetAudience.bind(this);
    this.handleLearningOutcomes = this.handleLearningOutcomes.bind(this);
    this.handleKeywords = this.handleKeywords.bind(this);
    this.handleOrganisers = this.handleOrganisers.bind(this);
    this.handleTrainers = this.handleTrainers.bind(this);
    //this.redirectTo = this.redirectTo.bind(this);
  }

  componentDidMount() {
    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });
  }

  static contextTypes = {
    router: PropTypes.object
  };

  handleTitle(event) {
    this.setState({ title: event.value });
  }

  handleDates(event) {
    this.setState({ dates: event.value });
  }

  handleDates2(event) {
    this.setState({ dates2: event.value });
  }

  handleType(event) {
    this.setState({ type: event.value });
  }

  handleDesc(event) {
    this.setState({ description: event.editor.getData() });
    //this.setState({ description: "test" });
    //console.log(this.setState({ description: event.editor.getData() }));
  }
  handleLocation(event) {
    this.setState({ location: event.value });
  }
  handleURL(event) {
    this.setState({ url: event.value });
  }

  handleTargetAudience(event) {
    this.setState({ target_audience: event.editor.getData() });
    //this.setState({ target_audience: "test" });
  }

  handleLearningOutcomes(event) {
    this.setState({ learning_outcomes: event.editor.getData() });
    //this.setState({ learning_outcomes: "hi" });
  }

  handleKeywords(event) {
    this.setState({ keywords: event.value });
  }

  handleOrganisers(event) {
    this.setState({ organisers: event.editor.getData() });
    //this.setState({ organisers: "test" });
  }

  handleTrainers(event) {
    this.setState({ trainers: event.editor.getData() });
    //this.setState({ trainers: "test" });
  }

  setRedirect = () => {
    this.props.history.push('all-training-resources');
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.updateFlag) {
      // setTimeout(() => {
      //  // this.props.redirectTo()
      // }, 1000);
      //await this.handleSubmit();
      //this.props.redirectTo();
    }
  }

  dateValidate(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    if (date1 > date2) {
      return false;
    }

    return true;
  }

  async handleSubmit(event) {
    event.preventDefault();
    let resourceID = this.state.nid;
    let title = this.refs.title.value;
    let dates = this.refs.dates.value;
    let dates2 = this.refs.dates2.value;

    let type = this.refs.type.value;
    let description = this.state.description;
    let location = this.refs.location.value;
    let url = this.refs.url.value;
    let target_audience = this.state.target_audience;
    let learning_outcomes = this.state.learning_outcomes;
    let organisers = this.state.organisers;
    let trainers = this.state.trainers;
    let keywords = this.refs.keywords.value;
    let csrf = localStorage.getItem('csrf_token');

    if (this.dateValidate(dates, dates2)) {
      await fetch(`${apiUrl}/node/` + resourceID + '?_format=hal_json', {
        method: 'PATCH',
        credentials: 'include',
        cookies: 'x-access-token',
        headers: {
          Accept: 'application/hal+json',
          'Content-Type': 'application/hal+json',
          'X-CSRF-Token': csrf
          //Authorization: 'Basic'
        },
        body: JSON.stringify({
          _links: {
            type: {
              href: `${editApiUrl}/rest/type/node/training_resource`
            }
          },
          title: [
            {
              value: title
            }
          ],
          field_dates: [
            {
              value: dates ? dates : null
            }
          ],
          field_end_date: [
            {
              value: dates2 ? dates2 : null
            }
          ],
          field_type: [
            {
              value: type
            }
          ],
          field_description: [
            {
              value: description,
              format: 'basic_html'
            }
          ],
          field_location: [
            {
              value: location
            }
          ],
          field_url: [
            {
              value: url
            }
          ],
          field_target_audience: [
            {
              value: target_audience,
              format: 'basic_html'
            }
          ],
          field_learning_outcomes: [
            {
              value: learning_outcomes,
              format: 'basic_html'
            }
          ],
          field_domain_topics: [
            {
              value: keywords
            }
          ],
          field_organisers: [
            {
              value: organisers,
              format: 'basic_html'
            }
          ],
          field_trainers: [
            {
              value: trainers,
              format: 'basic_html'
            }
          ],
          type: [
            {
              target_id: 'training_resource'
            }
          ]
        })
      });
      // setTimeout(() => {
      //   this.props.redirectTo();
      // }, 1000);
      this.props.redirectTo();
    } else {
      alert('Incorrect dates');
    }
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h2>Edit Training Resources</h2>
        <p>(* fields are mandatory)</p>
        <div className="row">
          <div className="column large-12 callout">
            <form
              className="vf-form"
              id={'resource_edit_form'}
              onSubmit={this.handleSubmit.bind(this)}
            >
              <div className="vf-form__item">
                <strong>Title *</strong>

                <input
                  type="text"
                  ref="title"
                  id={'title'}
                  value={this.state.title}
                  onChange={this.handleTitle.bind(this)}
                  required
                  placeholder="Title"
                  className="vf-form__input"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-grid">
                <div className="vf-form__item">
                  <strong>Dates</strong>
                  <input
                    type="date"
                    ref="dates"
                    value={this.state.dates}
                    onChange={this.handleDates.bind(this)}
                    placeholder="Date"
                    className="vf-form__input"
                  />
                </div>
                <div className="vf-form__item">
                  <strong>Dates</strong>
                  <input
                    type="date"
                    ref="dates2"
                    value={this.state.dates2}
                    onChange={this.handleDates2.bind(this)}
                    placeholder="Date"
                    className="vf-form__input"
                  />
                </div>
              </div>
              <div className="vf-u-margin__bottom--600" />

              <div className="vf-form__item">
                <strong>Event type *</strong>
                <select
                  ref={'type'}
                  value={this.state.type}
                  onChange={this.handleType.bind(this)}
                  className="vf-form__select"
                >
                  <option value={'Online'}>Online</option>
                  <option value={'Face-to-Face'}>Face-to-Face</option>
                  <option value={'Webinar'}>Webinar</option>
                  <option value={'Hackathon'}>Hackathon</option>
                </select>
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Description</strong>
                <CKEditor
                  content={this.state.description}
                  events={{
                    change: this.handleDesc
                  }}
                  onChange={this.handleDesc}
                  activeClass="p10"
                  required
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Location</strong>
                <input
                  type="text"
                  ref="location"
                  value={this.state.location}
                  onChange={this.handleLocation.bind(this)}
                  placeholder="Location"
                  className="vf-form__input"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>URL *</strong>
                <input
                  type="text"
                  ref="url"
                  value={this.state.url}
                  onChange={this.handleURL.bind(this)}
                  required
                  placeholder="URL"
                  className="vf-form__input"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Target audience</strong>
                <CKEditor
                  content={this.state.target_audience}
                  events={{
                    change: this.handleTargetAudience
                  }}
                  activeClass="p10"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Learning outcomes</strong>
                <CKEditor
                  content={this.state.learning_outcomes}
                  events={{
                    change: this.handleLearningOutcomes
                  }}
                  activeClass="p10"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Organisers</strong>
                <CKEditor
                  content={this.state.organisers}
                  events={{
                    change: this.handleOrganisers
                  }}
                  activeClass="p10"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Trainers</strong>
                <CKEditor
                  content={this.state.trainers}
                  events={{
                    change: this.handleTrainers
                  }}
                  activeClass="p10"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Keywords</strong>
                <input
                  type="text"
                  ref="keywords"
                  value={this.state.keywords}
                  onChange={this.handleKeywords.bind(this)}
                  placeholder="Keywords"
                  className="vf-form__input"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <input
                  type="submit"
                  className="vf-button vf-button--primary vf-button--sm"
                  value="Update"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const EditResources = () => (
  <Switch>
    <Route exact path="/training-resource/edit/:nid" component={ResourceEdit} />
  </Switch>
);

export default EditResources;
