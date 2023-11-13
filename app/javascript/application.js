// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

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