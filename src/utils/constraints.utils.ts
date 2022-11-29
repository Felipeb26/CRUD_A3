import { Roles } from "../enum/role.enum";

export const verifyRoles = (value: any) => {
    if (value == 0) {
        return Roles.ADMIN
    } else if (value == 1) {
        return Roles.USER_ADMIN
    } else {
        return Roles.USER
    }
}

export const ifNullNewValue = (valor: any, ifNull: any) => {
    if (valor == null || undefined) {
        if (ifNull._seconds != undefined || null) {
            return valor = new Date(ifNull * 1000)
        } else {
            return valor = ifNull;
        }
    } else {
        return valor;
    }
}

export const anyToDate = (value: any) => {
    try {
        if (value._seconds == null || undefined) {
            value = Number(value)
            const date = new Date(value);
            return `${date.toLocaleDateString("pt-br")} ${date.toLocaleTimeString("pt-br")}`
        } else {
            const date = new Date(value._seconds * 1000)
            return `${date.toLocaleDateString("pt-br")} ${date.toLocaleTimeString("pt-br")}`
        }
    } catch (error) {
        console.log(error)
        return value;
    }
}

export const toDates = async (value: any) => {
    try {
        var date: Date = new Date(value._seconds * 1000)
        const data = `${date.toLocaleDateString("pt-br")} ${date.toLocaleTimeString("pt-br")}`
        return data;
    } catch (error: any) {
        console.log(error.message)
    }
}