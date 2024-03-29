import { apiUrl } from '../http/http';

class DownloadService {
  static getProfile({
    title,
    frameworkId,
    frameworkUuid,
    age,
    currentRole,
    gender,
    jobTitle,
    qualification,
    fileid
  }) {
    return {
      _links: {
        type: {
          href: `${apiUrl}/rest/type/node/profile`
        },
        [`${apiUrl}/rest/relation/node/profile/field_competency_framework`]: {
          href: `${apiUrl}/node/${frameworkId}?_format=hal_json`
        }
      },
      title: [
        {
          value: title
        }
      ],
      field_age: [
        {
          value: age
        }
      ],
      field_current_role: [
        {
          value: currentRole,
          format: 'basic_html'
        }
      ],
      field_gender: [
        {
          value: gender
        }
      ],
      field_job_title: [
        {
          value: jobTitle
        }
      ],
      field_qualification_background: [
        {
          value: qualification
        }
      ],
      field_image: [
        {
          target_id: fileid,
          description: 'persona picture'
        }
      ],
      type: [
        {
          target_id: 'profile'
        }
      ],
      _embedded: {
        [`${apiUrl}/rest/relation/node/profile/field_competency_framework`]: [
          {
            _links: {
              self: {
                href: `${apiUrl}/node/${frameworkId}?_format=hal_json`
              },
              type: {
                href: `${apiUrl}/rest/type/node/competency_framework`
              }
            },
            uuid: [
              {
                value: frameworkUuid
              }
            ],
            lang: 'en'
          }
        ]
      }
    };
  }
}

export default DownloadService;
