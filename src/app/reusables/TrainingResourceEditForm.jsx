import React from 'react';
import CKEditor from 'react-ckeditor-component';

class TrainingResourceEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      training_resource: this.props.training_resource
    };
  }

  handleChange(event) {
    let fields = this.state.training_resource;
    let value = event.target.value;
    fields[event.target.name] = value.replace(/(<([^>]+)>)/gi, '');
    this.setState({ fields });
  }

  handleCKEditorChange(event) {
    let fields = this.state.training_resource;
    let value = event.editor.getData();
    fields[event.target.name] = value.replace(/(<([^>]+)>)/gi, '');
    this.setState({ fields });
  }
  componentDidMount() {
    console.log('state', this.state.training_resource);
    console.log('props', this.props);
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
              onSubmit={event => this.props.handleSubmit(event)}
            >
              <div className="vf-form__item">
                <strong>Title *</strong>

                <input
                  type="text"
                  ref="title"
                  id={'title'}
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
                    ref="dates2"
                    value={this.state.training_resource.dates2}
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
                    change: event => this.handleCKEditorChange(event)
                  }}
                  onChange={event => this.handleCKEditorChange(event)}
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
                    change: event => this.handleCKEditorChange(event)
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
                    change: event => this.handleCKEditorChange(event)
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
                    change: event => this.handleCKEditorChange(event)
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
                    change: event => this.handleCKEditorChange(event)
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

export default TrainingResourceEditForm;
