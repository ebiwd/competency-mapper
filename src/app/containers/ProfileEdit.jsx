import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileUpload from './FileUpload';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';

export const ProfileEdit = props => {
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];
  const profileId = props.location.pathname.split('/')[6];

  const [profile, setProfile] = useState();

  const activeRequests = new ActiveRequestsService();
  const profileService = new ProfileService();
  const [title, setTitle] = useState();
  const [age, setAge] = useState();
  const [currentRole, setCurrentRole] = useState();
  const [gender, setGender] = useState();

  const [selectedFile, setSelectedFile] = useState();
  const [fid, setFid] = useState();
  const [imgpreview, setImgpreview] = useState();

  const [jobTitle, setJobTitle] = useState();
  const [qualification, setQualification] = useState();

  const [framework, setFramework] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${apiUrl}/node/${profileId}?_format=json`)
        .then(Response => Response.json())
        .then(findresponse => {
          setProfile(findresponse);
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
        });
    };
    fetchData();
  }, [profileId]);

  const handleSubmit = async evt => {
    evt.preventDefault();
    let token = localStorage.getItem('csrf_token');
    var fileid = fid;
    if (selectedFile) {
      await fetch(
        apiUrl + '/file/upload/node/profile/field_image?_format=hal_json',
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
      fileid
    );

    if (response.nid[0].value) {
      props.history.push(
        `/framework/bioexcel/2.0/profile/view/${response.nid[0].value}`
      );
    }
  };

  const setPreview = () => {
    props.history.push('/framework/bioexcel/2.0/profile/preview', {
      title: title
    });
  };

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    } else {
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setImgpreview(objectUrl);
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearimgpreview = e => {
    e.preventDefault();
    setImgpreview(undefined);
    setFid(undefined);
    document.getElementById('fileupload').value = '';
  };

  return (
    <div>
      <div>
        <h2>Edit reference profile</h2>
        <Link to={`/framework/bioexcel/2.0/profile/view/${profileId}`}>
          {' '}
          View{' '}
        </Link>
        <form className="form" id="profile_create_form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="column large-12">
              <strong>Title</strong>
              <input
                type="text"
                id="title"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div id="fileupload" className="row">
            <div className="column large-3">
              <strong>Image</strong>
              <input type="file" id="imagefile" onChange={onSelectFile} />
            </div>
            <div className="column large-9">
              <img
                id="imgpreview_image"
                width="100px"
                src={imgpreview}
                height="100px"
                style={{
                  border: '1px solid #ccc',
                  padding: '5px',
                  width: '30%',
                  minHeight: '150px'
                }}
              />
              {imgpreview ? (
                <a href="#" onClick={e => clearimgpreview(e)}>
                  Clear image x
                </a>
              ) : (
                ''
              )}
            </div>
          </div>

          <div className="row">
            <div className="column large-12">
              <strong>Job title</strong>
              <input
                type="text"
                id="jobTitle"
                placeholder="Job title"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="column large-12">
              <strong>Age (in years)</strong>
              <input
                type="number"
                id="age"
                placeholder="Age"
                value={age}
                onChange={e => setAge(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="column large-12">
              <strong>Gender</strong>
              <select value={gender} onChange={e => setGender(e.target.value)}>
                <option value={'None'}>None</option>
                <option value={'Male'}>Male</option>
                <option value={'Female'}>Female</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="column large-12">
              <strong>Acitivities of current role</strong>
              <CKEditor
                editor={ClassicEditor}
                data={currentRole}
                onInit={editor => {}}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setCurrentRole(data);
                }}
              />
            </div>
          </div>

          <div className="row">
            <div className="column large-12">
              <strong>Qualification and background</strong>
              <CKEditor
                editor={ClassicEditor}
                data={qualification}
                onInit={editor => {}}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setQualification(data);
                }}
              />
            </div>
          </div>

          <p />
          <div className="row">
            <div className="column medium-2" />
            <div className="column medium-3">
              <input
                type="submit"
                className="button"
                value="Save and continue"
              />
            </div>
            <div className="column medium-7" />
          </div>
        </form>
      </div>
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
