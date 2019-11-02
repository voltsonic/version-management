"use strict";

const StaticFormatters = require("../../../Statics/Formatters");
const GenericVersionTemplate = require("../../../Templates/GenericVersionTemplate");

class SymfonyTemplateModule {
    static standard(_root, envs = ['test'], envPattern = 'developers/scripts/configs/symfony/__env__/.env.local.php'){
        return GenericVersionTemplate.simpleReplace(
            _root,
            envs.map(e => envPattern.replace('__env__', e)),
            {
                ["'APP_VERSION' => '"+StaticFormatters.searchers.dots+"'"]: "'APP_VERSION' => '"+StaticFormatters.replacers.dots+"'",
                ["https://"+StaticFormatters.searchers.dash+"-dot-"]: "https://"+StaticFormatters.replacers.dash+"-dot-"
            },
            'SymfonyTemplateModule.standard'
        );
    }
}

module.exports = SymfonyTemplateModule;
