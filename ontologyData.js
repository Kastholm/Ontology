"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apis = void 0;
const ontologiIRI = "https://pengehjoernet.dk/";
exports.apis = [
    {
        class: "kategorier",
        slug: "/kategorier",
        query: `
        *[_type == "category"] {
        _id,
        name,
        "slug": slug.current,
      }`,
    },
    {
        class: "tags",
        slug: "/tags",
        query: `*[_type == "tag"] {
        _id,
        name,
        "slug": slug.current,
      }`,
    },
    {
        class: "journalister",
        slug: "/journalister",
        query: `*[_type == "journalist"] {
        _id,
        name,
        "slug": slug.current
      }`,
    },
    {
        class: "artikel",
        slug: "",
        subClasses: [
            {
                subClass: "artikelUdenKategori",
                restriction: "kategorier",
                property: "harKategori",
            },
            {
                subClass: "artikelUdenJournalist",
                restriction: "journalister",
                property: "harJournalist",
            },
            {
                subClass: "artikelUdenTag",
                restriction: "tags",
                property: "harTag",
            },
            {
                subClass: "ikkePubliceretArtikel",
                disJoint: ["publiceretArtikel", "republiceretArtikel"],
                subClasses: [
                    {
                        subClass: "planlagtArtikel",
                        disJoint: ["publiceretArtikel"],
                    },
                ],
            },
            {
                subClass: "publiceretArtikel",
                disJoint: ["ikkePubliceretArtikel"],
                subClasses: [
                    {
                        subClass: "republiceretArtikel",
                        disJoint: ["ikkePubliceretArtikel"],
                    },
                ],
            },
        ],
        properties: [
            {
                name: "harId",
                type: "data",
                range: `http://www.w3.org/2001/XMLSchema#integer`,
                unionOf: [
                    {
                        union: "artikel",
                    },
                    {
                        union: "publiceretArtikel",
                    },
                    {
                        union: "republiceretArtikel",
                    },
                    {
                        union: "ikkePubliceretArtikel",
                    },
                    {
                        union: "planlagtArtikel",
                    },
                ],
            },
            {
                name: "publiceringsDato",
                type: "data",
                range: `http://www.w3.org/2001/XMLSchema#dateTime`,
                unionOf: [
                    {
                        union: "artikel",
                    },
                    {
                        union: "publiceretArtikel",
                    },
                    {
                        union: "republiceretArtikel",
                    },
                    {
                        union: "planlagtArtikel",
                    },
                ],
            },
            {
                name: "antalVisninger",
                type: "data",
                range: `http://www.w3.org/2001/XMLSchema#integer`,
                unionOf: [
                    {
                        union: "artikel",
                    },
                    {
                        union: "publiceretArtikel",
                    },
                    {
                        union: "republiceretArtikel",
                    },
                ],
            },
            {
                name: "harNytSlug",
                type: "data",
                range: `http://www.w3.org/2001/XMLSchema#string`,
                unionOf: [
                    {
                        union: "artikel",
                    },
                    {
                        union: "republiceretArtikel",
                    },
                ],
            },
            {
                name: "harGammelSlug",
                type: "data",
                range: `http://www.w3.org/2001/XMLSchema#string`,
                unionOf: [
                    {
                        union: "artikel",
                    },
                    {
                        union: "republiceretArtikel",
                    },
                ],
            },
            {
                name: "harKategori",
                type: "object",
                range: `${ontologiIRI}kategorier`,
                unionOf: [
                    { union: "artikel" },
                    { union: "publiceretArtikel" },
                    { union: "republiceretArtikel" },
                    { union: "planlagtArtikel" },
                ],
            },
            {
                name: "harJournalist",
                type: "object",
                range: `${ontologiIRI}journalister`,
                unionOf: [
                    { union: "artikel" },
                    { union: "publiceretArtikel" },
                    { union: "republiceretArtikel" },
                    { union: "planlagtArtikel" },
                ],
            },
            {
                name: "harTag",
                type: "object",
                range: `${ontologiIRI}tags`,
                unionOf: [
                    { union: "artikel" },
                    { union: "publiceretArtikel" },
                    { union: "republiceretArtikel" },
                    { union: "planlagtArtikel" },
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
