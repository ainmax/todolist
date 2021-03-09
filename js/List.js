class List {
    listOfTasks = {};

    constructor(planObject) {
        this.listOfTasks = this._convertBy(planObject);
    }

    visualisate(isTasksFromUser) {
        const
            allTasks = document.querySelectorAll(".task");

        let
            isTaskNew = true,
            isTaskDeleted = true,
            currentTask;

        for (let key in this.listOfTasks) {
            currentTask = new Task(this.listOfTasks[key].value, this.listOfTasks[key].dateOfCreation, this.listOfTasks[key].taskTerm);

            for (let block of allTasks) {
                if (currentTask.dateOfCreation == block.id.substring(1)) {
                    isTaskNew = false;
                    break;
                }
            }

            if (isTaskNew) {
                currentTask.DOMdata = currentTask.getDOMdata();
                currentTask.positionData = currentTask.getPositionData(isTasksFromUser, new List(this.convertToPrimitiveObj()));

                if (currentTask.positionData.newTimeProve && !currentTask.positionData.parentIsFirst) {

                    currentTask.positionData.finallyParent.after(currentTask.DOMdata.parentParent);
                    currentTask.DOMdata.parentParent.prepend(currentTask.DOMdata.taParent);
                    currentTask.DOMdata.taParent.prepend(currentTask.DOMdata.ta);
                    currentTask.DOMdata.taParent.prepend(currentTask.DOMdata.dragZone);
                    currentTask.DOMdata.parentParent.prepend(currentTask.positionData.dateIndicator);

                    let
                        editingTAcopy = document.createElement("div");

                    editingTAcopy.id = "editingTAcopy";

                    currentTask.DOMdata.ta.before(editingTAcopy);

                    handler_editingTA({
                        target: currentTask.DOMdata.ta
                    });

                    currentTask.DOMdata.ta.setAttribute("style", `height: ${currentTask.DOMdata.ta.style.height}`);
                    currentTask.DOMdata.ta.parentNode.childNodes[1].remove();

                } else if (!currentTask.positionData.newTimeProve) {

                    currentTask.positionData.finallyParent.append(currentTask.DOMdata.taParent);
                    currentTask.DOMdata.taParent.prepend(currentTask.DOMdata.ta);
                    currentTask.DOMdata.taParent.prepend(currentTask.DOMdata.dragZone);

                    let
                        editingTAcopy = document.createElement("div");

                    editingTAcopy.id = "editingTAcopy";

                    currentTask.DOMdata.ta.before(editingTAcopy);

                    handler_editingTA({
                        target: currentTask.DOMdata.ta
                    });

                    currentTask.DOMdata.ta.setAttribute("style", `height: ${currentTask.DOMdata.ta.style.height}`);
                    currentTask.DOMdata.ta.parentNode.childNodes[1].remove();

                } else {

                    list.prepend(currentTask.DOMdata.parentParent);
                    currentTask.DOMdata.parentParent.prepend(currentTask.DOMdata.taParent);
                    currentTask.DOMdata.taParent.prepend(currentTask.DOMdata.ta);
                    currentTask.DOMdata.taParent.prepend(currentTask.DOMdata.dragZone);
                    currentTask.DOMdata.parentParent.prepend(currentTask.positionData.dateIndicator);

                    let
                        editingTAcopy = document.createElement("div");

                    editingTAcopy.id = "editingTAcopy";

                    currentTask.DOMdata.ta.before(editingTAcopy);

                    handler_editingTA({
                        target: currentTask.DOMdata.ta
                    });

                    currentTask.DOMdata.ta.setAttribute("style", `height: ${currentTask.DOMdata.ta.style.height}`);
                    currentTask.DOMdata.ta.parentNode.childNodes[1].remove();
                }
            }

            isTaskNew = true;
        }

        for (let block of allTasks) {
            for (let key in this.listOfTasks) {
                currentTask = new Task(this.listOfTasks[key].value, this.listOfTasks[key].dateOfCreation, this.listOfTasks[key].taskTerm);

                if (block.id.substring(1) == currentTask.dateOfCreation) {
                    isTaskDeleted = false;
                    break;
                }
            }

            if (isTaskDeleted) {
                let
                    list = document.getElementById("list"),
                    idElem = block.id.substring(1),
                    elemParent = block.parentNode;

                document.getElementById("p" + idElem).remove();

                if (elemParent.childNodes.length - 1 == 0 && elemParent.firstChild.innerHTML != "Today") {
                    list.removeChild(elemParent);
                }
            }

            isTaskDeleted = true;
        }

        if (document.getElementsByClassName("overdue").length != 0) {
            this._moveOverdueToToday();
        }

        if (isTasksFromUser) {
            setTimeout(() => {
                document.getElementById("textarea").value = null;
                document.getElementById("ta2").value = null;
            }, 10);
        }
    }

    _moveOverdueToToday() {
        let
            overdueBlocks = new Array(),
            counter = 0;

        for (let i = 0; i < document.getElementsByClassName("overdue").length; i++) {
            for (let f = 1; f < document.getElementsByClassName("overdue")[i].parentNode.childNodes.length; f++) {
                overdueBlocks[counter] = document.getElementsByClassName("overdue")[i].parentNode.childNodes[f];
                counter++;
            }
        }

        let
            list = new List(System.getIt("planObject", true));

        for (let prop of overdueBlocks) {
            list.deleteTask(prop.id.substring(1));
        }

        list.visualisate(false);

        for (let prop of overdueBlocks) {
            list.addTask(true, prop.id.substring(1), System.getDate(), prop.lastChild.value);
        }

        list.visualisate(false);
    }

    addTask(isTaskNew, dateOfCreation, taskTerm, value) {
        if (!isTaskNew || /\S/.test(value)) {
            if (/\D/.test(String(taskTerm))) {
                taskTerm = System.getDate();
            }

            let
                currentTask = new Task(value, dateOfCreation, taskTerm);

            if (isTaskNew) {
                currentTask.save();
            }

            this.listOfTasks[dateOfCreation] = currentTask;
        } else {
            console.log("Чтобы оставить задачу введите текст.");
        }
    }

    addEmptyToday() {
        const
            parentParent = document.createElement("div"),
            list = document.getElementById("list");

        parentParent.id = "dt" + System.getDate();
        parentParent.setAttribute("tasksTerm", System.getDate());

        parentParent.className = "listChild";

        let
            dateIndicator = document.createElement("div");

        dateIndicator.innerHTML = "Today";
        dateIndicator.className = "date_indicator";

        list.prepend(parentParent);
        parentParent.prepend(dateIndicator);
    }

    deleteTask(dateOfCreation) {
        let
            planObject = System.getIt("planObject", true);

        localStorage.removeItem("planObject");

        delete planObject[Number(dateOfCreation)];
        delete this.listOfTasks[dateOfCreation];

        if (planObject != {}) {
            System.setIt("planObject", planObject, true);
        }
    }

    convertToPrimitiveObj() {
        let
            primitiveObj = {};

        for (let key in this.listOfTasks) {
            primitiveObj[key] = [this.listOfTasks[key].value, this.listOfTasks[key].taskTerm, this.listOfTasks[key].dateOfCreation];
        }

        return primitiveObj;
    }

    _convertBy(primitiveObj) {
        let
            list = {};

        for (let key in primitiveObj) {
            list[key] = new Task(primitiveObj[key][0], primitiveObj[key][2], primitiveObj[key][1]);
        }

        return list;
    }
}