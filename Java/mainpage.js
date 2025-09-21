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

// Change cursor based on the selection of combat style
        if (img.dataset.cursor) {
            document.body.style.cursor = `url(${img.dataset.cursor}), auto`;
        } else {
            document.body.style.cursor = 'auto';
        }
    });
});