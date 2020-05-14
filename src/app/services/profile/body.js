import { apiUrl } from '../http/http';

class BodyService {
  static createProfile({
    title,
    frameworkId,
    frameworkUuid,
    versionID,
    age,
    current_role,
    gender,
    job_title,
    qualification_background,
    additional_information,
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
      field_versions: [
        {
          target_id: versionID
        }
      ],
      field_age: [
        {
          value: age
        }
      ],
      field_current_role: [
        {
          value: current_role,
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
          value: job_title
        }
      ],
      field_qualification_background: [
        {
          value: qualification_background
        }
      ],
      field_additional_information: [
        {
          value: additional_information
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
    current_role,
    gender,
    job_title,
    qualification_background,
    additional_information,
    // publish_status,
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
          value: current_role,
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
          value: job_title
        }
      ],
      field_qualification_background: [
        {
          value: qualification_background,
          format: 'basic_html'
        }
      ],
      field_additional_information: [
        {
          value: additional_information,
          format: 'basic_html'
        }
      ],
      field_image: [
        {
          target_id: fileid ? fileid : null
          //description: 'persona picture'
        }
      ],
      // field_publishing_status: [
      //   {
      //     value: publish_status
      //   }
      // ],
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
        expertise: item.expertise,
        attributes: item.attributes.join()
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
