"use strict";

const StaticFormatters = require("../Statics/Formatters");
const path = require("path");

let Templates = [];

class GenericVersionTemplate {
    static _node(search, replace, returnArray = false, flags = 'ig'){
        search = typeof search !== "string"
            ?search:(new RegExp(search, flags));
        let r = { search, replace };
        return returnArray
            ?[r]
            :r;
    }

    /**
     * {search: string, replace: string}
     * [{search: string, replace: string}]
     * [[string, string],[string, string]]
     * {search:replace}
     *
     * @param rootDirectory
     * @param filesRelative
     * @param replacementsQuick
     * @param ruleKey
     * @returns {{files: *, replacements: *, type: string}}
     */
    static simpleReplace(
        rootDirectory,
        filesRelative,
        replacementsQuick,
        ruleKey = 'GenericVersionTemplate.simpleReplace'
    ){
        if(typeof filesRelative !== "object") filesRelative = [filesRelative];

        let files = filesRelative.map(
                    file => path.join(rootDirectory, file));

        let replacements = [];

        if(Object.keys(replacementsQuick).length === 2 &&
            replacementsQuick.hasOwnProperty("search") &&
            replacementsQuick.hasOwnProperty("replace"))
            replacementsQuick = [replacementsQuick];

        if(replacementsQuick[0]){
            if(replacementsQuick[0].search)
                replacements = replacementsQuick;
            else if(replacementsQuick[0][0])
                for(let replacersPre of replacementsQuick){
                    replacements.push(this._node(replacersPre[0], replacersPre[1]));
                }
        }else{
            for(let replaceKey in replacementsQuick){
                if(replacementsQuick.hasOwnProperty(replaceKey))
                    replacements.push(this._node(replaceKey, replacementsQuick[replaceKey]));
            }
        }

        return { 
            type: 'simple_replace',
            ruleKey,
            files, 
            replacements
        }
    }
    
    static jsonReplace(
        rootDirectory,
        files,
        ruleKey = 'GenericVersionTemplate.jsonReplace',
        jsonKeys = [
            {
                key: "version",
                value: StaticFormatters.replacers.dots
            }
        ]
    ){
        files = files.map(file => path.join(rootDirectory, file));
        return {
            type: 'json_key',
            ruleKey,
            files,
            jsonKeys
        };
    }
}

module.exports = GenericVersionTemplate;
