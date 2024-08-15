# The Button
A websocket button app for games at home. Only one person can press the button at a time. Perfect for games like 'depixelate', where an image is slowly revealed and the first person to guess what it is wins. The button makes it so that only one person can guess at a time, and the game admin can 'reset' the button to allow the next person to guess. There is also a display mode that can be used for a screen, to show the current status of the button.

# Display Mode
every user can enter display mode, but users in display mode will be removed from the users list.

Some buttons might be hidden during display mode, and can be accessed by scrolling down.

Smaller width screens will only show the button and a user list, the rest will be hidden, so you can share your screen with e.g. powerpoint.

# Admin Mode (Display as owner)
will also enter display mode, but an option 'pseudo' will be shown too. If you press this button the user will still be hidden from the scoreboard but the user will be able to return to the normal menu and kick people from the game. Especially useful on phones where normal display mode only displays the button.

# ID Change
Every user gets an ID, this ID is used to identify a device. Might you want to change your ID, you can do so by holding the 'join room' button for 5 seconds, until an alert pops up. This alert will ask you for a new ID.

# Usage
```bash
cd client
bun run build

cd ../server
bun start
```

open localhost:3003/ in your browser

Enjoy! 🎉