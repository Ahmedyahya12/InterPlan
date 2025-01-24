document.addEventListener('DOMContentLoaded', function () {
    // Initialize Cloud Firestore
    var db = firebase.firestore();

    var washingtonRef = db.collection('tasks').doc('w2o7jmh3sAgV60Fhpwkh');
    washingtonRef.update({
        address: firebase.firestore.FieldValue.arrayRemove("oman")
    });

    // Add new task to database
    document.getElementById("add-task").addEventListener("click", function (e) {
        e.preventDefault();
        var taskContent = document.querySelector("input#task-content").value;
        db.collection("tasks").add({
            task: taskContent,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then((docRef) => {
            document.getElementById('table-tasks').innerHTML = ''; // Remove table content before re-append tasks
            getAllTasks();
            console.log("Document written with ID: ", docRef.id);
            alert("Task successfully added!");
        })
        .catch((error) => {
            alert("Error adding task");
            console.error("Error adding document: ", error);
        });
    });

    // Delete task from database
    document.body.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'remove-task') {
            var taskId = e.target.getAttribute("task-id");
            db.collection("tasks").doc(taskId).delete().then(() => {
                document.getElementById('table-tasks').innerHTML = ''; // Remove table content before re-append tasks
                getAllTasks();
                alert("Task successfully deleted!");
                console.log("Document successfully deleted!");
            }).catch((error) => {
                alert("Error removing task!");
                console.error("Error removing document: ", error);
            });
        }
    });

    // Read all tasks from Firestore
    function getAllTasks() {
        db.collection("tasks").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (querySnapshot) {
                    var data = doc.data();
                    var task = data.task;
                    var taskId = doc.id;
                    var tableRow = document.createElement('tr');
                    var taskCell = document.createElement('td');
                    taskCell.textContent = task;
                    var buttonCell = document.createElement('td');
                    var removeButton = document.createElement('button');
                    removeButton.setAttribute('type', 'button');
                    removeButton.setAttribute('task-id', taskId);
                    removeButton.setAttribute('id', 'remove-task');
                    removeButton.classList.add('btn', 'btn-outline-danger');
                    removeButton.textContent = 'Remove';
                    buttonCell.appendChild(removeButton);
                    tableRow.appendChild(taskCell);
                    tableRow.appendChild(buttonCell);
                    document.getElementById("table-tasks").appendChild(tableRow);
                } else {
                    var row = document.createElement('tr');
                    row.classList.add('text-center');
                    var noTasksCell = document.createElement('td');
                    noTasksCell.textContent = 'No tasks to show';
                    row.appendChild(noTasksCell);
                    document.getElementById("table-tasks").appendChild(row);
                }
            });
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    getAllTasks();

});
