"use strict";

const StaticFormatters = require("../../../Statics/Formatters");
const GenericVersionTemplate = require("../../../Templates/GenericVersionTemplate");

class ComposerTemplateModule {
    static standard(rootDirectory, files = ['composer.json']){
        return GenericVersionTemplate.jsonReplace(rootDirectory, files, 'ComposerTemplateModule.standard');
    }
}

module.exports = ComposerTemplateModule;
