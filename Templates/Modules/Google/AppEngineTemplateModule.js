"use strict";

const StaticFormatters = require("../../../Statics/Formatters");
const GenericVersionTemplate = require("../../../Templates/GenericVersionTemplate");

class AppEngineTemplateModule {
    static standard(
        rootDirectory,
        files = ['app_prod.yaml', 'app_test.yaml']
    ){
        return GenericVersionTemplate.simpleReplace(
            rootDirectory,
            files,
            [
                GenericVersionTemplate._node(
                    'APP_VERSION: '+StaticFormatters.searchers.dots,
                    'APP_VERSION: '+StaticFormatters.replacers.dots),
                GenericVersionTemplate._node(
                    'instance_tag: test--'+StaticFormatters.searchers.dash,
                    'instance_tag: test--'+StaticFormatters.replacers.dash)
            ],
            'AppEngineTemplateModule.standard'
        );
    }
}

module.exports = AppEngineTemplateModule;
