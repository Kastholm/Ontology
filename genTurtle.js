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
    return '#Classes\n' + ontologyData_1.apis
        .map((element) => `ex:${element.class} rdf:type owl:Class .`)
        .join("\n");
};
const TurtleClasses = generateClasses();
function generateTurtle() {
    return __awaiter(this, void 0, void 0, function* () {
        const Turtledocument = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
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
        (0, fs_1.writeFileSync)('turtle.ttl', Turtledocument, 'utf8');
    });
}
generateTurtle();
