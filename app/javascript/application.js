// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('DOMContentLoaded', function() {
  // --------------- Edit list title/description
  function enableEditable(element) {
    element.contentEditable = true;
  }
  
  function saveChanges(listId, data, titleElement, noteElement) {
    fetch(`/lists/${listId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ list: data }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          titleElement.contentEditable = false;
          noteElement.contentEditable = false;
          document.getElementById(`deleteBtn${listId}`).style.display = 'block';
          console.log(result.message);
        } else {
          console.error(result.message);
        }
      })
      .catch(error => console.error('Error:', error));
  }
  
  document.querySelectorAll('.edit-list-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      let listId = e.currentTarget.dataset.listId;
      let titleElement = document.getElementById('listTitle' + listId);
      let noteElement = document.getElementById('listNote' + listId);
      let editBtn = e.currentTarget;

      // Hide the delete button when the Edit button is clicked
      document.getElementById(`deleteBtn${listId}`).style.display = 'none';

      if (editBtn.dataset.editMode === 'edit') {
        editBtn.textContent = 'Confirm';
        editBtn.dataset.editMode = 'confirm';

        enableEditable(titleElement);
        enableEditable(noteElement);

      } else if (editBtn.dataset.editMode === 'confirm') {
        editBtn.textContent = 'Edit';
        editBtn.dataset.editMode = 'edit';
  
        saveChanges(
          listId, 
          { title: titleElement.textContent, description: noteElement.textContent },
          titleElement,
          noteElement
        );
      }
    });
  });

  // ---------------- Open/Close Modal to create/edit Task
  document.addEventListener('click', function(event) {
    let closeModalBtn = document.getElementById('closeModalBtn');
    let modal = document.getElementById('myModal');
    let modalForm = document.getElementById('editCreateTask');
    let modalBtn = document.getElementById('modalBtn');
    let listId = -1;

    if (event.target.classList.contains('edit-task-btn')) {
      let taskDiv = event.target.parentNode.parentNode;
      let listDiv = taskDiv.parentNode; 
      
      let taskId = taskDiv.classList[0].split('-')[2];
      listId = listDiv.querySelector('button').getAttribute('data-list-id');
      
      modalBtn.value = 'Confirm';
      modalForm.action = `/tasks/${taskId}`;
      modalForm.method = 'patch';

      let taskTitle = document.querySelector(`.task-item-${taskId} strong`).textContent;
      let taskNote = document.querySelector(`.task-item-${taskId} p`).textContent;
      let taskCompleted = taskDiv.querySelector('.switch-input.task-checkbox').checked;

  
      // Preencher os campos do formulário com os dados da tarefa
      document.getElementById('taskListId').value = listId;
      document.getElementById('modalTaskTitle').value = taskTitle;
      document.getElementById('modalTaskNote').value = taskNote;
      document.getElementById('modalTaskCompleted').value = taskCompleted;
      // Show modal
      modal.style.display = 'block';
    }else if (event.target.classList.contains('openModalBtn')) {
      modalBtn.value = 'Create';
      modalForm.action = '/tasks'
      modalForm.method = 'post'

      listId = event.target.getAttribute('data-list-id');

      document.getElementById('taskListId').value = listId;
      document.getElementById('modalTaskTitle').value = '';
      document.getElementById('modalTaskNote').value = '';
      document.getElementById('modalTaskCompleted').value = 'false';
      // Show modal
      modal.style.display = 'block';
    }
  
    closeModalBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  
    window.addEventListener('click', function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });
  });

  function updateCompleted(checkbox) {
      let completed = checkbox.checked;
      let taskId = checkbox.dataset.taskId; // Supondo que o valor seja o ID da task
      let title = checkbox.dataset.title;
      let note = checkbox.dataset.note;
      let listId = checkbox.dataset.listId;
    
      // Agora você pode fazer o que quiser com esses dados
      console.log(`Task ID: ${taskId}, Completed: ${completed}, Title: ${title}, Note: ${note}, List ID: ${listId}`);
    
      // Além disso, você pode enviar esses dados para o servidor usando uma solicitação AJAX, se necessário
      // Exemplo de requisição usando Fetch API
      fetch(`/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({ task: { title: title, note: note, completed: completed, listId: listId } }),
      })
      .then(response => response)
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }

  // Adicionando o evento onchange a todos os checkboxes com a classe 'task-checkbox'
  // let checkboxes = document.querySelectorAll('.task-checkbox');
  // checkboxes.forEach(function(checkbox) {
  //     checkbox.addEventListener('change', function() {
  //         updateCompleted(this);
  //     });
  // });
});