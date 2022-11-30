import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { apiUrl, apiUrlWithHTTP } from '../services/http/http';
import axios from 'axios';
import CKEditor from 'react-ckeditor-component';

class ResourceEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      training_resource: {},
      data: [],
      csrf: '',
      updateFlag: false,
      path: this.props.location.pathname.split('/'),
      training_resource_slug: ''
    };
  }

  dateValidate(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    return date1 <= date2;
  }

  handleSubmit(event) {
    event.preventDefault();
    let csrf = localStorage.getItem('csrf_token');

    if (
      this.dateValidate(
        this.state.training_resource.dates,
        this.state.training_resource.end_date
      )
    ) {
      let data_to_send = {
        _links: {
          type: {
            href: `${apiUrlWithHTTP}/rest/type/node/training_resource`
          }
        },
        title: [
          {
            value: this.state.training_resource.title
          }
        ],
        field_dates: [
          {
            value: this.state.training_resource.dates
              ? this.state.training_resource.dates
              : null
          }
        ],
        field_end_date: [
          {
            value: this.state.training_resource.end_date
              ? this.state.training_resource.end_date
              : null
          }
        ],
        field_type: [
          {
            value: this.state.training_resource.type
          }
        ],
        field_description: [
          {
            value: this.state.training_resource.description,
            format: 'basic_html'
          }
        ],
        field_location: [
          {
            value: this.state.training_resource.location
          }
        ],
        field_url: [
          {
            value: this.state.training_resource.url
          }
        ],
        field_target_audience: [
          {
            value: this.state.training_resource.target_audience,
            format: 'basic_html'
          }
        ],
        field_learning_outcomes: [
          {
            value: this.state.training_resource.learning_outcomes,
            format: 'basic_html'
          }
        ],
        field_domain_topics: [
          {
            value: this.state.training_resource.keywords
          }
        ],
        field_organisers: [
          {
            value: this.state.training_resource.organisers,
            format: 'basic_html'
          }
        ],
        field_trainers: [
          {
            value: this.state.training_resource.trainers,
            format: 'basic_html'
          }
        ],
        type: [
          {
            target_id: 'training_resource'
          }
        ]
      };
      axios
        .patch(
          `${apiUrl}/node/` +
            this.state.training_resource.id +
            '?_format=hal_json',
          data_to_send,
          {
            withCredentials: true,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/hal+json',
              'X-CSRF-Token': csrf
            }
          }
        )
        .then(response => {
          this.redirectTo();
        });
    } else {
      alert('Incorrect dates');
    }
    event.preventDefault();
  }

  componentDidMount() {
    this.setState({ training_resource_slug: this.state.path[3] });
    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });
    axios
      .get(
        `${apiUrl}/api/resources/?_format=json&slug=${
          this.state.path[3]
        }&timestamp=${Date.now()}&source=competencyhub`
      )
      .then(response => {
        this.setState({ training_resource: response.data });
      });
  }

  handleChange(event) {
    console.log('TR', this.state.training_resource);
    let fields = this.state.training_resource;
    let value = event.target.value;
    fields[event.target.name] = value.replace(/(<([^>]+)>)/gi, '');
    this.setState({ fields });
  }

  handleCKEditorChange(event, input_name) {
    let fields = this.state.training_resource;
    fields[input_name] = event.editor.getData();
    this.setState({ fields });
  }

  redirectTo() {
    this.props.history.push(
      '/training-resources/' + this.state.training_resource_slug
    );
  }

  buildTrainingResourceEditForm() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${apiUrl}/api/resources/?_format=json&slug=${
            this.state.path[3]
          }&timestamp=${Date.now()}&source=competencyhub`
        )
        .then(response => {
          resolve(response.data);
        });
    });
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
              onSubmit={event => this.handleSubmit(event)}
            >
              <div className="vf-form__item">
                <strong>Title *</strong>

                <input
                  type="text"
                  ref="title"
                  id={'title'}
                  name="title"
                  value={this.state.training_resource.title}
                  onChange={event => this.handleChange(event)}
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
                    name={'dates'}
                    ref="dates"
                    value={this.state.training_resource.dates}
                    onChange={event => this.handleChange(event)}
                    placeholder="Date"
                    className="vf-form__input"
                  />
                </div>
                <div className="vf-form__item">
                  <strong>Dates</strong>
                  <input
                    type="date"
                    name={'end_date'}
                    ref="dates2"
                    value={this.state.training_resource.end_date}
                    onChange={event => this.handleChange(event)}
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
                  name={'type'}
                  value={this.state.training_resource.type}
                  onChange={event => this.handleChange(event)}
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
                  content={this.state.training_resource.description}
                  name={'description'}
                  events={{
                    change: event =>
                      this.handleCKEditorChange(event, 'description')
                  }}
                  onChange={event =>
                    this.handleCKEditorChange(event, 'description')
                  }
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
                  name={'location'}
                  value={this.state.training_resource.location}
                  onChange={event => this.handleChange(event)}
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
                  name={'url'}
                  value={this.state.training_resource.url}
                  onChange={event => this.handleChange(event)}
                  required
                  placeholder="URL"
                  className="vf-form__input"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Target audience</strong>
                <CKEditor
                  name={'target_audience'}
                  content={this.state.training_resource.target_audience}
                  events={{
                    change: event =>
                      this.handleCKEditorChange(event, 'target_audience')
                  }}
                  activeClass="p10"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Learning outcomes</strong>
                <CKEditor
                  name={'learning_outcomes'}
                  content={this.state.training_resource.learning_outcomes}
                  events={{
                    change: event =>
                      this.handleCKEditorChange(event, 'learning_outcomes')
                  }}
                  activeClass="p10"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Organisers</strong>
                <CKEditor
                  name={'organisers'}
                  content={this.state.training_resource.organisers}
                  events={{
                    change: event =>
                      this.handleCKEditorChange(event, 'organisers')
                  }}
                  activeClass="p10"
                />
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Trainers</strong>
                <CKEditor
                  name={'trainers'}
                  content={this.state.training_resource.trainers}
                  events={{
                    change: event =>
                      this.handleCKEditorChange(event, 'trainers')
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
                  name={'keywords'}
                  value={this.state.training_resource.keywords}
                  onChange={event => this.handleChange(event)}
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
    <Route
      exact
      path="/training-resource/edit/:training_resource_slug"
      component={ResourceEdit}
    />
  </Switch>
);

export default EditResources;
