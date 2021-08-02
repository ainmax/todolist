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

let
    isTAfocused = false;

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
            document.getElementById("body").scrollIntoView(false);
        } else {
            System.setIt("archiveObject", {}, true);
        }

        document.getElementById("ta2").setAttribute("min", `${System.getDate().substring(0, 4)}-${System.getDate().substring(4, 6)}-${System.getDate().substring(6, 8)}`);
        document.getElementById("ta2").setAttribute("value", `${System.getDate().substring(0, 4)}-${System.getDate().substring(4, 6)}-${System.getDate().substring(6, 8)}`);

        addEventListeners();
    },
    addEventListeners = function() {
        document.ondragstart = function() {
            return false;
        };

        document.getElementById("information").addEventListener("click", () => {
            window.location = "info.html";
        });

        document.addEventListener("mousemove", (event) => {
            if (document.querySelector("[ismoving]") != null) {
                let
                    elem = document.querySelector("[ismoving]");

                if (dragShiftX != undefined && dragShiftY != undefined) {
                    elem.style.top = event.pageY - dragShiftY + "px";
                    elem.style.left = event.pageX - dragShiftX + "px";
                }

                elem.style.display = "none";

                let
                    elemBelow = document.elementFromPoint(event.clientX, event.clientY);

                elem.style.display = "block";

                let
                    currentElem = elemBelow.closest(".task");

                if (currentElem && currentElem.id != "task-blank") {
                    let
                        newTaskBlank = document.getElementById("task-blank"),
                        isUpper = false;

                    newTaskBlank.style.display = "block";

                    if (event.clientY < currentElem.getBoundingClientRect().top + currentElem.getBoundingClientRect().height / 2) {
                        isUpper = true;
                    }

                    document.getElementById("task-blank").remove();

                    if (isUpper) {
                        currentElem.before(newTaskBlank);
                    } else {
                        currentElem.after(newTaskBlank);
                    }
                } else if (!elemBelow.closest("#list")) {
                    document.getElementById("task-blank").style.display = "none";

                    let
                        newTaskBlank = document.getElementById("task-blank");

                    document.getElementById("task-blank").remove();
                    document.getElementById("body").append(newTaskBlank);
                } else if (elemBelow.closest(".listChild") && elemBelow.closest(".listChild").childNodes.length <= 2 && (!elemBelow.closest(".listChild").childNodes[1] || elemBelow.closest(".listChild").childNodes[1].getAttribute("isMoving"))) {
                    let
                        newTaskBlank = document.getElementById("task-blank");

                    newTaskBlank.style.display = "block";

                    document.getElementById("task-blank").remove();

                    elemBelow.closest(".listChild").append(newTaskBlank);
                }

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
                            dateOfCreation = System.getDate(),
                            date = document.getElementById("ta2").value.replace(/-/g, "");

                        if (date == "") {
                            date = dateOfCreation.substring(0, 8)
                        }

                        list.addTask(true, dateOfCreation, date + dateOfCreation.substring(8), oldTAvalue, null);
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
                            dateOfCreation = System.getDate(),
                            date = document.getElementById("ta2").value.replace(/-W/g, "");

                        list.addTask(true, dateOfCreation, date + dateOfCreation.substring(8), oldTAvalue, null);
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

        document.addEventListener("keypress", (e) => {
            if (!isTAfocused && !isTextareaFocused) {
                document.getElementById("textarea").focus();
            }
        });

        //ctrl + c, ctrl + v

        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.code == "KeyC" && !isTAfocused && !isTextareaFocused) {
                navigator.clipboard.writeText(identityCode + System.getIt("planObject") + identityCode + System.getIt("archiveObject"))
                    .then(() => {

                    })
                    .catch(err => {
                        console.log('Something went wrong', err);
                    });
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.code == "KeyV" && !isTAfocused && !isTextareaFocused) {
                navigator.clipboard.readText()
                    .then(text => {
                        if (System.checkDataFormat(text)) {
                            let
                                planObject = System.getIt("planObject", true),
                                archiveObject = System.getIt("archiveObject", true);

                            localStorage.removeItem("planObject");
                            localStorage.removeItem("archiveObject");

                            System.setIt("planObject", Object.assign(JSON.parse(text.substring(16).split(identityCode)[0]), planObject), true);
                            System.setIt("archiveObject", Object.assign(JSON.parse(text.substring(16).split(identityCode)[1]), archiveObject), true);
                            location.reload();
                        }
                    })
                    .catch(err => {
                        console.log('Something went wrong', err);
                    });
            }
        });

        //fast change date (alt + arrow)

        document.addEventListener("keydown", (e) => {
            if (e.altKey && e.code == "ArrowUp" && isTextareaFocused) {
                document.getElementById("ta2").stepUp();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.altKey && e.code == "ArrowDown" && isTextareaFocused) {
                document.getElementById("ta2").stepDown();
            }
        })
    }

//There are handlers for eventlisteners

let
    handler_editingTA = function(e) {
        document.getElementById("editingTAcopy").innerHTML = e.target.value.replace(/\n/g, "<br>") + "<br>";
        e.target.style.height = `${document.getElementById("editingTAcopy").clientHeight}px`;
    };