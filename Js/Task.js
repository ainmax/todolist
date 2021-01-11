class Task {
    DOMdata;
    positionData;

    constructor(value, dateOfCreation, taskTerm) {
        this.value = value;
        this.dateOfCreation = dateOfCreation;
        this.taskTerm = taskTerm;
    }

    static beginDrag(event) {
        let
            elem = event.target;

        document.getElementById("archive").style = `background-color: rgba(0, 255, 0, 0.467);`;
        document.querySelector("#done>div").style = `color: white;`;

        document.getElementById("delete_zone").style = `display: block; opacity: 0;`;

        setTimeout(() => {
            document.getElementById("delete_zone").style = `display: block; opacity: 1;`;
        }, 10);

        elem.parentNode.setAttribute("isMoving", "true");
    }

    static endDrag(event) {
        const
            target = document.querySelector("[isMoving]");

        if (target != null) {
            let
                list = new List(System.getIt("planObject", true));

            document.querySelector("[isMoving]").style.display = "none";

            if (event.pageY <= document.getElementById("archive").offsetHeight) {
                let
                    archive = new Archive(System.getIt("archiveObject", true));

                archive.setTask(target.lastChild.value, target.lastChild.id, System.getIt("planObject", true)[target.lastChild.id][1]);
                list.deleteTask(target.id.substring(1));
                list.visualisate(false);
                dragShiftX = undefined;
                dragShiftY = undefined;
            } else if (document.elementFromPoint(event.clientX, event.clientY).id == "delete_zone") {
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
                        currentArea.firstChild.after(target);
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

        event.target.removeEventListener("mousemove", Task.beginDrag, { capture: false, once: true, passive: false });
        document.getElementById("archive").removeAttribute("style");
        document.querySelector("#done>div").removeAttribute("style");
        document.getElementById("delete_zone").style = "display: block; opacity: 0;";

        setTimeout(() => {
            document.getElementById("delete_zone").removeAttribute("style");
        }, 300);
    }

    static beginRedact(event) {
        let
            target = event.target;

        target.setAttribute("oldValue", `${target.value}`);
        target.removeAttribute('readonly');
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
    }

    getDOMdata() {
        const
            taParent = document.createElement("div"),
            parentParent = document.createElement("div"),
            ta = document.createElement("textarea"),
            dragZone = document.createElement("div");

        ta.addEventListener("click", Task.beginRedact);
        ta.addEventListener("blur", Task.endRedact);

        dragZone.addEventListener("mousedown", (event) => {
            event.target.addEventListener("mousemove", Task.beginDrag, { capture: false, once: true, passive: false });
            document.addEventListener("mouseup", Task.endDrag, { capture: false, once: true, passive: false });
        });

        ta.setAttribute("readonly", "readonly");

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

    save() {
        let
            list = new List(System.getIt("planObject", true));

        list.listOfTasks[this.dateOfCreation] = new Task(this.value, this.dateOfCreation, this.taskTerm);

        localStorage.removeItem("planObject");
        System.setIt("planObject", list.convertToPrimitiveObj(), true);
    }

    getPositionData(isTaskFromUser) {
        let
            parentIsFirst = false,
            listDateArray = new Array(),
            finallyParent,
            list = document.getElementById("list");

        let
            best = "0",
            timeOfPlan,
            newTimeProve = true,
            dateIndicator = document.createElement("div");

        let
            planObject = new List(System.getIt("planObject", true)).convertToPrimitiveObj();

        if (isTaskFromUser) {
            timeOfPlan = String(Number(this.dateOfCreation) + Number(document.getElementById("ta2").value) * 1000000);
        } else {
            timeOfPlan = planObject[Number(this.dateOfCreation)][1];
        }

        for (let i = 0; i < list.childNodes.length; i++) {
            listDateArray.push(list.childNodes[i].id.substring(2));
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
            dateIndicator.innerHTML = timeOfPlan.substring(0, 4) + "." + timeOfPlan.substring(4, 6) + "." + timeOfPlan.substring(6, 8);
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