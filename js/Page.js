let
    isShift = false,
    isEnter = false;

let
    oldTAvalue = "",
    newTAvalue = "";

let
    dragShiftX,
    dragShiftY;

document.addEventListener("DOMContentLoaded", () => {
    Page.loadingOn();
});

class Page {
    load() {
        if (System.getIt("planObject", false) != null) {
            let
                list = new List(System.getIt("planObject", true));

            list.addEmptyToday();
            list.visualisate(false);
        } else {
            System.setIt("planObject", {}, true);

            let
                list = new List({});

            list.addEmptyToday();
        }

        if (System.getIt("archiveObject", false) != null) {
            let
                archive = new Archive(System.getIt("archiveObject", true));

            archive.load();
            document.getElementById("body").scrollIntoView(true);
            document.getElementById("body").scrollIntoView(false);
        } else {
            System.setIt("archiveObject", {}, true);
        }

        this._addEventListeners();
    }

    _addEventListeners() {
        document.ondragstart = function() {
            return false;
        };

        document.addEventListener("mousemove", (event) => {
            if (document.querySelector("[ismoving]") != null) {
                let
                    elem = document.querySelector("[ismoving]");

                if (dragShiftX == undefined) {
                    dragShiftX = elem.offsetLeft + elem.offsetWidth - event.pageX;
                    dragShiftY = elem.offsetTop + elem.offsetHeight - event.pageY;
                }

                elem.style.top = event.pageY - elem.offsetHeight + dragShiftY + "px";
                elem.style.left = event.pageX - elem.offsetWidth + dragShiftX + "px";
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
                isEnter = true;
                if (isShift) {
                    setTimeout(() => {
                        let
                            list = new List(System.getIt("planObject", true)),
                            dateOfCreation = System.getDate();

                        list.addTask(true, dateOfCreation, String(Number(dateOfCreation) + Number(document.getElementById("ta2").value) * 1000000), newTAvalue);
                        list.visualisate(true);
                    }, 200);

                    isEnter = false;
                }
            }

            if (event.key == "Shift") {
                isShift = true;
                if (isEnter) {
                    setTimeout(() => {
                        let
                            list = new List(System.getIt("planObject", true)),
                            dateOfCreation = System.getDate();

                        list.addTask(true, dateOfCreation, String(Number(dateOfCreation) + Number(document.getElementById("ta2").value) * 1000000), oldTAvalue);
                        list.visualisate(true);
                    }, 200);
                    isShift = false;
                }
            }
        });

        document.addEventListener("keyup", (event) => {
            if (event.key == "Shift") {
                isShift = false;
            }

            if (event.key == "Enter") {
                isEnter = false;
            }
        });

        document.querySelector("#textarea").addEventListener("input", (event) => {
            oldTAvalue = newTAvalue;
            newTAvalue = event.target.value;
        });
    }

    static loadingOn() {
        let
            welcome = "Welcome";

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                document.getElementById(welcome[i]).style = "opacity: 1;";
            }, i * 150);
        }

        setTimeout(() => {
            document.getElementById(welcome[6] + "_last").style = "opacity: 1;";
        }, 6 * 150);

        setTimeout(() => {
            document.getElementById("welcome").style = "opacity: 0;";

            setTimeout(() => {
                document.getElementById("welcome").style = "display: none;";
                document.getElementById("todo_page").style = "display: block;";
                new Page().load();
            }, 200);
        }, 2000);
    }
}