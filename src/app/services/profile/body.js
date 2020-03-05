import { apiUrl } from '../http/http';

class BodyService {
  static createProfile({
    title,
    frameworkId,
    frameworkUuid,
    age,
    currentRole,
    gender,
    jobTitle,
    qualification,
    additionalInfo,
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
      field_additional_information: [
        {
          value: additionalInfo
        }
      ],
      field_image: [
        {
          target_id: fileid,
          description: 'persona picture'
        }
      ],
      field_publishing_status: [
        {
          value: 'Draft'
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

  static editProfile(
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
  ) {
    return {
      _links: {
        self: {
          href: `${apiUrl}/node/${profileId}?_format=hal_json`
        },
        type: {
          href: `${apiUrl}/rest/type/node/profile`
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
          value: qualification,
          format: 'basic_html'
        }
      ],
      field_additional_information: [
        {
          value: additionalInfo,
          format: 'basic_html'
        }
      ],
      field_image: [
        {
          target_id: fileid,
          description: 'persona picture'
        }
      ],
      field_publishing_status: [
        {
          value: publishStatus
        }
      ],
      type: [
        {
          target_id: 'profile'
        }
      ]
    };
  }

  static mapProfile(profileId, mapping) {
    let mappingBody = [];
    mapping.forEach(function(item) {
      mappingBody.push({
        competency: item.competency,
        expertise: item.expertise
      });
    });

    //  console.log(mappingBody)

    return {
      type: [
        {
          target_id: 'article'
        }
      ],
      field_item: [
        {
          value: profileId
        }
      ],
      field_profile_mapping: mappingBody
    };
  }
}

export default BodyService;
