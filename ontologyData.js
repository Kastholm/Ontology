"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apis = void 0;
const ontologiIRI = "https://pengehjoernet.dk/";
exports.apis = [
    {
        class: "Kategorier",
        slug: "/kategorier",
        query: `
        *[_type == "category"] {
        _id,
        name,
        "slug": slug.current,
      }`,
    },
    {
        class: "Tags",
        slug: "/tags",
        query: `*[_type == "tag"] {
        _id,
        name,
        "slug": slug.current,
      }`,
    },
    {
        class: "Journalister",
        slug: "/journalister",
        query: `*[_type == "journalist"] {
        _id,
        name,
        "slug": slug.current
      }`,
    },
    {
        class: "Artikler",
        slug: "",
        subClasses: [
            {
                subClass: "ArtiklerUdenKategori",
                restriction: "Kategorier",
                property: "harKategori",
            },
            {
                subClass: "ArtiklerUdenJournalist",
                restriction: "Journalister",
                property: "harJournalist",
            },
            {
                subClass: "ArtiklerUdenTag",
                restriction: "Tags",
                property: "harTag",
            },
            {
                subClass: "IkkePubliceretArtikel",
                disJoint: ["PubliceretArtikel", "RepubliceretArtikel"],
                subClasses: [
                    {
                        subClass: "PlanlagtArtikel",
                        disJoint: ["PubliceretArtikel"],
                    },
                ],
            },
            {
                subClass: "PubliceretArtikel",
                disJoint: ["IkkePubliceretArtikel"],
                subClasses: [
                    {
                        subClass: "RepubliceretArtikel",
                        disJoint: ["IkkePubliceretArtikel"],
                    },
                ],
            },
        ],
        properties: [
            {
                name: "harId",
                type: "data",
                range: `http://www.w3.org/2001/XMLSchema#string`,
                unionOf: [
                    {
                        union: "Artikler",
                    },
                    {
                        union: "PubliceretArtikel",
                    },
                    {
                        union: "RepubliceretArtikel",
                    },
                    {
                        union: "IkkePubliceretArtikel",
                    },
                    {
                        union: "PlanlagtArtikel",
                    },
                ],
            },
            {
                name: "publiceringsDato",
                type: "data",
                range: `http://www.w3.org/2001/XMLSchema#dateTime`,
                unionOf: [
                    {
                        union: "Artikler",
                    },
                    {
                        union: "PubliceretArtikel",
                    },
                    {
                        union: "RepubliceretArtikel",
                    },
                    {
                        union: "PlanlagtArtikel",
                    },
                ],
            },
            {
                name: "antalVisninger",
                type: "data",
                range: `http://www.w3.org/2001/XMLSchema#integer`,
                unionOf: [
                    {
                        union: "Artikler",
                    },
                    {
                        union: "PubliceretArtikel",
                    },
                    {
                        union: "RepubliceretArtikel",
                    },
                ],
            },
            {
                name: "harNytSlug",
                type: "data",
                range: `http://www.w3.org/2001/XMLSchema#string`,
                unionOf: [
                    {
                        union: "Artikler",
                    },
                    {
                        union: "RepubliceretArtikel",
                    },
                ],
            },
            {
                name: "harGammelSlug",
                type: "data",
                range: `http://www.w3.org/2001/XMLSchema#string`,
                unionOf: [
                    {
                        union: "Artikler",
                    },
                    {
                        union: "RepubliceretArtikel",
                    },
                ],
            },
            {
                name: "harKategori",
                type: "object",
                range: `${ontologiIRI}Kategorier`,
                unionOf: [
                    { union: "Artikler" },
                    { union: "PubliceretArtikel" },
                    { union: "RepubliceretArtikel" },
                    { union: "PlanlagtArtikel" },
                ],
            },
            {
                name: "harJournalist",
                type: "object",
                range: `${ontologiIRI}Journalister`,
                unionOf: [
                    { union: "Artikler" },
                    { union: "PubliceretArtikel" },
                    { union: "RepubliceretArtikel" },
                    { union: "PlanlagtArtikel" },
                ],
            },
            {
                name: "harTag",
                type: "object",
                range: `${ontologiIRI}Tags`,
                unionOf: [
                    { union: "Artikler" },
                    { union: "PubliceretArtikel" },
                    { union: "RepubliceretArtikel" },
                    { union: "PlanlagtArtikel" },
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
            "categorySlug": category->slug.current,
            "tag": tag[]->name,
            "tagSlug": tag[]->slug.current,
            "JournalistName": journalist->name,
            "JournalistSlug": journalist->slug.current,
            isPublished,
            previewMode,
            views
            }`,
    },
];
