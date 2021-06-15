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
            currentTask = new Task(this.listOfTasks[key].value, this.listOfTasks[key].dateOfCreation, this.listOfTasks[key].taskTerm, this.listOfTasks[key].index);

            for (let block of allTasks) {
                if (currentTask.dateOfCreation == block.id.substring(1)) {
                    isTaskNew = false;
                    break;
                }
            }

            if (isTaskNew) {
                currentTask.DOMdata = currentTask.getDOMdata();
                currentTask.positionData = currentTask.getPositionData(new List(this.convertToPrimitiveObj()));

                if (currentTask.positionData.newTimeProve) {
                    currentTask.positionData.finallyParent.after(currentTask.DOMdata.parentParent);
                    currentTask.DOMdata.parentParent.prepend(currentTask.DOMdata.taParent);
                    currentTask.DOMdata.taParent.prepend(currentTask.DOMdata.ta);
                    currentTask.DOMdata.taParent.prepend(currentTask.DOMdata.dragZone);
                    currentTask.DOMdata.parentParent.prepend(currentTask.positionData.dateIndicator);


                    currentTask.DOMdata.taParent.setAttribute("index", `${currentTask.positionData.index}`);

                } else {
                    if (currentTask.positionData.taskIsFirst) {
                        currentTask.positionData.finallyParent.firstChild.after(currentTask.DOMdata.taParent);
                    } else {
                        currentTask.positionData.finallyTask.after(currentTask.DOMdata.taParent);
                    }

                    currentTask.DOMdata.taParent.setAttribute("index", `${currentTask.positionData.index}`);
                    currentTask.DOMdata.taParent.prepend(currentTask.DOMdata.ta);
                    currentTask.DOMdata.taParent.prepend(currentTask.DOMdata.dragZone);

                }

                let
                    editingTAcopy = document.createElement("div");

                editingTAcopy.style.width = `${currentTask.DOMdata.ta.clientWidth - 1}px`;

                editingTAcopy.id = "editingTAcopy";

                currentTask.DOMdata.ta.before(editingTAcopy);

                handler_editingTA({
                    target: currentTask.DOMdata.ta
                });

                currentTask.DOMdata.ta.setAttribute("style", `height: ${currentTask.DOMdata.ta.style.height}`);
                currentTask.DOMdata.ta.parentNode.childNodes[1].remove();
            }

            isTaskNew = true;
        }

        this._rewriteIndexes();

        for (let block of allTasks) {
            for (let key in this.listOfTasks) {
                if (block.id.substring(1) == this.listOfTasks[key].dateOfCreation) {
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

                if (elemParent.childNodes.length == 1 && elemParent.firstChild.innerHTML != "Today") {
                    list.removeChild(elemParent);
                }
            }

            isTaskDeleted = true;
        }

        this._rewriteIndexes();

        if (document.getElementsByClassName("overdue").length != 0) {
            this._moveOverdueToToday();
        }

        if (isTasksFromUser) {
            setTimeout(() => {
                document.getElementById("textarea").value = null;
                document.getElementById("ta2").value = `${System.getDate().substring(0, 4)}-${System.getDate().substring(4, 6)}-${System.getDate().substring(6, 8)}`;
            }, 10);
        }
    }

    _rewriteIndexes() {
        let
            list = document.getElementById("list");

        for (let listChild of list.childNodes) {
            for (let i = 1; i < listChild.childNodes.length; i++) {
                let
                    currentTask = listChild.childNodes[i];

                if (currentTask.getAttribute("isMoving") != "true") {
                    currentTask.setAttribute("index", `${i - 1}`);
                    this.listOfTasks[currentTask.id.substring(1)].index = i - 1;
                    this.listOfTasks[currentTask.id.substring(1)].save();
                }
            }
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

    addTask(isTaskNew, dateOfCreation, taskTerm, value, index) {
        if (!isTaskNew || /\S/.test(value)) {
            if (/\D/.test(String(taskTerm))) {
                taskTerm = System.getDate();
            }

            let
                currentTask = new Task(value, dateOfCreation, taskTerm, index);

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
            primitiveObj[key] = [this.listOfTasks[key].value, this.listOfTasks[key].taskTerm, this.listOfTasks[key].dateOfCreation, this.listOfTasks[key].index];
        }

        return primitiveObj;
    }

    _convertBy(primitiveObj) {
        let
            list = {};

        for (let key in primitiveObj) {
            list[key] = new Task(primitiveObj[key][0], primitiveObj[key][2], primitiveObj[key][1], primitiveObj[key][3]);
        }

        return list;
    }
}