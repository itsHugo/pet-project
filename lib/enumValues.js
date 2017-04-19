"use strict";
class EnumValues {
    static getNamesAndValues(e) {
        return this.getNames(e).map(_name => { return { name: _name, value: e[_name] }; });
    }
    static getNames(e) {
        return this.getObjectValues(e).filter(v => typeof v === "string");
    }
    static getValues(e) {
        return this.getObjectValues(e).filter(v => typeof v === "number");
    }
    static getObjectValues(e) {
        return Object.keys(e).map(k => e[k]);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EnumValues;
//# sourceMappingURL=enumValues.js.map