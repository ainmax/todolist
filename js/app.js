let
    isShift = false,
    isEnter = false,
    isTextareaFocused = false;

let
    oldTAvalue = "",
    newTAvalue = "";

let
    dragShiftX,
    dragShiftY;

let
    identityCode = "Ga6FhqofcNvmbjAp";

document.addEventListener("DOMContentLoaded", () => {
    load();
});

let
    load = function() {
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

        addEventListeners();
    },
    addEventListeners = function() {
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

        document.onselectstart = () => {
            return false;
        }

        document.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
                isEnter = true;
                if (isShift && isTextareaFocused) {
                    setTimeout(() => {
                        let
                            list = new List(System.getIt("planObject", true)),
                            dateOfCreation = System.getDate();

                        list.addTask(true, dateOfCreation, System.sumDates(String(System.getDate()), document.getElementById("ta2").value), oldTAvalue);
                        list.visualisate(true);
                    }, 200);

                    isEnter = false;
                }
            }

            if (event.key == "Shift") {
                isShift = true;
                if (isEnter && isTextareaFocused) {
                    setTimeout(() => {
                        let
                            list = new List(System.getIt("planObject", true)),
                            dateOfCreation = System.getDate();

                        list.addTask(true, dateOfCreation, System.sumDates(String(System.getDate()), document.getElementById("ta2").value), oldTAvalue);
                        list.visualisate(true);
                    }, 200);

                    isShift = false;
                }
            }
        });

        document.querySelector("#textarea").addEventListener("focus", () => {
            isTextareaFocused = true;
        });

        document.querySelector("#textarea").addEventListener("blur", () => {
            isTextareaFocused = false;
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

        //ctrl + c, ctrl + v

        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.code == "KeyC") {
                navigator.clipboard.writeText(identityCode + System.getIt("planObject"))
                    .then(() => {

                    })
                    .catch(err => {
                        console.log('Something went wrong', err);
                    });
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.code == "KeyV") {
                navigator.clipboard.readText()
                    .then(text => {
                        if (System.checkDataFormat(text)) {
                            console.log("List inserted!");
                        }
                    })
                    .catch(err => {
                        console.log('Something went wrong', err);
                    });
            }
        });
    }

//There are handlers for eventlisteners

let
    handler_editingTA = function(e) {
        document.getElementById("editingTAcopy").innerHTML = e.target.value.replace(/\n/g, "<br>") + "<br>";
        e.target.style.height = `${document.getElementById("editingTAcopy").offsetHeight}px`;
    };