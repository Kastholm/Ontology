from rdflib import Graph, Namespace
import json

# Opret en ny Graph instans
g = Graph()

g.bind("rdf", Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#"))
g.bind("rdfs", Namespace("http://www.w3.org/2000/01/rdf-schema#"))
g.bind("owl", Namespace("http://www.w3.org/2002/07/owl#"))
g.bind("xsd", Namespace("http://www.w3.org/2001/XMLSchema#"))
g.bind("ex", Namespace("https://pengehjoernet.dk/"))
g.bind("article", Namespace("https://pengehjoernet.dk/artikel/"))
g.bind("kategori", Namespace("https://pengehjoernet.dk/kategori/"))
g.bind("journalist", Namespace("https://pengehjoernet.dk/journalist/"))
g.bind("tag", Namespace("https://pengehjoernet.dk/tag/"))

# Læs RDF/XML filen
g.parse("output.xml", format="xml")

# Gem som Turtle format
g.serialize("output.ttl", format="turtle")


g.parse("output.ttl", format="turtle")

query = """
SELECT ?article WHERE {
   ?article a ex:publiceretArtikel ,
              ex:artikelUdenKategori .
} LIMIT 100
"""

result = g.query(query)
noCategories = []
for row in result:
        article_url = str(row.article)
        noCategories.append(article_url)

with open('./data/noCategories.json', 'w') as file:
    json.dump(noCategories, file, indent=2)


query = """
SELECT ?article WHERE {
   ?article a ex:publiceretArtikel ,
              ex:artikelUdenTag .
} LIMIT 100
"""

result = g.query(query)
noTags = []
for row in result:
        article_url = str(row.article)
        noTags.append(article_url)

with open('./data/noTags.json', 'w') as file:
    json.dump(noTags, file, indent=2)

query = """
SELECT ?article WHERE {
   ?article a ex:publiceretArtikel ,
              ex:artikelUdenJournalist .
} LIMIT 100
"""
result = g.query(query)
noJournalists = []
for row in result:
        article_url = str(row.article)
        noJournalists.append(article_url)

with open('./data/noJournalists.json', 'w') as file:
    json.dump(noJournalists, file, indent=2)