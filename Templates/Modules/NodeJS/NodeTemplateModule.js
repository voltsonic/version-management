"use strict";

const StaticFormatters = require("../../../Statics/Formatters");
const GenericVersionTemplate = require("../../../Templates/GenericVersionTemplate");

class NodeTemplateModule {
    static standard(rootDirectory, files = [
        'package.json',
        'package-lock.json'
    ]){
        return GenericVersionTemplate.jsonReplace(rootDirectory, files, 'NodeTemplateModule.standard');
    }
}

module.exports = NodeTemplateModule;
