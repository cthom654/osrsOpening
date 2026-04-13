document.addEventListener('DOMContentLoaded', function() {
    const combatStyles = document.querySelectorAll('.combat-style');
 
    combatStyles.forEach(button => {
        button.addEventListener('click', function() {
            if (button.classList.contains('selected')) return;
            const icon = button.querySelector('img');
            combatStyles.forEach(i => {
                i.classList.remove('selected');
                const iIcon = i.querySelector('img');
                if (iIcon) iIcon.src = i.dataset.original;
            });
            button.classList.add('selected');
            if (icon) icon.src = button.dataset.selected;
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
            if (button.classList.contains('selected')) return;
            monsterButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });
 
    document.getElementById('monster-container').addEventListener('click', async function() {
        const hpText = document.querySelector('.hp-text');
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
 
        const hpBar = document.querySelector('.hp-bar');
        let [current, max] = hpText.textContent.replace('HP: ', '').split(' / ').map(Number);
        current = Math.max(0, current - damage);
 
        hpText.textContent = `HP: ${current} / ${max}`;
        hpBar.style.width  = `${(current / max) * 100}%`;
 
        if (current <= 0) {
            hpBar.style.background = '#880000';
            hpText.textContent     = `${currentMonster} has been defeated!`;
            await showDropModal();
        }
    });
});
 

async function showDropModal() {
    const rows = document.querySelectorAll('#monster-drop-table tr');
    if (rows.length === 0) return;

    // Build weighted pool from rarity fractions
    const pool = [];
    rows.forEach(row => {
        const item   = row.cells[0].textContent;
        const qty    = row.cells[1].textContent;
        const rarity = row.cells[2].textContent;

        if (rarity.toLowerCase() === 'always') return;

        // Parse rarity into a weight — e.g. "1/520" → 1, "Always" → 520
        let weight = 1;
        if (rarity.toLowerCase() === 'always') {
            weight = 500;
        } else {
            const match = rarity.match(/(\d+)\/(\d+)/);
            if (match) {
                // Weight = numerator/denominator scaled up so common drops appear more
                weight = Math.round((parseInt(match[1]) / parseInt(match[2])) * 10000);
            }
        }

        // Add the item to the pool 'weight' times
        for (let i = 0; i < weight; i++) {
            pool.push({ item, qty, rarity });
        }
    });

    // Pick randomly from weighted pool
    const picked   = pool[Math.floor(Math.random() * pool.length)];
    const item     = picked.item;
    const qty      = picked.qty;
    const rarity   = picked.rarity;
    const monster  = document.getElementById('monster-name').textContent;

    // Fetch item image
    const params = new URLSearchParams({
        action:      'query',
        prop:        'pageimages',
        piprop:      'thumbnail',
        pithumbsize: '40',
        titles:      item,
        format:      'json',
        origin:      '*'
    });
    const res      = await fetch(`https://oldschool.runescape.wiki/api.php?${params}`);
    const data     = await res.json();
    const page     = Object.values(data.query.pages)[0];
    const imageUrl = page?.thumbnail?.source ?? '';

    document.getElementById('drop-modal-title').textContent = `${monster} dropped:`;
    document.getElementById('drop-modal-item').textContent  = `${item} x${qty} (${rarity})`;
    document.getElementById('drop-modal-img').src           = imageUrl;
    document.getElementById('drop-modal').style.display     = 'flex';
}


async function loadMonster(name) {
    const params = new URLSearchParams({
        action:  'query',
        prop:    'revisions|pageimages',
        rvslots: 'main',
        rvprop:  'content',
        piprop:  'original',
        titles:  name + '|' + name + '/Drops',
        format:  'json',
        origin:  '*'
    });

    const res  = await fetch(`https://oldschool.runescape.wiki/api.php?${params}`);
    const data = await res.json();

    const pages = Object.values(data.query.pages);
    console.log('Page titles returned:', pages.map(p => p.title));
    const mainPage   = pages.find(p => p.title === name);
    const dropPage   = pages.find(p => p.title === `${name}/Drops`);
    console.log('dropPage raw:', dropPage);

    const wikitext      = mainPage?.revisions?.[0]?.slots?.main?.['*'] ?? '';
    console.log('Drop section:', wikitext.indexOf('DropsLine'));
    const dropsWikitext = dropPage?.revisions?.[0]?.slots?.main?.['*'] ?? '';

    console.log('Drops wikitext sample:', dropsWikitext.substring(0, 400));

    const imageUrl = mainPage?.original?.source ?? '../assets/monster_placeholder.png';
    const hp       = wikitext.match(/\|\s*hitpoints\s*=\s*(\d+)/)?.[1] ?? '???';

    const weaknessMap = {
        'Cerberus':        'Melee',
        'Callisto':        'Ranged',
        'Corporeal Beast': 'Magic'
    };
    const weakness = weaknessMap[name] ?? 'Unknown';

    const drops = [];
    const rx = /\{\{DropsLine\|([^}]+)\}\}/g;
    let m;
    while ((m = rx.exec(wikitext)) !== null) {
        const parts = m[1].split('|').map(p => p.includes('=') ? p.split('=')[1].trim() : p.trim());
        console.log('Raw parts:', parts);  // <-- add this
        const item   = parts[0];
        const qty    = parts[1]?.replace(/\{\{[^}]+\}\}/g, '').trim();
        const rarity = parts[2]?.replace(/\{\{[^}]+\}\}/g, '').trim();
        if (item && rarity && qty) drops.push({ item, rarity, qty });
        if (drops.length >= 20) break;
    }

    console.log('Drops found:', drops.length);

    document.getElementById('monster-name').textContent     = mainPage.title;
    document.getElementById('monster-image').src            = imageUrl;
    document.getElementById('monster-weakness').textContent = `Weakness: ${weakness}`;

    const table = document.getElementById('monster-drop-table');
    table.innerHTML = '<tbody>' + drops.map(d =>
        `<tr>
            <td>${d.item}</td>
            <td>${d.qty}</td>
            <td data-rarity="${d.rarity.toLowerCase()}">${d.rarity}</td>
        </tr>`
    ).join('') + '</tbody>';

    document.getElementById('monster-container').style.display = 'block';
    document.querySelector('.hp-bar').style.width              = '100%';
    document.querySelector('.hp-bar').style.background         = '#00b800';
    document.querySelector('.hp-text').textContent             = `HP: ${hp} / ${hp}`;
}