
  document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('postTextarea');
    const placeholder = document.getElementById('postButtonPlaceholder');
    const imageBtn = document.getElementById('imageUploadBtn');
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('imagePreviewContainer');
    let postButton = null;

    // Show/hide Post button based on textarea input
    textarea.addEventListener('input', function () {
      const hasText = textarea.value.trim().length > 0;

      if (hasText && !postButton) {
        postButton = document.createElement('button');
        postButton.textContent = 'Post';
        postButton.className = 'btn btn-sm btn-primary text-white';
        postButton.type = 'button';
        placeholder.appendChild(postButton);

        postButton.addEventListener('click', handleSubmit);
      }

      if (!hasText && postButton) {
        placeholder.removeChild(postButton);
        postButton = null;
      }
    });

    // Open file selector
    imageBtn.addEventListener('click', function () {
      imageInput.click();
    });

    // Preview selected image
    imageInput.addEventListener('change', function () {
      const file = imageInput.files[0];

      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function (e) {
          previewContainer.innerHTML = '';

          const img = document.createElement('img');
          img.src = e.target.result;
          img.className = 'img-fluid rounded mb-2';
          img.style.maxHeight = '200px';
          previewContainer.appendChild(img);
        };

        reader.readAsDataURL(file);
      } else {
        previewContainer.innerHTML = '';
        alertify.error('Please select a valid image file.');
      }
    });

    // Handle post submission
    async function handleSubmit() {
      const message = textarea.value.trim();
      if (!message) {
        alertify.error('Please enter some text to post.');
        return;
      }

      postButton.disabled = true;
      postButton.textContent = 'Posting...';

      const formData = new FormData();
      formData.append('message', message);

      if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
      }

      try {
        const response = await fetch('https://sdu.onrender.com/api/posts', {
          method: 'POST',
          body: formData,
          credentials: 'include', // include cookies if logged in
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to submit post');
        }

        const result = await response.json();
        console.log('Post created:', result);

        // Reset UI
        textarea.value = '';
        imageInput.value = '';
        previewContainer.innerHTML = '';
        if (postButton) {
          placeholder.removeChild(postButton);
          postButton = null;
        }

        alertify.success('Post submitted successfully!');
        setTimeout(() => {
          location.reload(); // Refresh feed
        }, 1500);
      } catch (error) {
        console.error('Post error:', error);
        alertify.error(error.message || 'Error submitting post.');
        postButton.disabled = false;
        postButton.textContent = 'Post';
      }
    }
  });
