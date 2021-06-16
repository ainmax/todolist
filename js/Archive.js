class Archive {
    archiveOfTasks = {};

    constructor(archive) {
        this.archiveOfTasks = this._convertBy(archive);
    }

    setTask(value, dateOfCreation, taskTerm) {
        this.archiveOfTasks[dateOfCreation] = [value, dateOfCreation];

        let
            archiveObject = System.getIt("archiveObject", true);

        localStorage.removeItem("archiveObject");

        archiveObject[dateOfCreation] = [value, dateOfCreation, taskTerm];

        System.setIt("archiveObject", archiveObject, true);

        this._addTask(value, dateOfCreation);
    }

    load() {
        for (let key in this.archiveOfTasks) {
            this._addTask(this.archiveOfTasks[key][0], this.archiveOfTasks[key][1]);
        }
    }

    _addTask(value, dateOfCreation) {
        let
            archivedTask = document.createElement("div"),
            block = document.createElement("div"),
            ikon = document.createElement("div");

        block.innerHTML = value.replace(/\n/g, "<br>") + "<br>";
        block.id = dateOfCreation;
        block.className = "archivedBlock";

        ikon.className = "complete_ikon";

        archivedTask.addEventListener("click", function(event) {
            let
                planObject = System.getIt("planObject", true),
                archiveObject = System.getIt("archiveObject", true);

            let
                block = event.currentTarget.lastChild,
                taskData = archiveObject[Number(block.id)];

            planObject[taskData[1]] = [taskData[0], System.getDate().substring(0, 8) + taskData[2].substring(8, 14), taskData[1], null];

            System.setIt("planObject", planObject, true);

            let
                list = new List(System.getIt("planObject", true));

            list.visualisate(false);

            delete archiveObject[Number(block.id)];
            System.setIt("archiveObject", archiveObject, true);

            block.parentNode.remove();
        });

        archivedTask.id = "ap" + dateOfCreation;
        archivedTask.className = "archivedTask";

        document.getElementById("done").before(archivedTask);
        archivedTask.append(block);
        archivedTask.prepend(ikon);
    }

    _convertBy(primitiveObj) {
        let
            obj = primitiveObj;

        for (let key in obj) {
            this.archiveOfTasks[key] = [obj[key][0], obj[key][1]];
        }

        return obj;
    }
}