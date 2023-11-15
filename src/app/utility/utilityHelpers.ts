/**
 * Returns true if the given value is type of Object
 *
 * @param val - key to check is object
 */
export function isObject(val: any): boolean {
    if (val === null) {
        return false;
    }

    return typeof val === 'function' || typeof val === 'object';
}

/**
 * Capitalizes the first character in given string
 *
 * @param s - string.
 */
export function capitalize(s: string): string {
    if (!s || typeof s !== 'string') {
        return s;
    }
    return s && s[0].toUpperCase() + s.slice(1);
}

/**
 * Uncapitalizes the first character in given string
 * @param s - string
 */
export function uncapitalize(s: string): string {
    if (!s || typeof s !== 'string') {
        return s;
    }
    return s && s[0].toLowerCase() + s.slice(1);
}

/**
 * Flattens multi dimensional object into one level deep
 *
 * @param ob - object to be flattened
 * @param preservePath - preserve Path
 */
export function flattenObject(ob: any, preservePath: boolean = false): any {
    const toReturn: any = {};

    for (const i in ob) {
        if (!ob.hasOwnProperty(i)) {
            continue;
        }

        if (typeof ob[i] === 'object') {
            const flatObject = flattenObject(ob[i], preservePath);
            for (const x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) {
                    continue;
                }

                const path = preservePath ? i + '.' + x : x;

                toReturn[path] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }

    return toReturn;
}

/**
 * Returns formated date based on given culture
 *
 * @param dateString - date string.
 * @param culture - culture of the language
 */
export function localeDateString(dateString: string, culture: string = 'en-EN'): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(culture);
}
