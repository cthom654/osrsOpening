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

async function loadMonster(name) {
    
    // Single request — wikitext + image, all through /api.php which accepts origin=*
    const params = new URLSearchParams({
        action:  'query',
        prop:    'revisions|pageimages',
        rvslots: 'main',
        rvprop:  'content',
        piprop:  'original',
        titles:  name,
        format:  'json',
        origin:  '*'
    });

    const res  = await fetch(`https://oldschool.runescape.wiki/api.php?${params}`);
    const data = await res.json();

    const page     = Object.values(data.query.pages)[0];
    const wikitext = page.revisions[0].slots.main['*'];
    console.log(wikitext.substring(0, 800));
    const imageUrl = page.original?.source ?? '../assets/monster_placeholder.png';

    // Parse stats
    const hp = wikitext.match(/\|\s*hitpoints\s*=\s*(\d+)/)?.[1] ?? '???';

    const weaknessMap = {
        'Cerberus':        'Melee',
        'Callisto':        'Ranged',
        'Corporeal Beast': 'Magic'
    };
    const weakness = weaknessMap[name] ?? 'Unknown';

    // Parse drops
    const drops = [];
    const rx = /\{\{Drop\|([^|]+)\|[^|]*\|[^|]*\|([^|]+)\|([^|}\n]+)/g;
    let m;
    while ((m = rx.exec(wikitext)) !== null) {
        drops.push({ item: m[1].trim(), rarity: m[2].trim(), qty: m[3].trim() });
        if (drops.length >= 20) break;
    }

    // Render
    document.getElementById('monster-name').textContent     = page.title;
    document.getElementById('monster-image').src            = imageUrl;
    document.querySelector('.hp-text').textContent          = `HP: ${hp}`;
    document.getElementById('monster-weakness').textContent = `Weakness: ${weakness}`;

    const table = document.getElementById('monster-drop-table');
    table.innerHTML = drops.map(d =>
        `<tr>
            <td>${d.item}</td>
            <td>${d.qty}</td>
            <td data-rarity="${d.rarity.toLowerCase()}">${d.rarity}</td>
        </tr>`
    ).join('');
    table.removeAttribute('hidden');

    document.getElementById('monster-container').style.display = 'block';
    // Reset HP bar to green
    document.querySelector('.hp-bar').style.width      = '100%';
    document.querySelector('.hp-bar').style.background = '#00b800';
    document.querySelector('.hp-text').textContent     = `HP: ${hp} / ${hp}`;
}



document.getElementById('monster-container').addEventListener('click', function() {
    const hpText = document.querySelector('.hp-text');
    // Stop if already defeated
    if (hpText.textContent.includes('defeated')) return;
    const selectedStyle = document.querySelector('.combat-style.selected');
    if (!selectedStyle) return;

    const isMage   = selectedStyle.classList.contains('mage-att');
    const isMelee  = selectedStyle.classList.contains('melee-att');
    const isRanged = selectedStyle.classList.contains('range-att');

    const currentMonster = document.getElementById('monster-name').textContent;

    let damage = 0;
    if (currentMonster === 'Corporeal Beast' && isMage)  damage = 200;
    if (currentMonster === 'Callisto'        && isRanged) damage = 200;
    if (currentMonster === 'Cerberus'        && isMelee)  damage = 200;

    if (damage === 0) return;

    const hpBar  = document.querySelector('.hp-bar');

    let [current, max] = hpText.textContent.replace('HP: ', '').split(' / ').map(Number);
    current = Math.max(0, current - damage);

    hpText.textContent = `HP: ${current} / ${max}`;
    hpBar.style.width  = `${(current / max) * 100}%`;

    if (current <= 0) {
        hpBar.style.background = '#880000';
        hpText.textContent     = `${currentMonster} has been defeated!`;
    }
});