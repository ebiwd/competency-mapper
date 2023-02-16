import React from 'react';
import masterList from './masterList.json';
import { apiUrl } from '../services/http/http';

const sitemapGenerator = () => {
  var sitemap = '';
  const generate = () => {
    sitemap = `<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'><url><loc>https://competency.ebi.ac.uk</loc></url>`;
    sitemap += `<url><loc>https://competency.ebi.ac.uk/about</loc></url>`;
    sitemap += `<url><loc>https://competency.ebi.ac.uk/develop-your-coures</loc></url>`;
    sitemap += `<url><loc>https://competency.ebi.ac.uk/documentation</loc></url>`;
    masterList.map(async item => {
      sitemap += `<url><loc>${item.url}</loc></url>`;
      const temp = async () => {
        // Get profiles
        let profile_links = '';
        const profiles = await getProfilesLinks(item.title, item.version);
        if (profiles.length > 0) {
          profiles.map(profile => {
            profile_links += `<url><loc>https://competency.ebi.ac.uk/framework/${
              item.title
            }/${item.version}/profile/view/${profile.id}${
              profile.url_alias
            }</loc></url>`;
          });
        }
        // Add profiles to sitemap
        sitemap += profile_links;

        // Get competencies
        let competency_links = '';
        const framework = await getCompetencyLinks(item.title, item.version);
        if (framework.length > 0) {
          framework.map(data => {
            data.domains.map(domain => {
              domain.competencies.map(competency => {
                competency_links += `<url><loc>https://competency.ebi.ac.uk/framework/${
                  item.title
                }/${item.version}/competency/details/${
                  competency.id
                }</loc></url>`;
              });
            });
          });
        }

        // Add competencies to sitemap
        sitemap += competency_links;

        // Get training resources
        let resource_links = '';
        const resources = await getResourceLinks(item.title);
        if (resources.length > 0) {
          resources.map(resource => {
            let url = resource.view_node.replace(
              '/training',
              '/training-resources'
            );
            resource_links += `<url><loc>https://competency.ebi.ac.uk${url}</loc></url>`;
          });
        }

        // Add resources to sitemap
        sitemap += resource_links;

        console.log(sitemap);
      };
      await temp();
    });
    sitemap += `</urlset>`;
    // console.log(sitemap);
  };
  generate();
};

const getProfilesLinks = async (framework, version) => {
  const results = await fetch(
    `${apiUrl}/api/${framework}/${version}/profiles/?_format=json&source=competencyhub`
  )
    .then(Response => Response.json())
    .then(findresponse => {
      return findresponse;
    });
  return results;
};

const getCompetencyLinks = async (framework, version) => {
  const results = await fetch(
    `${apiUrl}/api/${framework}/${version}/?_format=json&source=competencyhub`
  )
    .then(Response => Response.json())
    .then(findresponse => {
      return findresponse;
    });
  return results;
};

const getResourceLinks = async framework => {
  const results = await fetch(
    `${apiUrl}/api/v1/all-training-resources?_format=json&source=competencyhub`
  )
    .then(Response => Response.json())
    .then(findresponse => {
      return findresponse;
    });
  return results;
};

export default sitemapGenerator();
