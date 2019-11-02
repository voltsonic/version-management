"use strict";

const path = require("path");
const StaticFormatters = require("../../Statics/Formatters");
const GenericVersionTemplate = require("../../Templates/GenericVersionTemplate");

class DeveloperTemplateModule {
    static dotenv(
        _root,
        envFile = '.env')
    {
        return GenericVersionTemplate.simpleReplace(
            _root,
            (typeof envFile === "array"?envFile:[envFile]),
            GenericVersionTemplate._node(
                new RegExp('APP_VERSION='+StaticFormatters.searchers.dots, 'i'),
                'APP_VERSION='+StaticFormatters.replacers.dots
            ),
            'DeveloperTemplateModule.dotenv'
        );
    }
    
    static changelog_hotfixUrls(_root, baseUri, changelogFile = 'CHANGELOG.md', ruleKey = 'DeveloperTemplateModule.changelog_hotfixUrls'){
        baseUri = baseUri.replace(/\.git$/, '');
        let regexUri = baseUri.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return GenericVersionTemplate.simpleReplace(
            _root,
            [ changelogFile ],
            {
                ['\\[Hotfixed]: '+regexUri+'\/compare\/v'+StaticFormatters.searchers.dots+'...master']
                    : "[Hotfixed]: "+baseUri+"/compare/v"+StaticFormatters.replacers.dots+"...master"
            },
            ruleKey
        );
    }
    static changelog_hotfixUrls_NodePackage(_root, changelogFile = 'CHANGELOG.md', packageFile = 'package.json'){
        return this.changelog_hotfixUrls(
            _root,
            require(path.join(_root, packageFile)).repository.url,
            changelogFile,
            'DeveloperTemplateModule.changelog_hotfixUrls_NodePackage'
        );
    }
}

module.exports = DeveloperTemplateModule;
