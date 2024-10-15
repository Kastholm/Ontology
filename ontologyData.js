"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apis = void 0;
const ontologiIRI = "http://www.semanticweb.org/marc/ontologies/2024/8/pengehjoernetXML#";
exports.apis = [
    {
        class: "Kategorier",
        query: `
        *[_type == "category"] {
        _id,
        name,
        "slug": slug.current,
      }`,
    },
    {
        class: "Tags",
        query: `*[_type == "tag"] {
        _id,
        name,
        "slug": slug.current,
      }`,
    },
    {
        class: "Journalister",
        query: `*[_type == "journalist"] {
        _id,
        name,
        "slug": slug.current
      }`,
    },
    {
        class: "Artikler",
        subClasses: [
            {
                subClass: "ArtiklerUdenKategori",
                restriction: "Kategorier",
            },
            {
                subClass: "ArtiklerUdenJournalist",
                restriction: "Journalister",
            },
            {
                subClass: "ArtiklerUdenTag",
                restriction: "Tags",
            },
            {
                subClass: "IkkePubliceretArtikel",
                disJoint: ["PubliceretArtikel", "RepubliceretArtikel"],
                subClasses: [
                    {
                        subClass: "PlanlagtArtikel",
                        disJoint: ["PubliceretArtikel"]
                    }
                ]
            },
            {
                subClass: "PubliceretArtikel",
                disJoint: ["IkkePubliceretArtikel"],
                subClasses: [
                    {
                        subClass: "RepubliceretArtikel",
                        disJoint: ["IkkePubliceretArtikel"]
                    }
                ]
            },
        ],
        properties: [
            {
                name: "harId",
                range: `http://www.w3.org/2001/XMLSchema#string`,
                unionOf: [
                    {
                        union: "Artikler",
                    },
                    {
                        union: "PubliceretArtikel",
                    },
                    {
                        union: "IkkePubliceretArtikel",
                    },
                ],
            },
            {
                name: "publiceringsDato",
                range: `http://www.w3.org/2001/XMLSchema#dateTime`,
                unionOf: [
                    {
                        union: "Artikler",
                    },
                    {
                        union: "PubliceretArtikel",
                    },
                ],
            },
            {
                name: "antalVisninger",
                range: `http://www.w3.org/2001/XMLSchema#integer`,
                unionOf: [
                    {
                        union: "Artikler",
                    },
                    {
                        union: "PubliceretArtikel",
                    },
                ],
            },
            {
                name: "harNytSlug",
                range: `http://www.w3.org/2001/XMLSchema#string`,
                unionOf: [
                    {
                        union: "Artikler",
                    },
                    {
                        union: "PubliceretArtikel",
                    },
                ],
            },
            {
                name: "harGammelSlug",
                range: `http://www.w3.org/2001/XMLSchema#string`,
                unionOf: [
                    {
                        union: "Artikler",
                    },
                    {
                        union: "PubliceretArtikel",
                    },
                ],
            },
        ],
        query: `
        *[_type == "article" || _id in path("drafts.**")] | order(_createdAt desc) {
            _id,
            publishedAt,
            title,
            "slug": slug.current,
            "newSlug": newSlug.current,
            "oldSlugs": oldSlugs[], 
            republishArticle,
            "category": category->name,
            "tag": tag[]->name,
            "JournalistName": journalist->name,
            isPublished,
            previewMode,
            views
            }`,
    },
];
