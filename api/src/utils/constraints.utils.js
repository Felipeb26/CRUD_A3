"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDates = exports.anyToDate = exports.ifNullNewValue = exports.verifyRoles = void 0;
const role_enum_1 = require("../enum/role.enum");
const verifyRoles = (value) => {
    if (value == 0) {
        return role_enum_1.Roles.ADMIN;
    }
    else if (value == 1) {
        return role_enum_1.Roles.USER_ADMIN;
    }
    else {
        return role_enum_1.Roles.USER;
    }
};
exports.verifyRoles = verifyRoles;
const ifNullNewValue = (valor, ifNull) => {
    if (valor == null || undefined) {
        if (ifNull._seconds != undefined || null) {
            return valor = new Date(ifNull * 1000);
        }
        else {
            return valor = ifNull;
        }
    }
    else {
        return valor;
    }
};
exports.ifNullNewValue = ifNullNewValue;
const anyToDate = (value) => {
    try {
        if (value._seconds == null || undefined) {
            value = Number(value);
            const date = new Date(value);
            return `${date.toLocaleDateString("pt-br")} ${date.toLocaleTimeString("pt-br")}`;
        }
        else {
            const date = new Date(value._seconds * 1000);
            return `${date.toLocaleDateString("pt-br")} ${date.toLocaleTimeString("pt-br")}`;
        }
    }
    catch (error) {
        console.log(error);
        return value;
    }
};
exports.anyToDate = anyToDate;
const toDates = async (value) => {
    try {
        var date = new Date(value._seconds * 1000);
        const data = `${date.toLocaleDateString("pt-br")} ${date.toLocaleTimeString("pt-br")}`;
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.toDates = toDates;
