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

    /*
    static sumDates(date1, date2) {
        let
            remainder = 0,
            resultDate = "";

        resultDate = (Number(date1.substring(12)) + Number(date2.substring(12))) % 60 + "";
        if (((Number(date1.substring(12)) + Number(date2.substring(12))) % 60 + "").length != 2) {
            resultDate = "0" + resultDate;
        }

        remainder = (Number(date1.substring(12)) + Number(date2.substring(12))) / 60;

        resultDate = (Number(date1.substring(10, 12)) + Number(date2.substring(10, 12)) + Math.floor(remainder)) % 60 + resultDate;
        if (((Number(date1.substring(10, 12)) + Number(date2.substring(10, 12)) + Math.floor(remainder)) % 60 + "").length != 2) {
            resultDate = "0" + resultDate;
        }

        remainder = (Number(date1.substring(10, 12)) + Number(date2.substring(10, 12))) / 60;

        resultDate = (Number(date1.substring(8, 10)) + Number(date2.substring(8, 10)) + Math.floor(remainder)) % 24 + resultDate;
        if (((Number(date1.substring(8, 10)) + Number(date2.substring(8, 10)) + Math.floor(remainder)) % 24 + "").length != 2) {
            resultDate = "0" + resultDate;
        }

        remainder = (Number(date1.substring(8, 10)) + Number(date2.substring(8, 10))) / 24;

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

        if (days31.includes(date1.substring(4, 6))) {
            resultDate = (Number(date1.substring(6, 8)) + Number(date2.substring(6, 8)) + Math.floor(remainder)) % 32 + resultDate;
            if (((Number(date1.substring(6, 8)) + Number(date2.substring(6, 8)) + Math.floor(remainder)) % 32 + "").length != 2) {
                resultDate = "0" + resultDate;
            }
        } else if (days30.includes(date1.substring(4, 6))) {
            resultDate = (Number(date1.substring(6, 8)) + Number(date2.substring(6, 8)) + Math.floor(remainder)) % 31 + resultDate;
            if (((Number(date1.substring(6, 8)) + Number(date2.substring(6, 8)) + Math.floor(remainder)) % 31 + "").length != 2) {
                resultDate = "0" + resultDate;
            }
        } else {
            resultDate = (Number(date1.substring(6, 8)) + Number(date2.substring(6, 8)) + Math.floor(remainder)) % 29 + resultDate;
            if (((Number(date1.substring(6, 8)) + Number(date2.substring(6, 8)) + Math.floor(remainder)) % 29 + "").length != 2) {
                resultDate = "0" + resultDate;
            }
        }

        resultDate = date1.substring(0, 4) + resultDate;

        return resultDate;
    }
    */

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