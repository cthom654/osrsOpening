//==============================
// Data Collection for monsters
//==============================
const monsterCache = {}; 
//This is the notebook I write the info into (only have to get once).
const WIKI_API_URL = 'https://oldschool.runescape.wiki/api.php';
//This is me writing the address of the library where the info comes from (OSRS Wiki).
console.log('Moster System Ready!');
//This will be a print message that lets me know its working.

//DEFINITIONS
/*const = "constant" - means this won't change.
monsterCache = the name for storage (can call it anything).
{} = empty curly braces = an empty container.
WIKI_API_URL = the name for the website address.
"=" = assign/set the value.
'https://...' = the actual web address in quotes.
console.log() = print a message to the browser's console (developer tools).*/

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

