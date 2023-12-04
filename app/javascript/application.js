// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('DOMContentLoaded', function() {
  // --------------- Edit list - title/description
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
      let span = editBtn.getElementsByTagName('span')[0];
      let i = editBtn.getElementsByTagName('i')[0];

      if (editBtn.dataset.editMode === 'edit') {

        i.style.display = 'none';
        span.textContent = 'Confirm';
        editBtn.dataset.editMode = 'confirm';

        enableEditable(titleElement);
        enableEditable(noteElement);

      } else if (editBtn.dataset.editMode === 'confirm') {
        span.textContent = '';
        editBtn.dataset.editMode = 'edit';
        i.style.display = 'inline';

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
  let modal = document.getElementById('myModal');
  
  document.addEventListener('click', function(event) {
    let modalForm = document.getElementById('editCreateTask');
    let modalBtn = document.getElementById('modalBtn');
    let listId = -1;

    if (event.target.classList.contains('edit-task-btn')) {
      let taskDiv = event.target.parentNode.parentNode;
      let listDiv = taskDiv.parentNode; 
      
      let taskId = taskDiv.classList[1].split('-')[2];
      listId = listDiv.querySelector('.openModalBtn').getAttribute('data-list-id');

      modalBtn.value = 'Confirm';
      modalForm.action = `/tasks/${taskId}`;
      modalForm.method = 'patch';
      
      let taskTitle = document.querySelector(`.task-title-${taskId}`).textContent.trim();
      let taskNote = document.querySelector(`.task-item-${taskId} p`).textContent;
      let taskCompleted = taskDiv.querySelector('.switch-input.task-checkbox').checked;
      
      // Preencher os campos do formulário com os dados da tarefa
      document.getElementById('taskListId').value = listId;
      document.getElementById('modalTaskTitle').value = taskTitle;
      document.getElementById('modalTaskNote').value = taskNote;
      document.getElementById('modalTaskCompleted').value = taskCompleted;
      
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
      
      modal.style.display = 'block';
    }
  
    let closeModalBtn = document.getElementById('closeModalBtn');
    closeModalBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  
    window.addEventListener('click', function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // ---------------- Flash modal
  let flashModal = document.getElementById('divFlashMessage');
  
  if (document.getElementById('flashMessage').innerText.trim() !== '') {
    flashModal.style.display = 'block';
    setTimeout(function () {
      flashModal.style.display = 'none';
      document.getElementById('flashMessage').innerText = '';
    }, 3000);
  }
});