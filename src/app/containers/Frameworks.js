import React from 'react';
import { Link } from 'react-router-dom';
import Parser from 'html-react-parser';

import { apiUrl } from '../services/competency/competency';

class Frameworks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    fetch(`${apiUrl}` + '/api/frameworks')
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          data: findresponse,
          frameworkID: ''
        });
      });
  }

  render() {
    const data = this.state.data;

    return (
      <div>
        {
          <div>
            <h3>Overview</h3>
            <p className="lead">
              Introduction to the idea of competency frameworks and their
              linkage with training resources. Two lines of description should
              look good and then links can be given to{' '}
              <a className="readmore">read more</a>
            </p>
            <table className="responsive-table hover">
              <tbody>
                <tr>
                  {data.map((item, id) => {
                    if (id <= 2) {
                      return (
                        <td className="callout text-center">
                          <Link to={`/framework/${item.title.toLowerCase()}`}>
                            <div style={{ height: '170px' }}>
                              <img
                                src={
                                  'http://dev-competency-mapper.pantheonsite.io/' +
                                  item.field_logo
                                }
                              />
                            </div>
                            <div
                              className={
                                'highlight-caption highlight-caption-big'
                              }
                              style={{ position: 'relative', top: '-5px' }}
                            >
                              <p>
                                {Parser(
                                  item.field_description.substr(0, 120) +
                                    '...' +
                                    '<i className="icon icon-functional" data-icon=">"></i>'
                                )}
                              </p>
                            </div>
                          </Link>
                        </td>
                      );
                    }
                  })}
                </tr>
                <tr>
                  {data.map((item, id) => {
                    if (id >= 3) {
                      return (
                        <td className="callout text-center">
                          <Link to={`/framework/${item.title.toLowerCase()}`}>
                            <div style={{ height: '170px' }}>
                              <img
                                src={
                                  'http://dev-competency-mapper.pantheonsite.io/' +
                                  item.field_logo
                                }
                              />
                            </div>
                            <div
                              className={
                                'highlight-caption highlight-caption-big'
                              }
                              style={{ position: 'relative', top: '-5px' }}
                            >
                              <p>
                                {Parser(
                                  item.field_description.substr(0, 120) +
                                    '...' +
                                    '<i className="icon icon-functional" data-icon=">"></i>'
                                )}
                              </p>
                            </div>
                          </Link>
                        </td>
                      );
                    }
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        }
      </div>
    );
  }
}

export default Frameworks;
