from rdflib import Graph, Namespace

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
