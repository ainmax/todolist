console.log("You can write this code Ainur!");

class System {
    static getDate() {
        let
            value = "",
            date = new Date();

        let
            numLength = (valueFunc, a) => {
                if (String(valueFunc + a).length <= 1) {
                    value += "0";
                }
                value += String(valueFunc + a);
            }

        value += String(date.getFullYear());

        numLength(date.getMonth(), 1);

        numLength(date.getDate(), 0);

        numLength(date.getHours(), 0);

        numLength(date.getMinutes(), 0);

        numLength(date.getSeconds(), 0);

        return value;
    }

    static getDayOfWeek(datein) {
        let
            date = new Date(Number(datein.substring(0, 4)), Number(datein.substring(4, 6)) - 1, Number(datein.substring(6, 8))),
            weekDays = ["Sn", "Mn", "Ts", "Wd", "Th", "Fr", "St"];

        return weekDays[date.getDay()];
    }

    static sumDates(datein, days) {
        let
            date1 = new Date(Number(datein.substring(0, 4)), Number(datein.substring(4, 6)) - 1, Number(datein.substring(6, 8)), Number(datein.substring(8, 10)), Number(datein.substring(10, 12)), Number(datein.substring(12, 14))),
            date2 = new Date(1000 * 3600 * 24 * Number(days)),
            date = new Date(date1.getTime() + date2.getTime()),
            value = "";

        let
            numLength = (valueFunc, a) => {
                if (String(valueFunc + a).length <= 1) {
                    value += "0";
                }
                value += String(valueFunc + a);
            }

        value += String(date.getFullYear());

        numLength(date.getMonth(), 1);

        numLength(date.getDate(), 0);

        numLength(date.getHours(), 0);

        numLength(date.getMinutes(), 0);

        numLength(date.getSeconds(), 0);

        return value;
    }

    static getIt(key, jsonParse) {
        try {
            if (!jsonParse) {
                return localStorage.getItem(String(key));
            } else {
                return JSON.parse(localStorage.getItem(String(key)));
            }
        } catch {
            console.error("!In function getIt error!", "key:", key);
        }
    }

    static setIt(key, value, jsonStringify) {
        try {
            if (!jsonStringify) {
                localStorage.setItem(key, value);
            } else {
                localStorage.setItem(key, JSON.stringify(value));
            }
        } catch {
            console.error("!In function setIt error!");
        }
    }

    static clear() {
        localStorage.removeItem("planObject");
        localStorage.removeItem("archiveObject");
    }

    static checkDataFormat(data) {
        if (data.substring(0, 16) == identityCode) {
            return true;
        }

        return false;
    }

    // static get(object, key) {
    //     for (let k in object) {
    //         if (k.substring(0, key.length) == key) {
    //             return object[k];
    //         }
    //     }

    //     return false;
    // }
}