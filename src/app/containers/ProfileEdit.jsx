import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import FileUpload from './FileUpload';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
//import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link } from 'react-router-dom';

export const ProfileEdit = props => {
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profileId = props.location.pathname.split('/')[6];

  //const [profile, setProfile] = useState();

  //const activeRequests = new ActiveRequestsService();
  const profileService = new ProfileService();
  const [title, setTitle] = useState();
  const [age, setAge] = useState();
  const [currentRole, setCurrentRole] = useState();
  const [gender, setGender] = useState();

  const [selectedFile, setSelectedFile] = useState();
  const [fid, setFid] = useState();
  const [imgpreview, setImgpreview] = useState();
  const [fileSizeError, setFileSizeError] = useState();
  const [fileTypeError, setFileTypeError] = useState();

  const [jobTitle, setJobTitle] = useState();
  const [qualification, setQualification] = useState();
  const [additionalInfo, setAdditionalInfo] = useState();
  const [publishStatus, setPublishStatus] = useState();
  const [userFrameworks, setUserFrameworks] = useState([]);
  // const [framework, setFramework] = useState();

  var userName = localStorage.getItem('user')
    ? localStorage.getItem('user')
    : '';

  //var user_roles = localStorage.getItem('roles')
  //  ? localStorage.getItem('roles')
  //  : '';

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${apiUrl}/node/${profileId}?_format=json`)
        .then(Response => Response.json())
        .then(findresponse => {
          //setProfile(findresponse);
          setTitle(findresponse.title[0].value);
          setImgpreview(
            findresponse.field_image[0] ? findresponse.field_image[0].url : ''
          );
          setFid(
            findresponse.field_image[0]
              ? findresponse.field_image[0].target_id
              : ''
          );
          setJobTitle(
            findresponse.field_job_title[0]
              ? findresponse.field_job_title[0].value
              : ''
          );
          setAge(
            findresponse.field_age[0] ? findresponse.field_age[0].value : ''
          );
          setGender(
            findresponse.field_gender[0]
              ? findresponse.field_gender[0].value
              : 'None'
          );
          setCurrentRole(
            findresponse.field_current_role[0]
              ? findresponse.field_current_role[0].value
              : ''
          );
          setQualification(
            findresponse.field_qualification_background[0]
              ? findresponse.field_qualification_background[0].value
              : ''
          );
          setAdditionalInfo(
            findresponse.field_additional_information[0]
              ? findresponse.field_additional_information[0].value
              : ''
          );
          setPublishStatus(
            findresponse.field_publishing_status[0]
              ? findresponse.field_publishing_status[0].value
              : ''
          );
        });

      await fetch(`${apiUrl}/api/authorisation/${userName}?_format=json`, {
        method: 'GET',
        credentials: 'include'
      })
        .then(Response => Response.json())
        .then(findresponse => {
          setUserFrameworks(findresponse);
        });
    };
    fetchData();
  }, [profileId, userName]);

  const handleSubmit = async evt => {
    evt.preventDefault();
    if (
      !title ||
      !jobTitle ||
      title.length < 2 ||
      jobTitle.length < 3 ||
      fileTypeError ||
      fileSizeError
    ) {
    } else {
      let token = localStorage.getItem('csrf_token');
      var fileid = fid;
      if (selectedFile) {
        console.log(selectedFile);
        await fetch(
          apiUrl + '/file/upload/node/profile/field_image?_format=json',
          {
            credentials: 'include',
            method: 'POST',
            cookies: 'x-access-token',
            headers: {
              accept: 'application/octet-stream',
              'Content-Type': 'application/octet-stream',
              'X-CSRF-Token': token,
              'Content-Disposition': 'file; filename="persona_picture.png"'
            },
            body: selectedFile
          }
        )
          .then(resp => resp.json())
          .then(function(data) {
            console.log(data);
            fileid = data.fid[0].value;
          });
      }

      let response = await profileService.editProfile(
        profileId,
        title,
        age,
        currentRole,
        gender,
        jobTitle,
        qualification,
        additionalInfo,
        publishStatus,
        fileid
      );

      if (response.nid[0].value) {
        props.history.push(
          `/framework/${frameworkName}/${frameworkVersion}/profile/map/${
            response.nid[0].value
          }`
        );
      }
    }
  };

  function ButtonLabel() {
    let submitButtonLabel = 'Map competencies';
    if (!localStorage.getItem('roles')) {
      submitButtonLabel = 'Download';
    }

    return (
      <input
        type="submit"
        className="vf-button vf-button--primary vf-button--sm"
        value={submitButtonLabel}
      />
    );
  }

  const getWhoCreateProfile = () => {
    let placeholder = 'a reference';
    if (!localStorage.getItem('roles')) {
      placeholder = 'your';
    }
    return placeholder;
  };

  const placeholder = getWhoCreateProfile();

  // Check if Fields are not empty hide Help Text
  let titleCalloutClass = 'small callout alert';
  let jobTitleCalloutClass = 'small callout alert';
  let nameHelp = 'Name is required and must be at least 2 characters long';
  let jobTitleHelp =
    'Job Title is required and must be at least 3 characters long';
  if (title) {
    if (title.length > 1) {
      nameHelp = '';
      titleCalloutClass = '';
    }
  }

  if (jobTitle) {
    if (jobTitle.length > 2) {
      jobTitleHelp = '';
      jobTitleCalloutClass = '';
    }
  }

  // const setPreview = () => {
  //   props.history.push(
  //     `/framework/${frameworkName}/${frameworkVersion}/profile/preview`,
  //     {
  //       title: title
  //     }
  //   );
  // };

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    } else {
      const objectUrl = URL.createObjectURL(e.target.files[0]);

      if (e.target.files[0].size > 2097152) {
        setFileSizeError(1);
      } else {
        setFileSizeError(undefined);
      }

      if (
        e.target.files[0].type !== 'image/jpeg' &&
        e.target.files[0].type !== 'image/png'
      ) {
        setFileTypeError(1);
      } else {
        setFileTypeError(undefined);
      }

      console.log(e.target.files[0]);

      setImgpreview(objectUrl);
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearimgpreview = e => {
    e.preventDefault();
    setImgpreview(undefined);
    setFid(undefined);
    setFileTypeError(undefined);
    setFileSizeError(undefined);
    document.getElementById('fileupload').value = '';
  };

  const checkFMAccess = () => {
    var temp = [];
    userFrameworks.map(item => {
      temp.push(item.toLowerCase());
      return null;
    });
    if (temp.includes(frameworkName)) {
      return true;
    }
    return false;
  };

  return (
    <div>
      {checkFMAccess() ? (
        <div>
          <Link
            to={`/framework/${frameworkName}/${frameworkVersion}/profile/view/${profileId}/alias`}
          >
            {' '}
            View{' '}
          </Link>
          <h2>Create {placeholder} profile</h2>

          <form
            className="form"
            id="profile_create_form"
            onSubmit={handleSubmit}
          >
            <div className="vf-grid vf-grid__col-4">
              <div className="vf-grid__col--span-1">
                <span>
                  <strong>Name</strong>
                  <input
                    type="text"
                    id="title"
                    placeholder="Name"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="vf-form__input"
                  />
                  <div className={titleCalloutClass}>
                    <i>{nameHelp}</i>
                  </div>
                </span>
                <span>
                  <strong>Image</strong>
                  <input type="file" id="fileupload" onChange={onSelectFile} />
                </span>

                <span>
                  <img
                    alt=""
                    id="imgpreview_image"
                    width="100px"
                    src={imgpreview}
                    height="100px"
                    style={{
                      border: '1px solid #ccc',
                      padding: '5px',
                      width: '30%'
                    }}
                  />
                  {imgpreview ? (
                    <div>
                      <button onClick={e => clearimgpreview(e)}>
                        Clear image x
                      </button>
                    </div>
                  ) : (
                    ''
                  )}

                  {fileSizeError ? (
                    <div className="small callout alert">
                      <em> Image size should not be more than 2 MB </em>{' '}
                    </div>
                  ) : (
                    ''
                  )}

                  {fileTypeError ? (
                    <div className="small callout alert">
                      <em> Only JPG or PNG images are allowed </em>{' '}
                    </div>
                  ) : (
                    ''
                  )}
                </span>
                <span>
                  <strong>Age (in years)</strong>
                  <input
                    type="number"
                    id="age"
                    placeholder="Age"
                    width={4}
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="vf-form__input"
                  />
                </span>
                <span>
                  <strong>Gender</strong>
                  <select
                    value={gender}
                    defaultValue="-None-"
                    onChange={e => setGender(e.target.value)}
                    className="vf-form__select"
                  >
                    <option value={'None'}>None</option>
                    <option value={'Male'}>Male</option>
                    <option value={'Female'}>Female</option>
                    <option value={'Nonbinary'}>Nonbinary</option>
                    <option value={'Prefernottosay'}>Prefer not to say</option>
                  </select>
                </span>
              </div>
              <div className="vf-grid__col--span-3">
                <span>
                  <strong>Job title</strong>
                  <input
                    type="text"
                    id="jobTitle"
                    placeholder="Job title"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="vf-form__input"
                  />
                  <div className={jobTitleCalloutClass}>
                    <i>{jobTitleHelp}</i>
                  </div>
                </span>
                <span>
                  <strong>Qualification and background</strong>
                  <CKEditor
                    editor={ClassicEditor}
                    data={qualification}
                    onInit={editor => {}}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setQualification(data);
                    }}
                    className="vf-form__input"
                  />
                </span>

                <br />
                <span>
                  <strong>Activities of current role</strong>
                  <CKEditor
                    editor={ClassicEditor}
                    data={currentRole}
                    onInit={editor => {}}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setCurrentRole(data);
                    }}
                    className="vf-form__input"
                  />
                </span>

                <br />
                <span>
                  <strong>Additional information</strong>
                  <CKEditor
                    editor={ClassicEditor}
                    data={additionalInfo}
                    onInit={editor => {}}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setAdditionalInfo(data);
                    }}
                    className="vf-form__input"
                  />
                </span>

                <span>
                  <strong>Publishing status</strong>
                  <select
                    value={publishStatus}
                    defaultValue="-None-"
                    onChange={e => setPublishStatus(e.target.value)}
                    className="vf-form__select"
                  >
                    <option value={'Draft'}>Draft</option>
                    <option value={'Live'}>Live</option>
                  </select>
                </span>
              </div>
            </div>

            <div className="row">
              <div className="column large-4">
                <br />
                <br />
              </div>
              <div className="column large-8" />
            </div>

            <p />
            <div className="row">
              <div className="column medium-2" />
              <div className="column medium-3">
                <ButtonLabel />
              </div>
              <div className="column medium-7" />
            </div>
          </form>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export const EditProfile = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/edit/:id"
      component={ProfileEdit}
    />
  </Switch>
);

export default EditProfile;
