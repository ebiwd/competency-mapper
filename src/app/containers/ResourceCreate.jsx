import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import CKEditor from 'react-ckeditor-component';
import { apiUrl, apiUrlWithHTTP } from '../services/http/http';
import { extractSlugFromBackendUrl } from '../services/util/slugifier';

class ResourceCreate extends React.Component {
  constructor(props) {
    super(props);
    //this.onChange = this.onChange.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
    this.changeType = this.changeType.bind(this);
    this.changeTargetAudience = this.changeTargetAudience.bind(this);
    this.changeLearningOutcomes = this.changeLearningOutcomes.bind(this);
    this.changeOrganisers = this.changeOrganisers.bind(this);
    this.changeTrainers = this.changeTrainers.bind(this);
    this.changeLocation = this.changeLocation.bind(this);
    this.changeUrl = this.changeUrl.bind(this);
    this.changeDates = this.changeDates.bind(this);
    this.changeDates2 = this.changeDates2.bind(this);
    this.changeKeywords = this.changeKeywords.bind(this);
    this.changeProvider = this.changeProvider.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
    this.getAutocomplete = this.getAutocomplete.bind(this);
    this.optionClick = this.optionClick.bind(this);

    this.state = {
      data: [],
      csrf: '',
      updateFlag: false,
      content: 'content',
      tess_id: '',
      title: '',
      description: '',
      type: '',
      target_audience: '',
      learning_outcomes: '',
      location: '',
      url: '',
      organisers: '',
      trainers: '',
      dates: '',
      dates2: '',
      keywords: '',
      tessResources: [],
      provider: '',
      providers: [],
      category: '',
      showAutocomplete: false,
      autocompleteTerm: '',
      loading: false
    };
  }

  showLoadingStyle() {
    if (this.state.loading) {
      return {
        background: 'url(../progressbar.gif)',
        backgroundSize: '8%',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'right'
      };
    }
    return;
  }

  changeTitle(evt) {
    this.setState({ title: evt.currentTarget.value });
  }

  changeDescription(evt) {
    let newContent = evt.editor.getData();
    this.setState({ description: newContent });
  }

  changeType(evt) {
    this.setState({ type: evt.currentTarget.value });
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

  changeLocation(evt) {
    this.setState({ location: evt.currentTarget.value });
  }

  changeUrl(evt) {
    this.setState({ url: evt.currentTarget.value });
  }

  changeDates(evt) {
    this.setState({ dates: evt.currentTarget.value });
  }

  changeDates2(evt) {
    this.setState({ dates2: evt.currentTarget.value });
  }

  changeKeywords(evt) {
    this.setState({ keywords: evt.currentTarget.value });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.updateFlag) {
      setTimeout(() => {
        this.props.history.push('/all-training-resources');
        //this.setState({'updateFlag': false});
      }, 1000);
    }
  }

  componentDidMount() {
    // let csrfURL = `${apiUrl}/rest/session/token`;
    // fetch(csrfURL)
    //   .then(Response => Response)
    //   .then(findresponse2 => {
    //     this.setState({ csrf: findresponse2 });
    //   });
  }

  changeCategory(value) {
    this.setState({ category: value.toLowerCase(), loading: true });
    fetch(
      `https://tess.elixir-europe.org/content_providers?page_size=200&sort=asc`,
      {
        method: 'GET',
        headers: {
          accept: 'application/vnd.api+json'
        }
      }
    )
      .then(response => response.json())
      .then(response => {
        this.setState({ providers: response, loading: false });
      });
  }

