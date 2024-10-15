import { writeFileSync } from "fs";
import {apis, apiModel, singleArticle} from "./ontologyData";
const ontologiIRI: string =
  "https://pengehjoernet.dk/";

const generateClasses = () => {
  return apis
    .map((element: apiModel) => `<owl:Class rdf:about="${ontologiIRI}${element.class}"/>`)
    .join("\n");
};
const XmlClasses = generateClasses();


const generateSubClasses = () => {
  return apis
    .filter((element: apiModel) => element.subClasses)
    .map((element: apiModel) => {
      return element
        .subClasses!.map((subClass) => {
          return (
            `<owl:Class rdf:about="${ontologiIRI}${subClass.subClass}">
            ` +
            `<rdfs:subClassOf rdf:resource="${ontologiIRI}${element.class}"/>
            ` +
            (subClass.disJoint
              ? subClass.disJoint.map((element) => 
                `<owl:disjointWith rdf:resource="${ontologiIRI}${element}"/>`
                ).join('')
              : "") +
            (subClass.restriction
              ? `
                <owl:complementOf>
                    <owl:Restriction>
                        <owl:onProperty rdf:resource="${ontologiIRI}${subClass.restriction}"/>
                        <owl:someValuesFrom rdf:resource="${ontologiIRI}${subClass.property}"/>
                    </owl:Restriction>
                </owl:complementOf>
                `
              : "") +
            `</owl:Class>` + 
            `${subClass.subClasses ? (
                subClass.subClasses.map((sub) => (
                    `<owl:Class rdf:about="${ontologiIRI}${sub.subClass}">
                    <rdfs:subClassOf rdf:resource="${ontologiIRI}${subClass.subClass}"/>
                    ${
                    subClass.disJoint 
                    ? subClass.disJoint.map((element) => 
                    `<owl:disjointWith rdf:resource="${ontologiIRI}${element}"/>`
                    ).join('')
                    : ''
                    }
                </owl:Class>`
                ))
           ) : ''}`
          );
        })
        .join("\n");
    })
    .join("\n");
};
const XmlSubClasses = generateSubClasses();


const generateProperties = () => {
  return apis
    .filter((element: apiModel) => element.properties)
    .map((element: apiModel) => {
      return element.properties!.map((element) => {
        let propertyXML = `<owl:${element.type === 'data' ? 'Datatype' : 'Object'}Property rdf:about="${ontologiIRI}${element.name}">
                <rdfs:domain>
                    <owl:Class>
                        <owl:unionOf rdf:parseType="Collection">`;
        element.unionOf.forEach((unionItem) => {
          propertyXML += `<rdf:Description rdf:about="${ontologiIRI}${unionItem.union}"/>\n`;
        });
        propertyXML += `</owl:unionOf>
            </owl:Class>
        </rdfs:domain>
        ${
            element.range ? (`<rdfs:range rdf:resource="${element.range}"/>`) :
            element.inverseOf ? (`<owl:inverseOf rdf:resource="${element.inverseOf}"/>`) :
            '' 
        }
    </owl:${element.type === 'data' ? 'Datatype' : 'Object'}Property>\n`;
        return propertyXML;
      }).join('');
    }).join('');
};
const XmlProperties = generateProperties();


