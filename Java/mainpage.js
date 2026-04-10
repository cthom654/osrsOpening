document.addEventListener('DOMContentLoaded', function() {
    const combatStyles = document.querySelectorAll('.combat-style');
    
    console.log('Found combat styles:', combatStyles.length); // Debug log
    
    combatStyles.forEach(button => {
        button.addEventListener('click', function() {
            if (button.classList.contains('selected')) {
                return; // already selected, do nothing
            }
            const icon = button.querySelector('img');
            console.log('Clicked:', button.getAttribute('aria-label') || icon?.alt); // Debug log
            console.log('Data-selected:', button.dataset.selected); // Debug log
            
            // Remove 'selected' from all and reset their images
            combatStyles.forEach(i => {
                i.classList.remove('selected');
                const iIcon = i.querySelector('img');
                if (iIcon) {
                    iIcon.src = i.dataset.original;
                }
            });
            
            // Add 'selected' to clicked button and swap to selected image
            button.classList.add('selected');
            if (icon) {
                icon.src = button.dataset.selected;
            }

            // Change cursor based on the selection of combat style
            if (button.dataset.cursor) {
                document.body.style.cursor = `url(${button.dataset.cursor}), auto`;
            } else {
                document.body.style.cursor = 'auto';
            }
        });
    });

    const monsterButtons = document.querySelectorAll('.monster-item');
    monsterButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (button.classList.contains('selected')) {
                return; // already selected, do nothing
            }
            monsterButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });
});