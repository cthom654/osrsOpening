document.addEventListener('DOMContentLoaded', function() {
    const combatStyles = document.querySelectorAll('.combat-style');
    
    console.log('Found combat styles:', combatStyles.length); // Debug log
    
    combatStyles.forEach(img => {
        img.addEventListener('click', function() {
            console.log('Clicked:', img.alt); // Debug log
            console.log('Data-selected:', img.dataset.selected); // Debug log
            
            // Remove 'selected' from all and reset their images
            combatStyles.forEach(i => {
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
});