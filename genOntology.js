"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const ontologyData_1 = require("./ontologyData");
const ontologiIRI = "https://pengehjoernet.dk/";
const generateClasses = () => {
    return ontologyData_1.apis
        .map((element) => `<owl:Class rdf:about="${ontologiIRI}${element.class}"/>`)
        .join("\n");
};
const XmlClasses = generateClasses();
const generateSubClasses = () => {
    return ontologyData_1.apis
        .filter((element) => element.subClasses)
        .map((element) => {
        return element
            .subClasses.map((subClass) => {
            return (`<owl:Class rdf:about="${ontologiIRI}${subClass.subClass}">
            ` +
                `<rdfs:subClassOf rdf:resource="${ontologiIRI}${element.class}"/>
            ` +
                (subClass.disJoint
                    ? subClass.disJoint.map((element) => `<owl:disjointWith rdf:resource="${ontologiIRI}${element}"/>`).join('')
                    : "") +
                (subClass.restriction
                    ? `
                <owl:complementOf>
                    <owl:Restriction>
                        <owl:onProperty rdf:resource="${ontologiIRI}${subClass.restriction}"/>
                        <owl:someValuesFrom rdf:resource="${ontologiIRI}${element.class}"/>
                    </owl:Restriction>
                </owl:complementOf>
                `
                    : "") +
                `</owl:Class>` +
                `${subClass.subClasses ? (subClass.subClasses.map((sub) => (`<owl:Class rdf:about="${ontologiIRI}${sub.subClass}">
                    <rdfs:subClassOf rdf:resource="${ontologiIRI}${subClass.subClass}"/>
                    ${subClass.disJoint
                    ? subClass.disJoint.map((element) => `<owl:disjointWith rdf:resource="${ontologiIRI}${element}"/>`).join('')
                    : ''}
                </owl:Class>`))) : ''}`);
        })
            .join("\n");
    })
        .join("\n");
};
const XmlSubClasses = generateSubClasses();
const generateProperties = () => {
    return ontologyData_1.apis
        .filter((element) => element.properties)
        .map((element) => {
        return element.properties.map((element) => {
            let propertyXML = `<owl:ObjectProperty rdf:about="${ontologiIRI}${element.name}">
                <rdfs:domain>
                    <owl:Class>
                        <owl:unionOf rdf:parseType="Collection">`;
            element.unionOf.forEach((unionItem) => {
                propertyXML += `<rdf:Description rdf:about="${ontologiIRI}${unionItem.union}"/>\n`;
            });
            propertyXML += `</owl:unionOf>
            </owl:Class>
        </rdfs:domain>
        ${element.range ? (`<rdfs:range rdf:resource="${element.range}"/>`) :
                element.inverseOf ? (`<owl:inverseOf rdf:resource="${element.inverseOf}"/>`) :
                    ''}
    </owl:ObjectProperty>\n`;
            return propertyXML;
        }).join('');
    }).join('');
};
const XmlProperties = generateProperties();
function getData(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://ikbzpczn.api.sanity.io/v1/data/query/production?query=${encodeURIComponent(query)}`;
        const res = yield fetch(url);
        const data = yield res.json();
        return data;
    });
}
const sanitizeForXML = (str) => {
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
        .replace(/'/g, '');
};
const fetchCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    let catNames = yield getData(ontologyData_1.apis[0].query);
    let categoryXML = '';
    let slug = 'kategori/';
    catNames.result.forEach((element, index) => {
        categoryXML += `<owl:Class rdf:about="${ontologiIRI}${slug}${element.slug}">
        <rdfs:subClassOf rdf:resource="${ontologiIRI}${ontologyData_1.apis[0].class}"/>\n`;
        catNames.result.forEach((element, newIndex) => {
            if (index !== newIndex) {
                categoryXML += `<owl:disjointWith rdf:resource="${ontologiIRI}${slug}${element.slug}"/>\n`;
            }
        });
        categoryXML += `</owl:Class>\n`;
    });
    return categoryXML;
});
const fetchTags = () => __awaiter(void 0, void 0, void 0, function* () {
    let tagNames = yield getData(ontologyData_1.apis[1].query);
    let tagXML = '';
    let slug = 'tag/';
    tagNames.result.forEach((element) => {
        tagXML +=
            `
          <owl:Class rdf:about="${ontologiIRI}${slug}${element.slug}">
          <rdfs:subClassOf rdf:resource="${ontologiIRI}${ontologyData_1.apis[1].class}"/>
          </owl:Class>
          `;
    });
    return tagXML;
});
const fetchJournalists = () => __awaiter(void 0, void 0, void 0, function* () {
    let journalistNames = yield getData(ontologyData_1.apis[2].query);
    let journalistXML = '';
    let slug = 'journalist/';
    journalistNames.result.forEach((element) => {
        journalistXML += `
        <owl:Class rdf:about="${ontologiIRI}${slug}${element.slug}">
          <rdfs:subClassOf rdf:resource="${ontologiIRI}${ontologyData_1.apis[2].class}"/>
        </owl:Class>
            `;
    });
    return journalistXML;
});
const fetchArticles = () => __awaiter(void 0, void 0, void 0, function* () {
    let articles = yield getData(ontologyData_1.apis[3].query);
    let articleXML = '';
    let slug = 'artikel/';
    articles.result.forEach((element) => {
        articleXML +=
            `<owl:NamedIndividual rdf:about="${ontologiIRI}${slug}${element.slug}">\n` +
                `<rdf:type rdf:resource="${ontologiIRI}Artikler"/>\n` +
                `<ontologi:harId rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${element._id}</ontologi:harId>\n` +
                `${element.views ? (`<ontologi:antalVisninger rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${element.views}</ontologi:antalVisninger>\n`) : (`<ontologi:antalVisninger rdf:datatype="http://www.w3.org/2001/XMLSchema#string">0</ontologi:antalVisninger>\n`)}` +
                `${element.isPublished !== 0 && !element.previewMode ? (`<rdf:type rdf:resource="${ontologiIRI}PubliceretArtikel"/>\n`) : (`<rdf:type rdf:resource="${ontologiIRI}IkkePubliceretArtikel"/>\n`)}` +
                ` <ontologi:publiceringsDato rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime">${element.publishedAt}</ontologi:publiceringsDato>\n` +
                `${element.categorySlug ? (`<rdf:type rdf:resource="${ontologiIRI}kategori/${element.categorySlug}"/>\n`) : (`<rdf:type rdf:resource="${ontologiIRI}ArtiklerUdenKategori"/>\n`)}` +
                `${element.JournalistSlug ? (`<rdf:type rdf:resource="${ontologiIRI}journalist/${element.JournalistSlug}"/>\n`) : (`<rdf:type rdf:resource="${ontologiIRI}ArtiklerUdenJournalist"/>\n`)}` +
                `${element.tagSlug ? (element.tagSlug.map((tag) => (tag === null ? (`<rdf:type rdf:resource="${ontologiIRI}ArtiklerUdenTag"/>\n`) : (`<rdf:type rdf:resource="${ontologiIRI}tag/${tag}"/>\n`))).join('')) : (`<rdf:type rdf:resource="${ontologiIRI}ArtiklerUdenTag"/>\n`)}` +
                `${element.republishArticle && element.newSlug ? (`<rdf:type rdf:resource="${ontologiIRI}RepubliceretArtikel"/>
             <ontologi:harNytSlug rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${element.newSlug}</ontologi:harNytSlug>\n`) : ('')}` +
                `${element.oldSlugs ? (element.oldSlugs.map((slug) => {
                    `<ontologi:harGammelSlug rdf:datatype="http://www.w3.org/2001/XMLSchema#string">${slug}</ontologi:harGammelSlug>\n`;
                }).join('')) : ('')}` +
                `</owl:NamedIndividual>\n`;
    });
    return articleXML;
});
function generateXML() {
    return __awaiter(this, void 0, void 0, function* () {
        const categories = yield fetchCategories();
        const tags = yield fetchTags();
        const journalists = yield fetchJournalists();
        const articles = yield fetchArticles();
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
        (0, fs_1.writeFileSync)('output.xml', XMLdocument, 'utf8');
    });
}
generateXML();
