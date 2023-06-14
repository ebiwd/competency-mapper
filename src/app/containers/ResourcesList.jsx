import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { apiUrl, apiUrlWithHTTP } from '../services/http/http';
import auth from '../services/util/auth';

class ResourcesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      filterType: '',
      filterMapping: '',
      userid: '',
      activePage: 0,
      totalItemsCount: 0,
      filter: ''
    };
    this.archiveHandle = this.archiveHandle.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
  }

  async handlePageChange(pageNumber) {
    await this.setState({ resources: null });
    await this.setState({ activePage: pageNumber });
    await this.fetchData();
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 700);
  }

  async searchSubmit(e) {
    e.preventDefault();
    await this.setState({ resources: null });
    await this.setState({ activePage: 1 });
    await this.setState({ totalItemsCount: 0 });
    await this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.updateFlag) {
      this.fetchData();
      setTimeout(() => {
        this.setState({ updateFlag: false });
      }, 1000);
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });

    //let resourcesURL = `${apiUrl}/api/v1/training-resources/all?_format=json`;
    //let resourcesURL = `${apiUrl}/api/resources?_format=json&timestamp=${Date.now()}`;
    let resourcesURL = `${apiUrl}/api/resources?_format=json&page=${
      this.state.activePage
    }&title=${this.state.filter}&type=${this.state.filterType}`;
    await fetch(resourcesURL)
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          resources: findresponse
        });
      });
    if (this.state.resources[0]) {
      let hitcount = this.state.resources[0].hitcount;
      this.setState({ totalItemsCount: hitcount });
    }
  }

  async filter(e) {
    await this.setState({ filter: e.target.value });
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
            href: `${apiUrlWithHTTP}/rest/type/node/training_resource`
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

  formatDates(start, end) {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    let start_dt = new Date(start);
    let end_date = new Date(end);

    let start_day = start_dt.getDate();
    let start_month = start_dt.getMonth();
    let start_year = start_dt.getFullYear();

    if (end) {
      let end_day = end_date.getDate();
      let end_month = end_date.getMonth();
      let end_year = end_date.getFullYear();

      if (start_year === end_year) {
        if (start_month === end_month) {
          if (start_day === end_day) {
            return start_day + ' ' + months[start_month] + ' ' + start_year;
          } else {
            return (
              start_day +
              ' - ' +
              end_day +
              ' ' +
              months[start_month] +
              ' ' +
              start_year
            );
          }
        } else {
          return (
            start_day +
            ' ' +
            months[start_month] +
            ' - ' +
            end_day +
            ' ' +
            months[end_month] +
            ' ' +
            start_year
          );
        }
      } else {
        return (
          start_day +
          ' ' +
          months[start_month] +
          ' ' +
          start_year +
          ' - ' +
          end_day +
          ' ' +
          months[end_month] +
          ' ' +
          end_year
        );
      }
    } else {
      return start_day + ' ' + months[start_month] + ' ' + start_year;
    }
  }

  render() {
    let resources = this.state.resources;
    var ListOfResources = '';
    if (resources) {
      ListOfResources = resources.map((item, index) => (
        <tr className="vf-table__row" key={index}>
          <td className="vf-table__cell">{index + 1} </td>
          <td className="vf-table__cell">
            <div style={{ maxWidth: '500px' }}>
              <Link
                to={{
                  pathname: `/training-resources/${item.slug}`,
                  state: {
                    training_resource_id: item.id
                  }
                }}
              >
                {item.title}
              </Link>
            </div>
          </td>
          <td className="vf-table__cell">
            {item.dates ? this.formatDates(item.dates, item.end_date) : ''}
          </td>
          <td className="vf-table__cell">{item.type}</td>
          <td className="vf-table__cell">
            <a href={item.url} target={'_blank'}>
              Resource URL
            </a>
          </td>
          <td className="vf-table__cell">
            {item.archived === 'archived' ? (
              <a // eslint-disable-line jsx-a11y/anchor-is-valid
                style={{ cursor: 'pointer' }}
                onClick={this.archiveHandle.bind(this, item.id, 1)}
              >
                {' '}
                <i className="fas fa-toggle-on" /> <span>Archived</span>{' '}
              </a>
            ) : (
              <a // eslint-disable-line jsx-a11y/anchor-is-valid
                style={{ cursor: 'pointer' }}
                onClick={this.archiveHandle.bind(this, item.id, 0)}
              >
                {' '}
                <i className="fas fa-toggle-off" />
              </a>
            )}
          </td>
          <td className="vf-table__cell">
            {auth.currently_logged_in_user.id == item.author ? (
              <Link to={`/training-resource/edit/${item.slug}`}>
                <i className="fas fa-edit" />{' '}
              </Link>
            ) : (
              ''
            )}
          </td>
        </tr>
      ));
    }

    return (
      <div>
        <h3>Training Resources</h3>
        <form
          className="vf-form | vf-search"
          onSubmit={e => this.searchSubmit(e)}
        >
          <div className="vf-grid vf-grid__col-6">
            <div className="vf-form__item | vf-search__item vf-grid__col--span-2">
              <label
                class="vf-form__label vf-u-sr-only | vf-search__label"
                for="search_box"
              >
                Search training resources
              </label>
              <input
                type="search"
                onChange={this.filter.bind(this)}
                placeholder="Type to search"
                className="vf-form__input | vf-search__item"
                id="search_box"
              />
            </div>
            <div className="vf-form__item vf-grid__col--span-1">
              <select
                ref={'type'}
                onChange={this.filterTypeHandle.bind(this)}
                className="vf-form__select"
              >
                <option value={'All'}>All</option>
                <option value={'Online'}>Online</option>
                <option value={'Face-to-Face'}>Face-to-Face</option>
                <option value={'Webinar'}>Webinar</option>
                <option value={'Hackathon'}>Hackathon</option>
              </select>
            </div>
            <div className="vf-form__item vf-grid__col--span-1">
              <input
                type="submit"
                className="vf-search__button | vf-button vf-button--primary vf-button--sm"
                value="Search"
              />
            </div>
            <div className="vf-grid__col--span-1">
              <Link
                className={'vf-button vf-button--primary vf-button--sm'}
                to={'/training-resource/create'}
              >
                <i className="fas fa-plus-circle"> </i> Add training resource{' '}
              </Link>
            </div>
          </div>
        </form>
        <div className="vf-grid vf-grid__col-6">
          <div className="vf-form__item vf-grid__col--span-3">
            <h5>Total: {this.state.totalItemsCount}</h5>
          </div>
          <div
            className="vf-form__item vf-grid__col--span-3"
            style={{ paddingTop: '30px' }}
          >
            <input
              type="checkbox"
              id="checkboxMapping"
              checked={this.state.filterMapping}
              onChange={this.filterMappingHandle.bind(this)}
              className="vf-form__checkbox"
            />
            <label for="checkboxMapping" className="vf-form__label">
              {' '}
              Show resources with deprecated mapping{' '}
            </label>
          </div>
        </div>

        <table className="vf-table vf-table--striped">
          <thead className="vf-table__header">
            <tr className="vf-table__row">
              <th className="vf-table__heading">S. No.</th>
              <th className="vf-table__heading">Title</th>
              <th className="vf-table__heading">Date(s)</th>
              <th className="vf-table__heading">Type</th>
              <th className="vf-table__heading">URL</th>
              <th className="vf-table__heading">Archive</th>
              <th className="vf-table__heading">Edit</th>
            </tr>
          </thead>
          {resources ? (
            resources.length > 0 ? (
              <tbody className="vf-table__body">{ListOfResources}</tbody>
            ) : (
              <h5>No results found</h5>
            )
          ) : (
            <center>
              <img alt="progress" src="/progressbar.gif" />
              <h4>Loading resources</h4>
            </center>
          )}
        </table>
        <nav className="vf-pagination" aria-label="Pagination">
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={50}
            totalItemsCount={this.state.totalItemsCount}
            pageRangeDisplayed={10}
            onChange={e => this.handlePageChange(e)}
            innerClass="vf-pagination__list"
            itemClass="vf-pagination__item"
            itemClassPrev="vf-pagination__item--previous-page"
            itemClassNext="vf-pagination__item--next-page"
            linkClass="vf-pagination__link vf-pagination__label"
            activeClass="vf-pagination__item--is-active"
            prevPageText="Previous"
            nextPageText="Next"
          />
        </nav>
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
