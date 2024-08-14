// récupérer les éléments du DOM
const taskList = document.getElementById('taskList'); // ul: liste des tâches
const progressBar = document.getElementById('progressBar'); // progress bar
const progressText = document.getElementById('progressText'); // texte progress bar
const victoryMessage = document.getElementById('victoryMessage'); // message victoire

// charge les tâches sauvegardées dans le stockage local ou initialise un tableau vide s'il n'y a pas de tâches sauvegardées
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// fonction ajout d'une nouvelle tâche à la liste
function addTask() {
    const input = document.getElementById('taskInput'); // input pour le texte de la nouvelle tâche
    const text = input.value.trim(); // récupère et supprime les espaces grâce à trim
    if (text) { // si y'a du text
        tasks.push({ text, completed: false }); // on push la nouvelle tâche non terminée au tableau
        input.value = ''; // on vide l'input
        saveTasks(); // sauvegarde les tâches dans le stockage local
        renderTasks(); // met à jour l'affichage des tâches
    }
}

// fonction pour modifier une tâche
function editTask(index) {
    const newText = prompt('Modifier la tâche', tasks[index].text); // demande à l'utilisateur de modifier le texte
    if (newText !== null) { // si l'utilisateur n'annule pas la modification
        tasks[index].text = newText.trim(); // met à jour le texte de la tâche avec le nouveau texte
        saveTasks(); // sauvegarde les tâches mises à jour dans le stockage local
        renderTasks(); // met à jour l'affichage des tâches
    }
}

// fonction pour supprimer une tâche
function deleteTask(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) { // demande de confirmation avant la suppression
        tasks.splice(index, 1); // supprime la tâche du tableau
        saveTasks(); // sauvegarde les tâches mises à jour dans le stockage local
        renderTasks(); // met à jour l'affichage des tâches
    }
}

// fonction tâche (complétée ou non)
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed; // inverse l'état de la tâche (complétée ou non)
    saveTasks(); // sauvegarde les tâches mises à jour dans le stockage local
    renderTasks(); // met à jour l'affichage des tâches
}

// fonction pour sauvegarder les tâches dans le stockage local
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); // convertit les tâches en JSON et les stocke localement
}

// fonction pour afficher les tâches dans la liste
function renderTasks() {
    taskList.innerHTML = ''; // vide la liste des tâches affichées
    tasks.forEach((task, index) => { // pour chaque tâche dans le tableau
        const li = document.createElement('li'); // on crée un élément <li> pour la tâche
        li.className = task.completed ? 'completed' : ''; // on ajoute une classe CSS si la tâche est terminée
        li.innerHTML = `
            <input type="checkbox" id="task${index}" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <label for="task${index}" class="checkbox-label"></label>
            <span>${task.text}</span>
            <button class="edit" onclick="editTask(${index})"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="delete" onclick="deleteTask(${index})"><i class="fa-regular fa-trash-can"></i></button>
        `;
        taskList.appendChild(li); // on ajoute l'élément <li> à la liste des tâches
    });
    updateProgress(); // met à jour la barre de progression et le texte associé
}

// fonction pour la progress bar
function updateProgress() {
    const totalTasks = tasks.length; // nombre total de tâches
    const completedTasks = tasks.filter(task => task.completed).length; // nombre de tâches complétées
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0; // calcul du pourcentage de progression
    progressBar.style.width = `${progress}%`; // ajuste la largeur de la barre de progression
    progressText.textContent = `${Math.round(progress)}%`; // met à jour le texte affichant le pourcentage

    if (completedTasks === totalTasks && totalTasks > 0) { // si toutes les tâches sont complètes
        // alors on affiche le message de victoire 
        victoryMessage.style.display = 'block';
    } else {
        // sinon on cache le message de victoire si toutes les tâches ne sont pas complètes
        victoryMessage.style.display = 'none';
    }
}

// initialiser la liste des tâches à partir du stockage local
renderTasks(); // affiche les tâches à partir du stockage local lors du chargement de la page
