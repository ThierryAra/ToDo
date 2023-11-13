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

// ---------------- Open/Close Modal to create Task
document.addEventListener('click', function(event) {
    let closeModalBtn = document.getElementById('closeModalBtn');
    let modal = document.getElementById('myModal');
  
    if (event.target.classList.contains('openModalBtn')) {
      let listId = event.target.getAttribute('data-list-id');
      document.getElementById('taskListId').value = listId;
  
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
});