import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import CKEditor from 'react-ckeditor-component';
import { apiUrl } from '../services/http/http';
import { editApiUrl } from '../services/http/http';

class ResourceCreate extends React.Component {
  constructor(props) {
    super(props);
    //this.onChange = this.onChange.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
    this.changeTargetAudience = this.changeTargetAudience.bind(this);
    this.changeLearningOutcomes = this.changeLearningOutcomes.bind(this);
    this.changeOrganisers = this.changeOrganisers.bind(this);
    this.changeTrainers = this.changeTrainers.bind(this);

    this.state = {
      data: [],
      csrf: '',
      updateFlag: false,
      content: 'content',
      description: '',
      target_audience: '',
      learning_outcomes: '',
      organisers: '',
      trainers: ''
    };
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.updateFlag) {
      setTimeout(() => {
        this.props.history.push('/all-training-resources');
        //this.setState({'updateFlag': false});
      }, 1000);

      console.log('componentDidUpdate');
    }
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

  componentDidMount() {
    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });
  }

  dateValidate(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    if (date1 > date2) {
      return false;
    }

    return true;
  }

  handleSubmit(event) {
    event.preventDefault();
    let title = this.refs.title.value;
    let dates = this.refs.dates.value;
    let dates2 = this.refs.dates2.value;
    let type = 'Online';
    if (this.refs.type.value) {
      type = this.refs.type.value;
    }

    let description = this.state.description;
    let location = this.refs.location.value;
    let url = this.refs.url.value;
    let target_audience = this.state.target_audience;
    let learning_outcomes = this.state.learning_outcomes;
    let keywords = this.refs.keywords.value;
    let organisers = this.state.organisers;
    let trainers = this.state.trainers;

    let token = localStorage.getItem('csrf_token');

    //alert(learning_outcomes);
    if (this.dateValidate(dates, dates2)) {
      fetch(`${apiUrl}/node?_format=hal_json`, {
        credentials: 'include',
        method: 'POST',
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
      })
        .then(response => response.json())
        .then(data =>
          this.props.history.push(`/training-resources/${data.nid[0].value}`)
        );
    } else {
      alert('Incorrect dates');
    }

    //event.target.reset();
    //this.setState({ updateFlag: true });
  }

  render() {
    this.checkUser();
    return (
      <div>
        <p>
          <nav>
            <Link to={`/`}>Home</Link> /{' '}
            <Link to={`/all-training-resources`}>All training resources</Link> /
            Create resource{' '}
          </nav>
        </p>
        <h2>Create Training Resource</h2>
        <p>(* fields are mandatory)</p>

        <div className="row">
          <div className="column large-12 callout">
            <form
              className="vf-form"
              id={'resource_create_form'}
              onSubmit={this.handleSubmit.bind(this)}
            >
              <div className="vf-form__item">
                <strong>Title *</strong>
                <input
                  className="vf-form__input"
                  type="text"
                  ref="title"
                  required
                  placeholder="Title"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-grid">
                <div className="vf-form__item">
                  <strong>Start Date</strong>
                  <input
                    type="date"
                    className="vf-form__input"
                    ref="dates"
                    placeholder="Date"
                  />
                </div>
                <div className="vf-form__item">
                  <strong>End Date</strong>
                  <input
                    type="date"
                    className="vf-form__input"
                    ref="dates2"
                    placeholder="Date"
                  />
                </div>
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Event type *</strong>
                <select className="vf-form__select" ref={'type'}>
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
                    change: this.changeDescription
                  }}
                  activeClass="p10"
                  required
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Location</strong>
                <input
                  type="text"
                  className="vf-form__input"
                  ref="location"
                  placeholder="Location"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>URL *</strong>
                <input
                  type="url"
                  className="vf-form__input"
                  ref="url"
                  required
                  placeholder="URL"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Target audience</strong>
                <CKEditor
                  content={this.state.target_audience}
                  events={{
                    change: this.changeTargetAudience
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
                    change: this.changeLearningOutcomes
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
                    change: this.changeOrganisers
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
                    change: this.changeTrainers
                  }}
                  activeClass="p10"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Keywords</strong>
                <input
                  type="text"
                  className="vf-form__input"
                  ref="keywords"
                  placeholder="Keywords"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <input
                  type="submit"
                  className="vf-button vf-button--primary"
                  value="Submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const CreateResources = () => (
  <Switch>
    <Route exact path="/training-resource/create" component={ResourceCreate} />
  </Switch>
);

export default CreateResources;
