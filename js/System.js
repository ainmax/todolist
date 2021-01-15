console.log("You can write this code Auhip!");

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

    static sumDates(datein, days) {
        let
            remainder = 0,
            years = Number(datein.substring(0, 4)),
            date = datein,
            mounths = Number(datein.substring(4, 6));

        let
            days31 = [
                "03",
                "05",
                "07",
                "08",
                "10",
                "12"
            ];

        let
            days30 = [
                "01",
                "04",
                "06",
                "09",
                "11"
            ];

        let
            days28 = [
                "02"
            ];

        if (days31.includes(date.substring(4, 6))) {
            days = Number(date.substring(6, 8)) + Number(days);

            if (Math.floor(days / 31) == 1) {
                remainder = days % 31;

                if (Math.floor(days / 32) == 1) {
                    days = remainder;
                }
            }
        } else if (days30.includes(date.substring(4, 6))) {
            days = Number(date.substring(6, 8)) + Number(days);

            if (Math.floor(days / 30) == 1) {
                remainder = days % 30;

                if (Math.floor(days / 31) == 1) {
                    days = remainder;
                }
            }
        } else if (days28.includes(date.substring(4, 6))) {
            days = Number(date.substring(6, 8)) + Number(days);

            if (Math.floor(days / 28) == 1) {
                remainder = days % 28;

                if (Math.floor(days / 29) == 1) {
                    days = remainder;
                }
            }
        } else {
            console.error("!In function sumDates error!", "date, days:", date, keys);
        }

        days = String(days);

        if (days.length == 1) {
            days = "0" + days;
        }


        if (remainder != 0) {
            mounths++;

            if (mounths / 13 == 1) {
                mounths = mounths % 12;
                years++;
            }
        }

        mounths = String(mounths);

        if (mounths.length == 1) {
            mounths = `0${mounths}`;
        }

        date = String(years) + mounths + String(days) + date.substring(9);

        return date;
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

    static get(object, key) {
        for (let k in object) {
            if (k.substring(0, key.length) == key) {
                return object[k];
            }
        }

        return false;
    }
}