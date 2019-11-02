"use strict";

const fs = require("fs");
const StaticFormatters = require("../Statics/Formatters");

let Templates = {};

let checkFileExists = (templateKey, fileSrc) => {
    if(fs.existsSync(fileSrc))
        return true;
    console.log('| Missing File ['+templateKey+'] '+fileSrc);
    return false;
};

let jsonReplaceKeys = (Object, Keys, Value) => {
    if(typeof(Keys) !== "object") Keys = [Keys];
    let next = Keys.shift();
    Object[next] = Keys.length === 0
        ?Value
        :jsonReplaceKeys(Object[next], Keys, Value);
    return Object;
};

let Prepares = {
    replacer: (versions, _val) => {
        while(_val.indexOf(StaticFormatters.replacers.dots) > -1)
            _val = _val.replace(StaticFormatters.replacers.dots, versions.dots);
        while(_val.indexOf(StaticFormatters.replacers.dash) > -1)
            _val = _val.replace(StaticFormatters.replacers.dash, versions.dash);
        while(_val.indexOf(StaticFormatters.replacers.underscore) > -1)
            _val = _val.replace(StaticFormatters.replacers.underscore, versions.underscore);
        return _val;
    }
};

class TemplateHandler {
    static simple_replace(versions, templateKey, file, replacers){
        let read = fs.readFileSync(file, "utf8");
        for(let replacer of replacers)
            read = read.replace(replacer.search, Prepares.replacer(versions, replacer.replace));
        fs.writeFileSync(file, read, "utf8");
        console.log('[x] Updated ['+templateKey+'] '+file);
    }
    static jsonKeys(versions, templateKey, file, replacers){
        let read = JSON.parse(fs.readFileSync(file, "utf8"));
        for(let replace of replacers)
            read = jsonReplaceKeys(read, replace.key, Prepares.replacer(versions, replace.value));
        fs.writeFileSync(file, JSON.stringify(read, null, 2)+(require('os').EOL), "utf8");
        console.log('[x] Updated ['+templateKey+'] '+file);
    }
    static run(versions, templateKey, file, type, template){
        switch(type){
            case 'json_key':
                this.jsonKeys(versions, templateKey, file, template.jsonKeys);
                break;
            case 'simple_replace':
                this.simple_replace(versions, templateKey, file, template.replacements);
                break;
            default:
                console.log('| Error: Unknown Handler Type: '+type);
        }
    }
}

class VersionTemplates {
    static addTemplate(rule){
        let ruleKey = rule.ruleKey;
        delete rule.ruleKey;
        if(Templates.hasOwnProperty(ruleKey))
            throw new Error("ruleKey already exists: "+ruleKey);
        Templates[ruleKey] = rule;
        return this;
    }
    static runTemplate(versions){
        Object.keys(Templates).forEach(templateKey => {
            if(Templates.hasOwnProperty(templateKey)){
                let tpl = Templates[templateKey];
                let files = tpl.files; delete tpl.files;
                let type = tpl.type; delete tpl.type;
                for(let _f of files){
                    if(checkFileExists(templateKey, _f))
                        TemplateHandler.run(versions, templateKey, _f, type, tpl);
                }
            }
        });
    }
}

module.exports = VersionTemplates;