async function getData(query: string) {
    const url = `https://ikbzpczn.api.sanity.io/v1/data/query/production?query=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

const sanitizeForXML = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '')
      .replace(/>/g, '')
      .replace(/"/g, '')
      .replace(/\s/g, '_')
      .replace(/\?/g, '') 
      .replace(/\%/g, 'p')
      .replace(/\$/g, 'd')
      .replace(/,/g, '')
      .replace(/\|/g, '')    
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/'/g, '')
};



const fetchCategories = async () => {
    let catNames = await getData(apis[0].query);
    let categoryXML: string = '';
    let slug: string = 'kategori/';
    
    catNames.result.forEach((element: any, index: number) => {
        categoryXML += `<owl:Class rdf:about="${ontologiIRI}${slug}${element.slug}">
        <rdfs:subClassOf rdf:resource="${ontologiIRI}${apis[0].class}"/>\n`;
        
            catNames.result.forEach((element: any, newIndex: number) => {
                if (index !== newIndex) {
                    categoryXML += `<owl:disjointWith rdf:resource="${ontologiIRI}${slug}${element.slug}"/>\n`;
                }
            })
        
        categoryXML += `</owl:Class>\n`;
        
    });
    return categoryXML;
};


const fetchTags = async () => {
  let tagNames = await getData(apis[1].query);
  let tagXML: string = '';
  let slug: string = 'tag/';

  tagNames.result.forEach((element: any) => {
      tagXML += 
          `
          <owl:Class rdf:about="${ontologiIRI}${slug}${element.slug}">
          <rdfs:subClassOf rdf:resource="${ontologiIRI}${apis[1].class}"/>
          </owl:Class>
          `
  });
  return tagXML;
};

  const fetchJournalists = async () => {
    let journalistNames = await getData(apis[2].query);
    let journalistXML: string = '';
    let slug: string = 'journalist/';

    journalistNames.result.forEach((element: any) => {
        journalistXML += `
        <owl:Class rdf:about="${ontologiIRI}${slug}${element.slug}">
          <rdfs:subClassOf rdf:resource="${ontologiIRI}${apis[2].class}"/>
        </owl:Class>
            `
    });
    return journalistXML;
  };

  const fetchArticles = async () => {
    let articles = await getData(apis[3].query);
    let articleXML: string = '';
    let slug: string = 'artikel/';

    articles.result.forEach((element: singleArticle) => {
        articleXML += 
        `<owl:NamedIndividual rdf:about="${ontologiIRI}${slug}${element.slug}">\n` + 
        `<rdf:type rdf:resource="${ontologiIRI}artikel"/>\n` +
        `<ontologi:harId rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${element._id}</ontologi:harId>\n` +
        `${ element.views ? (
                `<ontologi:antalVisninger rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${element.views}</ontologi:antalVisninger>\n`
            ) : (
                `<ontologi:antalVisninger rdf:datatype="http://www.w3.org/2001/XMLSchema#string">0</ontologi:antalVisninger>\n`
            )
        }` +
        `${ element.isPublished !== 0 && !element.previewMode ? (
            `<rdf:type rdf:resource="${ontologiIRI}publiceretArtikel"/>\n`
        ) : ( 
            `<rdf:type rdf:resource="${ontologiIRI}ikkePubliceretArtikel"/>\n` 
        ) }` +
        ` <ontologi:publiceringsDato rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime">${element.publishedAt}</ontologi:publiceringsDato>\n` +
        `${ element.categorySlug ? (
          `<rdf:type rdf:resource="${ontologiIRI}kategori/${element.categorySlug}"/>
           <ontologi:harKategori rdf:resource="${ontologiIRI}kategori/${element.categorySlug}"/>\n`
        ) : (
            `<rdf:type rdf:resource="${ontologiIRI}artikelUdenKategori"/>\n`
        ) }` +
        `${ element.JournalistSlug ? (
            `<rdf:type rdf:resource="${ontologiIRI}journalist/${element.JournalistSlug}"/>
             <ontologi:harJournalist rdf:resource="${ontologiIRI}journalist/${element.JournalistSlug}"/>\n`
        ) : (
            `<rdf:type rdf:resource="${ontologiIRI}artikelUdenJournalist"/>\n`
        )}` +
        `${ element.tagSlug ? (
                element.tagSlug.map((tag) => (
                  tag === null ? (
                  `<rdf:type rdf:resource="${ontologiIRI}artikelUdenTag"/>\n`
                  ) : (
                        `<rdf:type rdf:resource="${ontologiIRI}tag/${tag}"/>\n` +
                         `<ontologi:harTag rdf:resource="${ontologiIRI}tag/${tag}"/>\n`
                      )
                )).join('')
            ) : (
                `<rdf:type rdf:resource="${ontologiIRI}artikelUdenTag"/>\n`
            )}` +
        `${ element.republishArticle && element.newSlug ? (
            `<rdf:type rdf:resource="${ontologiIRI}republiceretArtikel"/>
             <ontologi:harNytSlug rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${element.newSlug}</ontologi:harNytSlug>\n`
        ) : (
          ''
        )}` +
        `${ element.oldSlugs ? (
            element.oldSlugs.map((slug) => {
              `<ontologi:harGammelSlug rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${slug}</ontologi:harGammelSlug>\n`
            }).join('')
        ) : (
          ''
        )}` +
        `</owl:NamedIndividual>\n`
    });

    return articleXML;

  }
    

async function generateXML() {
    const categories = await fetchCategories();
    const tags = await fetchTags();
    const journalists = await fetchJournalists();
    const articles = await fetchArticles();

    const XMLdocument = `
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
    xmlns:owl="http://www.w3.org/2002/07/owl#"
    xmlns:xml="http://www.w3.org/XML/1998/namespace"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
    xmlns:ontologi="${ontologiIRI}">
    ${XmlClasses}
    ${XmlSubClasses}
    ${XmlProperties}
    ${categories}
    ${journalists}
    ${tags}
    ${articles}
    </rdf:RDF>
    `;
    
    writeFileSync('output.xml', XMLdocument, 'utf8');

}

generateXML();