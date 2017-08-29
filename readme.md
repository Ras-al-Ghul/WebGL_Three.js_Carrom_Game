# Carrom Board Game

This game uses **Three.js** which in turn uses **WebGL**.
Browser with **HTML 5** capability needed.

#### Keyboard Controls

The keyboard controls for the game are:

	UP    - Increase Power  
	DOWN  - Decrease Power  
	LEFT  - Aim left  
	RIGHT - Aim right  
	SPACE - Shoot  
	1     - Top View Cam  
	2     - Player View Cam  
	3     - Coin View Cam  
	n     - Toggle to next coin in Coin View Cam  
	b     - Toggle to previous coin in Coin View Cam

#### Starting the game

- Open `index.html` in your browser.

#### Playing the game

You play to pocket the **white** coins.
Your score starts at **100** points and **decreases** by **1** point every **5** seconds.
Each **white** coin you pocket gives you **+5** points.
Each **black** coin you pocket gives you **-20** points.
Each time you sink the **striker** you get **-20** points.
If you pocket the **red** coin and pocket a **white** coin in the next attempt, you get **+25** points. If you fail to pocket a **white** coin in the next attempt, you don't get any points and the red coin returns to the board.
Game **ends** when all the white coins are pocketed.

Enjoy and challenge your friends to a battle of highscores.
