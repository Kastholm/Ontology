import { writeFileSync } from "fs";
import {apis, apiModel, singleArticle} from "./ontologyData";
const ontologiIRI: string =
  "https://pengehjoernet.dk/";


  const generateClasses = () => {
    return '#Classes\n' + apis
      .map((element: apiModel) => 
        `ex:${element.class} rdf:type owl:Class .`)
      .join("\n");
  };
  const TurtleClasses = generateClasses();


  ex:artiklerUdenJournalist rdf:type owl:Class ;
  rdfs:subClassOf ex:artikel .

  const generateSubClasses = () => {
    return apis
      .filter((element: apiModel) => element.subClasses)
      .map((element: apiModel) => {
        return element
          .subClasses!.map((subClass) => {
            return (
              `ex:${subClass.subClass} rdf:type owl:Class ;
              ` +
              `rdfs:subClassOf ex:${element.class} .
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
                          <owl:onProperty rdf:resource="${ontologiIRI}${subClass.property}"/>
                          <owl:someValuesFrom rdf:resource="${ontologiIRI}${subClass.restriction}"/>
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






async function generateTurtle() {

const Turtledocument = 
`@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix ex: <https://pengehjoernet.dk/> .
@prefix article: <https://pengehjoernet.dk/artikel/> .
@prefix kategori: <https://pengehjoernet.dk/kategori/> .
@prefix journalist: <https://pengehjoernet.dk/journalist/> .
@prefix tag: <https://pengehjoernet.dk/tag/> .
${TurtleClasses}
`;
    
    writeFileSync('turtle.ttl', Turtledocument, 'utf8');

}

generateTurtle();