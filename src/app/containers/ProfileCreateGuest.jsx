import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import FileUpload from './FileUpload';
import HttpService from '../services/http/http';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
//import ActiveRequestsService from '../services/active-requests/active-requests';
//import { Link, Redirect } from 'react-router-dom';
import GuestHelp from './GuestHelp';

export const ProfileCreateGuest = props => {
  const history = useHistory();
  const profileService = new ProfileService();
  const [title, setTitle] = useState('');
  const [age, setAge] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [gender, setGender] = useState('');

  const [selectedFile, setSelectedFile] = useState();
  const [selectedFileData, setSelectedFileData] = useState([]);
  const [imgpreview, setImgpreview] = useState();
  const [fileSizeError, setFileSizeError] = useState();
  const [fileTypeError, setFileTypeError] = useState();

  const [jobTitle, setJobTitle] = useState('');
  const [qualification, setQualification] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [framework, setFramework] = useState();
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];

  const [profile, setProfile] = useState();
  const [modalOpen, setModelOpen] = useState(false);

  const http = new HttpService();
  const storedProfile = JSON.parse(localStorage.getItem('guestProfile'));

  useEffect(() => {
    // Set variables from Local Storage to populate form fields onload
    let bootstrap = async () => {
      setProfile(storedProfile);
      setTitle(storedProfile.title);
      setJobTitle(storedProfile.job_title);
      setAge(parseInt(storedProfile.age));
      setGender(storedProfile.gender);
      setQualification(storedProfile.qualification_background);
      setCurrentRole(storedProfile.current_role);
      setAdditionalInfo(storedProfile.additional_information);
      if (storedProfile.image[0]) {
        setSelectedFileData(storedProfile.image);
        setImgpreview(storedProfile.image[0].url);
      }
    };

    // Calling multiple APIs, since data Framework are in two different endpoints
    const fetchData = async () => {
      try {
        const promise1 = http
          .get(
            `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json`
          )
          .then(response1 => response1.data);

        const promise2 = http
          .get(`${apiUrl}/api/version_manager?_format=json`)
          .then(response2 => response2.data);

        const [data1] = await Promise.all([promise1, promise2]);
        setFramework(data1);
      } catch (err) {
        console.log(err);
      }
    };

    if (storedProfile && !profile) {
      bootstrap();
    }

    if (!framework) {
      fetchData();
    }
  }, [
    selectedFile,
    frameworkName,
    frameworkVersion,
    http,
    storedProfile,
    framework,
    profile
  ]);

  const handleSubmit = async evt => {
    evt.preventDefault();
    let frameworkId = framework[0].nid;
    let versionNumber = frameworkVersion;

    // Do nothing if Form doesn't pass validation criteris above
    if (
      !title ||
      !jobTitle ||
      title.length < 2 ||
      jobTitle.length < 3 ||
      fileTypeError ||
      fileSizeError
    ) {
      return 0;
    }
    // Check if is Anonymous/Authenticated
    else if (!localStorage.getItem('roles')) {
      let current_role = currentRole ? currentRole : '';
      let job_title = jobTitle ? jobTitle : '';
      let qualification_background = qualification ? qualification : '';
      let additional_information = additionalInfo ? additionalInfo : '';
      let image = selectedFileData ? selectedFileData : '';

      profileService.createGuestProfile(
        frameworkName,
        frameworkId,
        versionNumber,
        title,
        age,
        current_role,
        gender,
        job_title,
        qualification_background,
        additional_information,
        image
      );
      history.push(
        `/framework/${frameworkName}/${frameworkVersion}/profile/view/guest/`
      );
    }
  };

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    } else {
      //const objectUrl = URL.createObjectURL(e.target.files[0]);

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

      // convert image file to base64 string. From https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        function() {
          // Set Image Preview
          setImgpreview(reader.result);

          // Set selected image src
          let img = new Image();
          img.src = reader.result;
          img.addEventListener('load', function() {
            img.width = this.width;
            img.height = this.height;

            setSelectedFileData([
              {
                url: this.src
              }
            ]);
          });
        },
        false
      );
      if (e.target.files) {
        reader.readAsDataURL(e.target.files[0]);
      }

      setSelectedFile(e.target.files[0]);
    }
  };

  const clearimgpreview = e => {
    e.preventDefault();
    setSelectedFile(undefined);
    setImgpreview(undefined);
    setFileTypeError(undefined);
    setFileSizeError(undefined);
    setSelectedFileData(undefined);
    document.getElementById('fileupload').value = '';
  };

  function ButtonLabel() {
    let submitButtonLabel = 'Save and continue';
    if (!localStorage.getItem('roles')) {
      submitButtonLabel = 'Save and Map Competencies';
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

  const openModal = e => {
    e.preventDefault();
    setModelOpen(true);
  };

  const closeModal = () => {
    //e.preventDefault();
    setModelOpen(false);
  };

  return (
    <div>
      <h2>Create / Edit {placeholder} profile</h2>
      <div className="callout warning">
        <i className="icon icon-common icon-exclamation-triangle" /> Your
        profile will be saved in your browser.
        <button className="vf-button vf-button--sm" onClick={e => openModal(e)}>
          Get help
        </button>
        <GuestHelp modalOpen={modalOpen} closeModal={closeModal} />
      </div>
      <form
        className="vf-form"
        id="profile_create_form"
        onSubmit={handleSubmit}
      >
        <div className="vf-grid vf-grid__col-6">
          <div className="vf-grid__col--span-2">
            <span>
              <strong>Name</strong>
              <input
                type="text"
                id="title"
                placeholder="Name"
                onChange={e => setTitle(e.target.value)}
                defaultValue={profile ? profile.title : ''}
                className="vf-form__input"
              />
              <div className={titleCalloutClass}>
                <i>{nameHelp}</i>
              </div>
            </span>
            <div className="vf-u-margin__bottom--600" />
            <span>
              <strong>Image</strong>
              <input type="file" id="fileupload" onChange={onSelectFile} />
            </span>
            <div className="vf-u-margin__bottom--600" />
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
                  <button
                    className="vf-button vf-button--secondary vf-button--sm"
                    href="#"
                    onClick={e => clearimgpreview(e)}
                  >
                    Clear image x
                  </button>
                </div>
              ) : (
                ''
              )}
              <div className="vf-u-margin__bottom--600" />
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
            <div className="vf-u-margin__bottom--600" />
            <span>
              <strong>Age (in years)</strong>
              <input
                type="number"
                id="age"
                placeholder="Age"
                width={4}
                onChange={e => setAge(e.target.value)}
                defaultValue={profile ? profile.age : ''}
                className="vf-form__input"
              />
            </span>
            <div className="vf-u-margin__bottom--600" />
            <span>
              <strong>Gender</strong>
              <select
                onChange={e => setGender(e.target.value)}
                //defaultValue={gender?gender:'-None-'}
                value={gender ? gender : '-None-'}
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
          <div className="vf-grid__col--span-4">
            <span>
              <strong>Job title</strong>
              <input
                type="text"
                id="jobTitle"
                placeholder="Job title"
                onChange={e => setJobTitle(e.target.value)}
                defaultValue={profile ? profile.job_title : ''}
                className="vf-form__input"
              />
              <div className={jobTitleCalloutClass}>
                <i>{jobTitleHelp}</i>
              </div>
            </span>
            <div className="vf-u-margin__bottom--600" />
            <span>
              <strong>Qualification and background</strong>
              <CKEditor
                editor={ClassicEditor}
                data={
                  storedProfile ? storedProfile.qualification_background : ''
                }
                onInit={editor => {}}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setQualification(data);
                }}
                className="vf-form__input"
              />
            </span>

            <div className="vf-u-margin__bottom--600" />
            <span>
              <strong>Activities of current role</strong>
              <CKEditor
                editor={ClassicEditor}
                data={storedProfile ? storedProfile.current_role : ''}
                onInit={editor => {}}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setCurrentRole(data);
                }}
                className="vf-form__input"
              />
            </span>

            <div className="vf-u-margin__bottom--600" />
            <span>
              <strong>Additional information</strong>
              <CKEditor
                editor={ClassicEditor}
                data={storedProfile ? storedProfile.additional_information : ''}
                onInit={editor => {}}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setAdditionalInfo(data);
                }}
                className="vf-form__input"
              />
            </span>
          </div>
        </div>
        <ButtonLabel />
      </form>
    </div>
  );
};

export const Path = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/create/guest"
      component={ProfileCreateGuest}
    />
  </Switch>
);

export default Path;
