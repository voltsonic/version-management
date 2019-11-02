"use strict";

module.exports = {
    replacers: {
        underscore  : '[currentVersion_Underscore]',
        dash        : '[currentVersion_Dash]',
        dots        : '[currentVersion]'
    },
    searchers: {
        underscore  : '[0-9]+_[0-9]+_[0-9]+',
        dash        : '[0-9]+-[0-9]+-[0-9]+',
        dots        : '[0-9]+\.[0-9]+\.[0-9]+'
    }
};