"use strict";

//Game
var progressXP = document.getElementById("progressXP");
var displayLvl = document.getElementById("playerlevel");
var displayXP = document.getElementById("playerxp");
var displayXP2 = document.getElementById("playerxp2levelup");
var displayPer = document.getElementById("progress");
var add = document.getElementById("addXP");

//User interface
var ui = document.getElementById("ui");
var settings = document.getElementById("settings");
var setDifficulty = document.getElementById("set_difficulty");
var setCheat = document.getElementById("set_cheat");

//Console
var lastEntry = "";

//Achievements
var ach = [false, false, false, false, false, false];

//CPS
var currentCPS = 0;
let isFirstTime = true;
let CPStimer;

//**//PLAYER OBJECT//**//
var player = {
	level: 1,
	score: 0,
	scoreLeft: 10,
	scoreGoal: 10,
	difficultyFactor: 1.1,
}

progressXP.style.width = "0px";

//**//CALCULATE CPS//**//
function calculateCPS() {
	document.getElementById("playerCps").innerHTML = "Clicks per second (CPS): " + currentCPS;
	currentCPS = 0;
}

//**//GAMEPLAY MECHANISM//**//
add.onclick = function () {
	if (isFirstTime) {
		//Calculate CPS
		CPStimer = setInterval(calculateCPS, 1000);
		isFirstTime = false;
	}

	progressXP.style.top = "-1px";
	if (add.innerHTML !== "Level up!") {
		add.innerHTML = "Keep clicking!";
	}

	if (player.scoreLeft === 0) {
		player.scoreGoal = (player.scoreGoal * player.difficultyFactor);
		if (player.difficultyFactor.toString().slice(2) > 4) {
			player.scoreGoal = (player.scoreGoal + 1).toFixed(0);
		} else {
			player.scoreGoal = (player.scoreGoal.toFixed(0));
		}

		progressXP.style.width = "0px";

		player.level = player.level + 1;
		displayLvl.innerHTML = "Level " + player.level;
		player.scoreLeft = player.scoreGoal;
		displayXP2.innerHTML = `Score left to level ${player.level + 1}: ${player.scoreLeft}`;
		displayPer.innerHTML = "0%";
		displayPer.style.color = "white";

		ui.style.boxShadow = "0 0 10px 2px white";
		add.innerHTML = "Level up!";
		setTimeout(function () {
			ui.style.boxShadow = "none";
			if (add.innerHTML !== "Keep clicking!") {
				add.innerHTML = "Click to continue";
			}
		}, 1000);
		if (player.level === 2) {
			if (ach[0] === false) {
				game_achievement("Everything has a start", "Level up once");
				ach[0] = true;
			}
		} else if (player.level === 25) {
			setDifficulty[2].removeAttribute("disabled");
			setDifficulty[2].innerHTML = "Challenge";
			setDifficulty[2].setAttribute("title", "Score goal increases of 50% per level.");
			game_log("Difficulty unlock level reached.");
			if (ach[1] === false) {
				game_achievement("Challenger", "Unlock <em>Challenge</em> difficulty level");
				ach[1] = true;
			}
		} else if (player.level === 50) {
			setDifficulty[3].removeAttribute("disabled");
			setDifficulty[3].innerHTML = "Impossible";
			setDifficulty[3].setAttribute("title", "Score goal increases of 100% per level.");
			game_log("Difficulty unlock level reached.");
			if (ach[2] === false) {
				game_achievement("Not hard enough, uh?", "Unlock <em>Impossible</em> difficulty level");
				ach[2] = true;
			}
		} else if (player.level === 75) {
			if (ach[3] === false) {
				game_achievement("Minecraft fan", "Reach level 75");
				ach[3] = true;
			}
		} else if (player.level === 100) {
			if (ach[4] === false) {
				game_achievement("Autospeed clicker", "Reach level 100");
				ach[4] = true;
			}
		} else if (player.level === 125) {
			if (ach[5] === false) {
				game_achievement("Do your homework", "Reach level 125");
				ach[5] = true;
			}
		} else if (player.level === 150) {
			if (ach[5] === false) {
				game_achievement("To be or not to be, that is the question", "Reach level 150");
				ach[5] = true;
			}
		}

	} else {
		player.scoreLeft = (player.scoreLeft - 1);
		displayXP2.innerHTML = `Score left to level ${player.level + 1}: ${player.scoreLeft}`;
		player.score = player.score + 1;
		displayXP.innerHTML = `Total score: ${player.score}`;
		displayPer.innerHTML = (100 * (player.scoreGoal - player.scoreLeft) / player.scoreGoal).toFixed(0) + "%";
		progressXP.style.width = parseInt(displayPer.innerHTML.slice(0, -1)) + "%";
		if (parseInt(displayPer.innerHTML.slice(0, -1)) >= 50) {
			displayPer.style.color = "black";
		}
	}

	currentCPS++;
}

