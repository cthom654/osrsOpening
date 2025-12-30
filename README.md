RNGod or RNGloom
An OSRS (Old School RuneScape) drop simulator that lets you test your luck against various monsters.
Features

Monster Selection: Choose from different OSRS monsters including Zulrah, Cerberus, and Callisto
Combat Styles: Select between Mage, Melee, and Range attack styles with themed cursors
Monster Data: Pulls monster information from the OSRS Wiki API
Retro UI: Styled with RuneScape fonts and authentic game aesthetics

File Structure
├── index.html
├── css/
│   └── mainpage.css
├── Java/
│   └── mainpage.js
└── assets/
    ├── background_image.png
    ├── login_box.png
    ├── monster_placeholder.png
    ├── RuneScape-Plain-12.ttf
    └── CombatStyles_*.png
Setup

Clone or download this repository
Ensure all asset files are in the assets/ folder
Open index.html in a web browser

Usage

Select a combat style (Mage, Melee, or Range) from the left side
Choose a monster from the list on the right
The monster card will display with HP bar and stats
Click to simulate combat and drops

Technologies

Vanilla JavaScript
OSRS Wiki API integration
Custom RuneScape font
CSS animations and styling

Notes

Monster data is cached to minimize API calls
Responsive HP bar system
Custom cursor changes based on selected combat style
