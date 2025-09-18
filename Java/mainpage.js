document.querySelectorAll('.att_method').forEach(img => {
    img.addEventListener('click', function() {
        // Remove 'selected' from all and reset their images
        document.querySelectorAll('.att_method').forEach(i => {
            i.classList.remove('selected');
            i.src = i.dataset.original;
        });
        // Add 'selected' to clicked image and swap to selected image
        img.classList.add('selected');
        img.src = img.dataset.selected;
    });
});