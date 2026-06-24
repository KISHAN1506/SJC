(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-admin-form]');
    const previewImage = document.querySelector('[data-preview-image]');
    const resetButton = document.querySelector('[data-reset-form]');

    if (form) {
      const fileInput = form.querySelector('[name="imageFile"]');
      const hiddenImage = form.querySelector('[name="image"]');
      fileInput?.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result || '');
          if (previewImage) previewImage.src = result;
          if (hiddenImage) hiddenImage.value = result;
        };
        reader.readAsDataURL(file);
      });

      // Intercept edit form submissions in the table to perform client-side population
      const editForms = document.querySelectorAll('tbody form[action*="?_method=PUT"]');
      editForms.forEach((editForm) => {
        editForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const productId = editForm.action.split('/').pop().split('?')[0];
          const name = editForm.querySelector('[name="name"]').value;
          const category = editForm.querySelector('[name="category"]').value;
          const fabric = editForm.querySelector('[name="fabric"]').value;
          const price = editForm.querySelector('[name="price"]').value;
          const moq = editForm.querySelector('[name="moq"]').value;
          const occasion = editForm.querySelector('[name="occasion"]').value;
          const description = editForm.querySelector('[name="description"]').value;
          const image = editForm.querySelector('[name="image"]').value;

          form.action = `/admin/products/${productId}?_method=PUT`;
          form.querySelector('[name="id"]').value = productId;
          form.querySelector('[name="image"]').value = image;
          form.querySelector('[name="name"]').value = name;
          form.querySelector('[name="category"]').value = category;
          form.querySelector('[name="fabric"]').value = fabric;
          form.querySelector('[name="price"]').value = price;
          form.querySelector('[name="moq"]').value = moq;
          form.querySelector('[name="occasion"]').value = occasion;
          form.querySelector('[name="description"]').value = description;
          
          if (previewImage) {
            previewImage.src = image || '/images/product-designer.svg';
          }
          
          const statusBadge = document.querySelector('[data-edit-status]');
          if (statusBadge) {
            statusBadge.textContent = `Editing: ${name}`;
            statusBadge.classList.remove('text-bg-light');
            statusBadge.classList.add('text-bg-warning');
          }

          form.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }

    resetButton?.addEventListener('click', () => {
      if (form) {
        form.reset();
        form.action = '/admin/products';
        const hiddenId = form.querySelector('[name="id"]');
        if (hiddenId) hiddenId.value = '';
        const hiddenImage = form.querySelector('[name="image"]');
        if (hiddenImage) hiddenImage.value = '';
      }
      if (previewImage) previewImage.src = '/images/product-designer.svg';
      const statusBadge = document.querySelector('[data-edit-status]');
      if (statusBadge) {
        statusBadge.textContent = 'Create a new product';
        statusBadge.classList.remove('text-bg-warning');
        statusBadge.classList.add('text-bg-light');
      }
    });
  });
})();
