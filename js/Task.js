class Task {
    DOMdata;
    positionData;

    constructor(value, dateOfCreation, taskTerm) {
        this.value = value;
        this.dateOfCreation = dateOfCreation;
        this.taskTerm = taskTerm;
    }

    //There are two functions, beginDrag call then user begin dragging, endDrag call then user drop dragging task

    static beginDrag(event) {
        let
            elem = event.target;

        document.getElementById("archive").style = `background-color: rgba(0, 255, 0, 0.467);`;

        document.getElementById("delete_zone").style = `display: block; opacity: 0;`;

        setTimeout(() => {
            document.getElementById("delete_zone").style = `display: block; opacity: 1;`;
        }, 10);

        for (let prop of document.querySelectorAll(".complete_ikon")) {
            prop.style = "background-image: url('images/complete-ikon.jpg');";
        }

        document.querySelector("#done>div").style = `color: white;`;

        elem.parentNode.setAttribute("isMoving", "true");
    }

    static endDrag(event) {
        const
            target = document.querySelector("[isMoving]");

        if (target != null) {
            let
                list = new List(System.getIt("planObject", true));

            document.querySelector("[isMoving]").style.display = "none";

            if (document.elementFromPoint(event.clientX, event.clientY).id == "delete_zone") {
                list.deleteTask(target.id.substring(1));
                list.visualisate(false);
                dragShiftX = undefined;
                dragShiftY = undefined;
            } else if (event.pageY <= document.getElementById("archive").offsetHeight) {
                let
                    archive = new Archive(System.getIt("archiveObject", true));

                archive.setTask(target.lastChild.value, target.lastChild.id, System.getIt("planObject", true)[target.lastChild.id][1]);
                list.deleteTask(target.id.substring(1));
                list.visualisate(false);
                dragShiftX = undefined;
                dragShiftY = undefined;
            } else {
                let
                    currentArea = document.elementFromPoint(event.clientX, event.clientY);

                if (currentArea.parentNode.className == "task" || currentArea.className == "task" || (currentArea.className == "listChild" && currentArea.firstChild.innerHTML == "Today" && currentArea.childNodes.length == 1)) {
                    let
                        droppedTaskData;

                    if (currentArea.parentNode.className == "task") {
                        droppedTaskData = {
                            value: target.lastChild.value,
                            dateOfCreation: target.id.substring(1),
                            tasksTerm: currentArea.parentNode.parentNode.getAttribute("tasksterm").substring(0, 8) + System.getIt("planObject", true)[target.id.substring(1)][1].substring(8)
                        };
                    } else if (currentArea.className == "task") {
                        droppedTaskData = {
                            value: target.lastChild.value,
                            dateOfCreation: target.id.substring(1),
                            tasksTerm: currentArea.parentNode.getAttribute("tasksterm").substring(0, 8) + System.getIt("planObject", true)[target.id.substring(1)][1].substring(8)
                        };
                    } else {
                        droppedTaskData = {
                            value: target.lastChild.value,
                            dateOfCreation: target.id.substring(1),
                            tasksTerm: currentArea.getAttribute("tasksterm").substring(0, 8) + System.getIt("planObject", true)[target.id.substring(1)][1].substring(8)
                        };
                    }

                    list.deleteTask(target.id.substring(1));
                    list.visualisate(false);

                    dragShiftX = undefined;
                    dragShiftY = undefined;

                    let
                        planObject = System.getIt("planObject", true);

                    localStorage.removeItem("planObject");

                    planObject[droppedTaskData.dateOfCreation] = [droppedTaskData.value, droppedTaskData.tasksTerm, droppedTaskData.dateOfCreation];

                    System.setIt("planObject", planObject, true);

                    if (currentArea.parentNode.className == "task") {
                        currentArea.parentNode.after(target);
                    } else if (currentArea.className == "task") {
                        currentArea.after(target);
                    } else {
                        currentArea.append(target);
                    }
                } else {
                    document.querySelector("[isMoving]").style.display = "block";
                }
            }

            dragShiftX = undefined;
            dragShiftY = undefined;
            target.removeAttribute("style");
            target.removeAttribute("isMoving");
        }

        event.target.removeEventListener("mousemove", Task.beginDrag, {
            capture: false,
            once: true,
            passive: false
        });

        document.getElementById("archive").removeAttribute("style");
        document.getElementById("delete_zone").style = "display: block; opacity: 0;";

        for (let prop of document.querySelectorAll(".complete_ikon")) {
            prop.removeAttribute("style");
        }

        document.querySelector("#done>div").removeAttribute("style");

        setTimeout(() => {
            document.getElementById("delete_zone").removeAttribute("style");
        }, 300);
    }

    //There are two functions, beginRedact call then user begin to edit any task, endRedact call then user unfocus textarea which user edited

    static beginRedact(event) {
        let
            target = event.target;

        target.setAttribute("style", `height: ${target.style.height}; background-color: rgb(0, 0, 0, 0.1);`);
        target.setAttribute("oldValue", `${target.value}`);
        target.removeAttribute('readonly');

        let
            editingTAcopy = document.createElement("div");

        editingTAcopy.id = "editingTAcopy";

        target.addEventListener("keydown", handler_editingTA);
        target.addEventListener("keyup", handler_editingTA);
        target.addEventListener("input", handler_editingTA);

        target.before(editingTAcopy);

        target.addEventListener("blur", Task.endRedact, {
            capture: false,
            once: true,
            passive: false
        });
    }

    static endRedact(event) {
        if (document.querySelector("[isMoving]") != null) {
            return;
        }

        let
            target = event.target;

        if (/\S/.test(target.value)) {
            let
                list = new List(System.getIt("planObject", true));

            list.listOfTasks[Number(target.id)].value = target.value;

            localStorage.removeItem("planObject");
            System.setIt("planObject", list.convertToPrimitiveObj(), true);
        } else {
            target.value = target.getAttribute("oldValue");
        }

        target.setAttribute("readonly", "readonly");
        target.removeAttribute("oldValue");
        target.setAttribute("style", `height: ${target.style.height}`);
        target.removeEventListener("keydown", handler_editingTA);
        target.removeEventListener("keyup", handler_editingTA);
        target.removeEventListener("input", handler_editingTA);
        target.parentNode.childNodes[1].remove();

        target.parentNode.firstChild.removeAttribute("style");
        target.addEventListener("click", Task.beginRedact, {
            capture: false,
            once: true,
            passive: false
        });
    }

    //There is one function, getDOMdata call from class 'List' then user or loader add task to list, this function return DOM components of task with eventListeners and styles on their

    getDOMdata() {
        const
            taParent = document.createElement("div"),
            parentParent = document.createElement("div"),
            ta = document.createElement("textarea"),
            dragZone = document.createElement("div");

        ta.addEventListener("click", Task.beginRedact, {
            capture: false,
            once: true,
            passive: false
        });

        dragZone.addEventListener("mousedown", (event) => {
            event.target.addEventListener("mousemove", Task.beginDrag, {
                capture: false,
                once: true,
                passive: false
            });
            document.addEventListener("mouseup", Task.endDrag, {
                capture: false,
                once: true,
                passive: false
            });
        });

        dragZone.addEventListener("dblclick", (e) => {
            let
                planObject = System.getIt("planObject", true),
                archiveObject = System.getIt("archiveObject", true);

            let
                list = new List(planObject),
                archive = new Archive(archiveObject);

            let
                id = e.target.parentNode.lastChild.id,
                value = e.target.parentNode.lastChild.value;

            list.deleteTask(e.target.parentNode.lastChild.id);
            archive.setTask(value, id, planObject[id][1]);

            list.visualisate(false);
        });

        ta.addEventListener("focus", () => {
            isTAfocused = true;
        });

        ta.addEventListener("blur", () => {
            isTAfocused = false;
        });

        ta.setAttribute("readonly", "readonly");
        ta.setAttribute("wrap", "off");

        ta.id = this.dateOfCreation;
        taParent.id = "p" + this.dateOfCreation;
        parentParent.id = "dt" + this.dateOfCreation;
        parentParent.setAttribute("tasksTerm", this.taskTerm);

        ta.className = "block";
        taParent.className = "task";
        ta.value = this.value;

        dragZone.className = "dragZone";

        parentParent.className = "listChild";

        return {
            "dragZone": dragZone,
            "ta": ta,
            "taParent": taParent,
            "parentParent": parentParent
        };
    }

    //There is one function, save push new task information to localStorage 

    save() {
        let
            list = new List(System.getIt("planObject", true));

        list.listOfTasks[this.dateOfCreation] = new Task(this.value, this.dateOfCreation, this.taskTerm);

        localStorage.removeItem("planObject");
        System.setIt("planObject", list.convertToPrimitiveObj(), true);
    }

    //There is one function, getPositionData call from class 'List' then user or loader add task to list, this function return information about position of task, with this information function from class 'List' add task to DOMlist

    getPositionData(area) {
        let
            parentIsFirst = false,
            listDateArray = new Array(),
            finallyParent,
            list = document.getElementById("list");

        let
            best = "0",
            timeOfPlan = this.taskTerm,
            newTimeProve = true,
            dateIndicator = document.createElement("div");

        for (let i = 0; i < list.childNodes.length; i++) {
            if (list.childNodes[i].className == "listChild") {
                listDateArray.push(list.childNodes[i].id.substring(2));
            }
        }

        for (let i = 0; i < listDateArray.length; i++) {
            if (document.getElementById("dt" + listDateArray[i]).getAttribute("tasksterm").substring(0, 8) == timeOfPlan.substring(0, 8)) {
                newTimeProve = false;
                break;
            }
        }

        if (Number(timeOfPlan.substring(0, 8)) < Number(System.getDate().substring(0, 8))) {
            dateIndicator.className = "overdue";
        } else if (newTimeProve) {
            if(timeOfPlan.substring(0, 6) == System.getDate().substring(0, 6)) {
                dateIndicator.innerHTML = timeOfPlan.substring(6, 8) + ", " + System.getDayOfWeek(timeOfPlan);
            } else {
                dateIndicator.innerHTML = {"01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June", "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"}[timeOfPlan.substring(4, 6)] + " " + timeOfPlan.substring(6, 8) + ", " + System.getDayOfWeek(timeOfPlan);
            }

            dateIndicator.className = "date_indicator";
        }

        if (newTimeProve) {
            for (let i = 0; i < listDateArray.length; i++) {
                let
                    key = document.getElementById("dt" + listDateArray[i]).getAttribute("tasksterm");

                if (Number(key.substring(0, 8)) > Number(best.substring(0, 8)) && Number(key.substring(0, 8)) <= Number(timeOfPlan.substring(0, 8))) {
                    best = key;
                }
            }

            if (best != null) {
                for (let g = 0; g < listDateArray.length; g++) {
                    if (best.substring(0, 8) == document.getElementById("dt" + listDateArray[g]).getAttribute("tasksterm").substring(0, 8)) {
                        finallyParent = list.childNodes[g];
                    }
                }
            }
        } else {
            for (let i = 0; i < listDateArray.length; i++) {
                if (timeOfPlan.substring(0, 8) == document.getElementById("dt" + listDateArray[i]).getAttribute("tasksterm").substring(0, 8)) {
                    finallyParent = document.getElementById("dt" + listDateArray[i]);
                    break;
                }
            }
        }

        if (finallyParent == null) {
            parentIsFirst = true;
        }

        return {
            "finallyParent": finallyParent,
            "parentIsFirst": parentIsFirst,
            "newTimeProve": newTimeProve,
            "dateIndicator": dateIndicator
        }
    }
}