  changeProvider(value) {
    this.setState({ provider: value, loading: true });
    let category = this.state.category.toLowerCase();
    let extraParams = category === 'events' ? '&sort=late' : '';
    fetch(
      `https://tess.elixir-europe.org/${category}?content_provider=${value}&page_size=5000${extraParams}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/vnd.api+json'
        }
      }
    )
      .then(response => response.json())
      .then(response => {
        this.setState({ tessResources: response, loading: false });
      });
  }

  getAutocomplete(e) {
    console.log(e.currentTarget.value);
    this.setState({
      showAutocomplete: true,
      autocompleteTerm: e.currentTarget.value
    });
  }

  optionClick(id) {
    let selectedResource = this.state.tessResources.data.filter(
      item => item.id === id
    );
    let startDate = '';
    let endDate = '';
    if (this.state.category === 'events') {
      startDate = selectedResource[0].attributes.start.slice(0, 10);
      endDate = selectedResource[0].attributes.end.slice(0, 10);
    }

    this.setState({
      showAutocomplete: false,
      title: selectedResource[0].attributes.title,
      description: selectedResource[0].attributes.description,
      target_audience: selectedResource[0].attributes[
        'target-audience'
      ].toString(),
      location: selectedResource[0].attributes.venue,
      url: selectedResource[0].attributes.url,
      organisers: selectedResource[0].attributes.organizer,
      dates: startDate,
      dates2: endDate,
      keywords: selectedResource[0].attributes.keywords.toString()
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
    let title = this.state.title;
    let dates = this.state.dates;
    let dates2 = this.state.dates2;
    let type = 'Online';
    if (this.state.type) {
      type = this.state.type;
    }

    let description = this.state.description;
    let location = this.state.location;
    let url = this.state.url;
    let target_audience = this.state.target_audience;
    let learning_outcomes = this.state.learning_outcomes;
    let keywords = this.state.keywords;
    let organisers = this.state.organisers;
    let trainers = this.state.trainers;
    let tess_id = this.state.tess_id;
    let tess_category = this.state.category
      ? this.state.category.charAt(0).toUpperCase() +
        this.state.category.slice(1)
      : '';
    let tess_conten_provider = this.state.provider;

    let token = localStorage.getItem('csrf_token');
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
              href: `${apiUrlWithHTTP}/rest/type/node/training_resource`
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
          field_tess_id: [
            {
              value: tess_id
            }
          ],
          field_tess_category: [
            {
              value: tess_category
            }
          ],
          field_tess_content_provider: [
            {
              value: tess_conten_provider
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
        .then(data => {
          this.props.history.push({
            pathname: `/training-resources/${extractSlugFromBackendUrl(
              data._links.self.href
            )}`
          });
          // console.log(data.path);
        });
    } else {
      alert('Incorrect dates');
    }
  }

  render() {
    return (
      <div>
        <nav>
          <Link to={`/`}>Home</Link> /{' '}
          <Link to={`/all-training-resources`}>All training resources</Link> /
          Create resource{' '}
        </nav>
        <h2>Create Training Resource</h2>
        <p>(* fields are mandatory)</p>

        <div>
          <div>
            <form
              className="vf-form"
              id={'resource_create_form'}
              onSubmit={this.handleSubmit.bind(this)}
            >
              <div className="vf-grid">
                <div className="vf-form__item">
                  <strong>Select category from TeSS:</strong>
                  <select
                    style={this.showLoadingStyle()}
                    className="vf-form__select"
                    ref={'provider'}
                    onChange={e => this.changeCategory(e.currentTarget.value)}
                  >
                    <option>-None-</option>
                    <option>Events</option>
                    <option>Materials</option>
                  </select>
                </div>
                <div className="vf-form__item">
                  <div>
                    <strong>Select provider from TeSS:</strong>
                    <select
                      style={this.showLoadingStyle()}
                      className="vf-form__select"
                      ref={'provider'}
                      onChange={e => this.changeProvider(e.currentTarget.value)}
                    >
                      <option>-None-</option>
                      {/* {this.state.tessResources.meta
                        ? this.state.tessResources.meta['available-facets'][
                          'content-provider'
                        ].map((provider, key) => {
                          return <option key={key}>{provider.value}</option>;
                        })
                        : ''} */}
                      {this.state.providers.data
                        ? this.state.providers.data
                            .filter(provider => provider.id !== '2')
                            .map((provider, key) => {
                              return (
                                <option key={key}>
                                  {provider.attributes.title}
                                </option>
                              );
                            })
                        : ''}
                    </select>
                  </div>
                </div>
              </div>
              <div className="vf-u-margin__bottom--600" />

              <div className="vf-form__item">
                <strong>Title *</strong>
                <input
                  className="vf-form__input"
                  type="text"
                  ref="title"
                  required
                  placeholder="Title"
                  onKeyDown={e => this.getAutocomplete(e)}
                  value={this.state.title}
                  onChange={evt => this.changeTitle(evt)}
                />
                {this.state.showAutocomplete === true &&
                this.state.provider &&
                this.state.category ? (
                  <ul className="vf-list suggestions_results">
                    {this.state.tessResources.data
                      .filter(resource =>
                        resource.attributes.title
                          .toLowerCase()
                          .includes(this.state.autocompleteTerm)
                      )
                      .map((item, key) => {
                        return (
                          <li
                            key={key}
                            className={`vf-list__item`}
                            onClick={() => this.optionClick(item.id)}
                          >
                            <p>
                              {item.attributes.title}{' '}
                              {this.state.category === 'events'
                                ? '-' + item.attributes.start.slice(0, 4)
                                : ''}{' '}
                            </p>
                          </li>
                        );
                      })}
                  </ul>
                ) : (
                  ''
                )}
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
                    value={this.state.dates}
                    onChange={evt => this.changeDates(evt)}
                  />
                </div>
                <div className="vf-form__item">
                  <strong>End Date</strong>
                  <input
                    type="date"
                    className="vf-form__input"
                    ref="dates2"
                    placeholder="Date"
                    value={this.state.dates2}
                    onChange={evt => this.changeDates2(evt)}
                  />
                </div>
              </div>
              <div className="vf-u-margin__bottom--600" />
              <div className="vf-form__item">
                <strong>Event type *</strong>
                <select
                  className="vf-form__select"
                  // selectedOption={this.state.type}
                  onChange={e => this.changeType(e)}
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
                  value={this.state.location || ''}
                  onChange={evt => this.changeLocation(evt)}
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
                  value={this.state.url}
                  onChange={evt => this.changeUrl(evt)}
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
                  value={this.state.keywords}
                  onChange={evt => this.changeKeywords(evt)}
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
