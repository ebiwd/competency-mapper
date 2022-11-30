import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import HttpService from '../services/http/http';
import { apiUrl } from '../services/http/http';

const FAIRDownload = () => {
  let http = new HttpService();
  const [data, setData] = useState();
  // const [data2, setData2] = useState();
  const [headers, setHeaders] = useState();
  const [filters, setFilters] = useState();
  const [facets, setFacets] = useState('');
  let history = useHistory();
  let location = history.location;
  const frameworkName = location.pathname.split('/')[2];
  const frameworkVersion = location.pathname.split('/')[3];

  useEffect(() => {
    const fetchData = async () => {
      const response = await http
        .get(
          `${apiUrl}/api/export/${frameworkName}/${frameworkVersion}?_format=json&filters=${facets}&source=competencyhub`
        )
        .then(response => response.data);
      setData(response.data);
      setHeaders(response.headers);
      setFilters(response.filters);
    };
    fetchData();
  }, [facets, frameworkName, frameworkVersion, http]);

  const facetClick = e => {
    let target = e.target;
    let temp = facets.split(',');
    //temp.push();
    if (target.checked) {
      let index = temp.indexOf(e.target.name);
      temp.splice(index, 1);
    } else {
      temp.push(...facets, e.target.name);
    }
    setFacets(temp.join());
  };

  return (
    <>
      <div>
        <p>
          Download the information of this framework as a csv file. Choose which
          identifiers and reference profiles (if available) to include in the
          table. This option enables you to create derivative works of the
          competency framework.
        </p>
        <div className="vf-u-margin__top--800" />
        <h3>Filter columns</h3>
      </div>
      <div className="vf-grid">
        <div>
          <div className="vf-u-margin__top--400" />
          <h4>Identifiers</h4>
          <form action="#" className="vf-form | vf-search">
            {filters
              ? filters.identifiers.map(filter => {
                  return (
                    <div
                      key={filter}
                      className="vf-form__item vf-form__item--checkbox"
                    >
                      <input
                        type="checkbox"
                        id={filter}
                        name={filter}
                        className="vf-form__checkbox"
                        //checked={!facets.includes(filter)}
                        defaultChecked={!facets.includes(filter)}
                        onClick={e => facetClick(e)}
                      />
                      <label htmlFor={filter} className="vf-form__label">
                        {filter}
                      </label>
                    </div>
                  );
                })
              : ''}
          </form>
        </div>
        <div>
          <div className="vf-u-margin__top--400" />
          <h4>Reference profiles</h4>
          <form action="#" className="vf-form | vf-search">
            <div className="vf-form__item" style={{ columnCount: '2' }}>
              {filters
                ? filters.profiles.map(filter => {
                    return (
                      <div className="vf-form__item vf-form__item--checkbox">
                        <input
                          type="checkbox"
                          id={filter}
                          name={filter}
                          className="vf-form__checkbox"
                          checked={!facets.includes(filter)}
                          onClick={e => facetClick(e)}
                        />
                        <label for={filter} className="vf-form__label">
                          {filter}
                        </label>
                      </div>
                    );
                  })
                : ''}
            </div>
          </form>
        </div>
        <div>
          <div className="vf-u-margin__top--1600" />
          <CSVLink
            className="vf-button vf-button--primary vf-button--sm"
            filename={frameworkName + '_' + frameworkVersion + '.csv'}
            data={data ? data : ''}
          >
            Export
          </CSVLink>
        </div>
      </div>
      <div className="vf-u-margin__top--400" />
      <div>
        <svg className="vf-icon-sprite vf-icon-sprite--tables" display="none">
          <defs>
            <g id="vf-table-sortable--up">
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M17.485,5.062,12.707.284a1.031,1.031,0,0,0-1.415,0L6.515,5.062a1,1,0,0,0,.707,1.707H10.25a.25.25,0,0,1,.25.25V22.492a1.5,1.5,0,1,0,3,0V7.019a.249.249,0,0,1,.25-.25h3.028a1,1,0,0,0,.707-1.707Z"
              />
            </g>
            <g id="vf-table-sortable--down">
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M17.7,17.838a1,1,0,0,0-.924-.617H13.75a.249.249,0,0,1-.25-.25V1.5a1.5,1.5,0,0,0-3,0V16.971a.25.25,0,0,1-.25.25H7.222a1,1,0,0,0-.707,1.707l4.777,4.778a1,1,0,0,0,1.415,0l4.778-4.778A1,1,0,0,0,17.7,17.838Z"
              />
            </g>
            <g id="vf-table-sortable">
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M9,19a1,1,0,0,0-.707,1.707l3,3a1,1,0,0,0,1.414,0l3-3A1,1,0,0,0,15,19H13.5a.25.25,0,0,1-.25-.25V5.249A.25.25,0,0,1,13.5,5H15a1,1,0,0,0,.707-1.707l-3-3a1,1,0,0,0-1.414,0l-3,3A1,1,0,0,0,9,5h1.5a.25.25,0,0,1,.25.25v13.5a.25.25,0,0,1-.25.25Z"
              />
            </g>
          </defs>
        </svg>
        <table className="vf-table vf-table--striped">
          <thead className="vf-table__header">
            <tr className="vf-table__row">
              {headers ? (
                headers.map((header, index) => {
                  return (
                    <th key={index} className="vf-table__heading">
                      {header}
                    </th>
                  );
                })
              ) : (
                <th />
              )}
            </tr>
          </thead>
          <tbody className="vf-table__body">
            {data ? (
              data.map((data, index) => {
                return (
                  <tr key={index} className="vf-table__row">
                    {headers ? (
                      headers.map(header => (
                        <td key={header} className="vf-table__cell">
                          {data[header]}
                        </td>
                      ))
                    ) : (
                      <td />
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>
                  <img
                    alt="progress"
                    src="/dev-competency-mapper/progressbar.gif"
                  />
                  <h4>Loading data...</h4>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FAIRDownload;