//**//TOGGLE SETTINGS PANEL//**//
settings.addEventListener("mouseover", function () {
	settings.style.left = 0;
});
settings.addEventListener("mouseleave", function () {
	settings.style.left = "-275px";
});


//**//BUTTON CONTENT ANIMATION//**//
add.onblur = function () {
	progressXP.style.top = "0px";
	ui.style.boxShadow = "none";
	if (player.scoreLeft === 0) {
		add.innerHTML = "Click to continue";
	} else {
		add.innerHTML = "Don't give up!";
		setTimeout(function () {
			add.innerHTML = "Click to continue";
		}, 1500);
	}
	currentCPS = 0;
}

//**//CLICK ANIMATION//**//
window.addEventListener("click", function (e) {
	if (e.target.closest("#addXP")) {
		var x = e.pageX;
		var y = e.pageY;

		var elem = document.createElement("span");
		elem.setAttribute("class", "score");
		elem.innerHTML = "<strong>+ 1</strong>";
		elem.style.left = x + "px";
		elem.style.top = y - 30 + "px";
		document.body.append(elem);

		setTimeout(function () {
			elem.style.top = parseInt(elem.style.top.slice(0, -2)) - 60 + "px";
			elem.style.opacity = 1;
		}, 300);
		setTimeout(function () {
			elem.style.top = parseInt(elem.style.top.slice(0, -2)) - 60 + "px";
			elem.style.opacity = 0;
		}, 600);
		setTimeout(function () {
			document.body.removeChild(elem);
		}, 900);
	}
});

//**//CHANGE DIFFICULTY//**//
setDifficulty.onchange = function () {
	if (setDifficulty.selectedIndex === 0) {
		player.difficultyFactor = 1;
		game_reset();
		game_log("Difficulty level set to Easy.");
	} else if (setDifficulty.selectedIndex === 1) {
		player.difficultyFactor = 1.1;
		game_reset();
		game_log("Difficulty level set to Normal.");
	} else if (setDifficulty.selectedIndex === 2) {
		player.difficultyFactor = 1.5;
		game_reset();
		game_log("Difficulty level set to Challenge.");
	} else if (setDifficulty.selectedIndex === 3) {
		player.difficultyFactor = 2;
		game_reset();
		game_log("Difficulty level set to Impossible.");
	}
}

//**//TOGGLE CHEATS//**//
setCheat.onchange = function () {
	if (setCheat.checked === true) {
		player.difficultyFactor = 1;
		game_reset();
		player.scoreGoal = 1;
		game_log("Ultra-speed cheat enabled.");
	} else {
		player.difficultyFactor = 1.1;
		game_reset();
		game_log("Ultra-speed cheat disabled.");
	}
}

//**//PREVENT USE OF KEYBOARD//**//
window.addEventListener("keydown", function (e) {
	if (!(e.key == "r" && e.getModifierState("Control"))) // allow page reload...
		e.preventDefault();

	if (e.key === "Enter") {
		add.innerHTML = "Don't you even dare!";
		ui.style.boxShadow = "0 0 10px 2px red";
		setTimeout(function () {
			ui.style.boxShadow = "none";
		}, 1500);
		if (ach[0] === false) {
			game_achievement("Cheater", "Try to use the keyboard once");
			ach[0] = true;
		}
	}
});

//**//LOG INFO TO GAME CONSOLE//**//
function game_log(message) {
	if (lastEntry !== "") {
		lastEntry.style.opacity = 0;
		setTimeout(function () {
			document.body.removeChild(lastEntry);
		}, 1000);
	}
	var entry = document.createElement("p");
	entry.innerHTML = message;
	document.body.append(entry);
	entry.setAttribute("style", "position:absolute;padding-left: 10px;transition:bottom 0.3s ease-out, opacity 1.5s ease-out;bottom:-10%;left:0;opacity: 0;");
	setTimeout(function () {
		entry.style.bottom = 0;
		entry.style.opacity = 1;
		lastEntry = entry;
	}, 1000);
	setTimeout(function () {
		entry.style.opacity = 0;
	}, 5000);
}

//**//ACHIEVEMENTS//**//
function game_achievement(header, message) {
	var prompt = document.getElementById("achievement");
	var title = document.getElementById("achievementName");
	var msg = document.getElementById("achievementDes");

	title.innerHTML = header;
	msg.innerHTML = message;
	prompt.style.opacity = 1;
	setTimeout(function () {
		prompt.style.opacity = 0;
	}, 3000);
	game_log("New achievement unlocked!");
}

//**//RESET GAME//**//
function game_reset() {
	player.level = 1;
	player.score = 0;
	player.scoreLeft = 1;
	player.scoreGain = 0.1;
	displayLvl.innerHTML = "Level 1";
	displayXP.innerHTML = "Total score: 0";
	displayXP2.innerHTML = "Score left to level 2: 10";
	displayPer.innerHTML = "0%";
	progressXP.style.width = "0px";
	add.innerHTML = "Game was reset!";
	setTimeout(function () {
		add.innerHTML = "Click to start";
	}, 2000);
}
