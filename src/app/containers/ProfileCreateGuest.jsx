import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileUpload from './FileUpload';
import HttpService from '../services/http/http';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';
import GuestHelp from './GuestHelp';

export const ProfileCreateGuest = props => {
  const history = useHistory();
  const activeRequests = new ActiveRequestsService();
  const profileService = new ProfileService();
  const [title, setTitle] = useState('');
  const [age, setAge] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [gender, setGender] = useState('');

  const [selectedFile, setSelectedFile] = useState();
  const [selectedFileData, setSelectedFileData] = useState([]);
  const [fid, setFid] = useState();
  const [imgpreview, setImgpreview] = useState();
  const [fileSizeError, setFileSizeError] = useState();
  const [fileTypeError, setFileTypeError] = useState();

  const [jobTitle, setJobTitle] = useState('');
  const [qualification, setQualification] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [framework, setFramework] = useState();
  const [frameworkLogoData, setFrameworkLogoData] = useState([]);
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];

  const [profile, setProfile] = useState();

  const [errorMsgTitle, setErrorMsgTitle] = useState();
  const [errorMsgJobTitle, setErrorMsgJobTitle] = useState();

  const [frameworkMoreData, setFrameworkMoreData] = useState();

  const [modalOpen, setModelOpen] = useState(0);

  let errors = [];

  var storedProfile = JSON.parse(localStorage.getItem('guestProfile'));

  const http = new HttpService();

  useEffect(() => {
    // Set variables from Local Storage to populate form fields onload
    let bootstrap = async () => {
      await setProfile(storedProfile);

      if (storedProfile) {
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

        const [data1, data2] = await Promise.all([promise1, promise2]);
        setFramework(data1);
        setFrameworkMoreData(
          data2.filter(item => {
            return item.title.toLowerCase() === frameworkName;
          })
        );
      } catch (err) {
        console.log(err);
      }
    };

    bootstrap();
    fetchData();
  }, [selectedFile]);

  const handleSubmit = async evt => {
    evt.preventDefault();
    let frameworkId = framework[0].nid;
    //let frameworkName = framework[0].title;
    let frameworkUuid = framework[0].uuid;
    //console.log(frameworkMoreData);
    let liveVersion = frameworkMoreData[0].versions.find(
      ver => ver.status == 'live'
    );

    //let versionID = liveVersion.id;
    let versionNumber = frameworkVersion;
    var arrayBuffer = '';
    var fileid = null;

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
      setErrorMsgTitle('');
      setErrorMsgJobTitle('');

      // Retrieve values from Local Storage if exist
      let storedProfile = JSON.parse(
        localStorage.getItem('ProfileDownloadData')
      );

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

  const setPreview = () => {
    props.history.push(
      `/framework/${frameworkName}/${frameworkVersion}/profile/preview`,
      {
        title: title
      }
    );
  };

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
        e.target.files[0].type != 'image/jpeg' &&
        e.target.files[0].type != 'image/png'
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

    return <input type="submit" className="button" value={submitButtonLabel} />;
  }

  const getWhoCreateProfile = () => {
    let placeholder = 'a reference';
    if (!localStorage.getItem('roles')) {
      placeholder = 'your';
    }
    return placeholder;
  };

  // From https://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
  const getImageData = (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        return callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };

  const toDataURL = (src, callback, outputFormat) => {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      img.src = src;
    }
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
      <nav>
        <Link to={'/'}>Home</Link> /{' '}
        <Link to={`/framework/${frameworkName}/${frameworkVersion}`}>
          {' '}
          {frameworkName} {frameworkVersion}{' '}
        </Link>{' '}
      </nav>
      <h2>Create / Edit {placeholder} profile</h2>
      <div className="callout warning">
        <i class="icon icon-common icon-exclamation-triangle" /> Your profile
        will be saved in your browser. Click{' '}
        <a href="#" onClick={e => openModal(e)}>
          {' '}
          here{' '}
        </a>{' '}
        for help.
        <GuestHelp modalOpen={modalOpen} closeModal={closeModal} />
      </div>
      <form className="form" id="profile_create_form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="column large-4">
            <span>
              <strong>Name</strong>
              <input
                type="text"
                id="title"
                placeholder="Name"
                onChange={e => setTitle(e.target.value)}
                defaultValue={profile ? profile.title : ''}
              />
              <div className={titleCalloutClass}>
                <i>{nameHelp}</i>
              </div>
            </span>
          </div>
          <div className="column large-8">
            <span>
              <strong>Job title</strong>
              <input
                type="text"
                id="jobTitle"
                placeholder="Job title"
                onChange={e => setJobTitle(e.target.value)}
                defaultValue={profile ? profile.job_title : ''}
              />
              <div className={jobTitleCalloutClass}>
                <i>{jobTitleHelp}</i>
              </div>
            </span>
          </div>
        </div>

        <div className="row">
          <div className="column large-4">&nbsp;</div>
          <div className="column large-8" />
        </div>

        <div className="row">
          <div className="column large-4">
            <span>
              <strong>Image</strong>
              <input type="file" id="fileupload" onChange={onSelectFile} />
            </span>

            <span>
              <img
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
                  <a href="#" onClick={e => clearimgpreview(e)}>
                    Clear image x
                  </a>
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

            <br />
            <br />
            <span>
              <strong>Age (in years)</strong>
              <input
                type="number"
                id="age"
                placeholder="Age"
                width={4}
                onChange={e => setAge(e.target.value)}
                defaultValue={profile ? profile.age : ''}
              />
            </span>

            <span>
              <strong>Gender</strong>
              <select
                onChange={e => setGender(e.target.value)}
                //defaultValue={gender?gender:'-None-'}
                value={gender ? gender : '-None-'}
              >
                <option value={'None'}>None</option>
                <option value={'Male'}>Male</option>
                <option value={'Female'}>Female</option>
                <option value={'Nonbinary'}>Nonbinary</option>
                <option value={'Prefernottosay'}>Prefer not to say</option>
              </select>
            </span>
          </div>
          <div className="column large-8">
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
              />
            </span>

            <br />
            <span>
              <strong>Acitivities of current role</strong>
              <CKEditor
                editor={ClassicEditor}
                data={storedProfile ? storedProfile.current_role : ''}
                onInit={editor => {}}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setCurrentRole(data);
                }}
              />
            </span>

            <br />
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
              />
            </span>
            <br />
          </div>
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