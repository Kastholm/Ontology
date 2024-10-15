const ontologiIRI: string = "https://pengehjoernet.dk/";

export interface apiModel {
  class: string;
  slug: string;
  subClasses?: Array<{
    subClass: string;
    property?: string;
    disJoint?: string[];
    restriction?: string;
    subClasses?: Array<{
      subClass: string;
      disJoint?: string[];
      restriction?: string;
    }>;
  }>;
  properties?: Array<{
    name: string;
    type: string;
    range?: string;
    inverseOf?: string;
    unionOf: Array<{
      union: string;
    }>;
  }>;
  query: string;
}

export const apis: apiModel[] = [
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
        range: `http://www.w3.org/2001/XMLSchema#string`,
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

export interface singleArticle {
  _id: string;
  _createdAt: string;
  publishedAt: string;
  isPublished: number;
  _type: string;
  title: string;
  teaser: string;
  slug: string | "";
  newSlug: string | "";
  oldSlugs: string[];
  republishArticle: boolean;
  image: {};
  source: string;
  tag: string[];
  tagSlug: string[];
  category: string | "";
  categorySlug: string;
  JournalistName: string;
  JournalistSlug: string;
  facebookTitle: string;
  facebookDescription: string;
  facebookImage: {};
  overview: [];
  views: number | 0;
  disclaimer: boolean;
  dayInterval: number;
  startIndex: number;
  endIndex: number;
  reading: number;
  previewMode: boolean;
}
