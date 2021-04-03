const gameEngine = () => {

    !sessionStorage.getItem("score")? sessionStorage.setItem('score', 0):null;

    let playerChoice = "";
    let computerChoice = "";
    let winner = "";
    const scoreText = document.querySelector(".score-container h1");

    // Global events
    const ruleButton = document.querySelector(".rule-button");
    const closeRuleButton = document.querySelector(".close-rule");
    const modal = document.querySelector(".modal_container");
    ruleButton.addEventListener("click", ()=>{
        modal.classList.add("show-modal");
    });
    closeRuleButton.addEventListener("click", ()=>{
        modal.classList.remove("show-modal");
    })



    // End of Globals events
    function startOptions() {
        const pickTitle = document.querySelector(".pick-text");
        const housePickContainer = document.querySelector(".house-pick");
        const playContainer = document.querySelector(".play-container");
        const resultText = document.querySelector(".result");
        const choicesTiles = document.querySelectorAll("[data-toggle=choices]");
        const choiceClones = [];
        const playAgainButton = document.querySelector("div > button");
        let formerComputerChoiceNode;
        
        // Setup
        addListener();
        scoreText.textContent = sessionStorage.getItem("score");
        addChoiceClones();
        playAgainButton.addEventListener("click", resetGame);

        // Start
        function gameStart() {
            
            formerComputerChoiceNode = document.querySelector(".house-pick > div");
            addShadowEffectOnly();
            housePickContainer.addEventListener("transitionend", computerPickChoice);
            
        }
        // Utility Functions
        function addListener(){
            choicesTiles.forEach(choice => {
                choice.addEventListener("click", setup);
            })
        }
        function removeListener(){
            choicesTiles.forEach(choice =>{
                choice.removeEventListener("click", setup);
                choice.addEventListener("click", event => event.preventDefault());
            })
        }
        function setup(event) {
            removeListener();
            event.preventDefault();
            event.target.classList.add("go-left");
            playerChoice = event.target;

            pickTitle.classList.add("show-text");
            housePickContainer.classList.add("show-text");
            playContainer.classList.add("fadeOut");
            hideUnpickedChoices(event.target);
            gameStart();
        }
        function resetGame() {
            addListener();
            pickTitle.classList.remove("show-text");
            playerChoice.classList.remove("go-left", "shadow", "final-left");
            winner? winner.classList.remove("shadow-winner"): "";
            housePickContainer.classList.remove("show-text", "final-right");
            resultText.classList.remove("show");
            playContainer.classList.remove("fadeOut");

            hideUnpickedChoices(playerChoice);

            let parent = formerComputerChoiceNode.parentNode;
            parent.replaceChild(document.createElement("div"), formerComputerChoiceNode);
            
            gameStart();
            removeCloneShadowWinner();

            function removeCloneShadowWinner() {
                choiceClones.map(clone => clone.classList.remove("shadow-winner"));
            }
        }
        
        function hideUnpickedChoices(picked) {
            choicesTiles.forEach(choice => {
                if (choice != picked) {
                    choice.classList.toggle("hideChoices");
                }
            })
        }

        function addChoiceClones() {
            choicesTiles.forEach(choice => {
                let newNode = choice.cloneNode(true);
                newNode.classList.add("go-right");
                choiceClones.push(newNode);
            })
            choiceClones.map(clone => {
                clone.addEventListener("click", event => {
                    event.preventDefault();
                })
            })
        }

        function addShadowEffectOnly() {
            choicesTiles.forEach(choice => {
                choice.addEventListener("transitionend", event => {
                    event.target.classList.add("shadow");
                })
            })
        }

        function computerPickChoice() {
            const formerParent = formerComputerChoiceNode.parentNode;
            let randomNumber = Math.floor(Math.random() * 3);
            let randomComputerChoice = choiceClones[randomNumber];
            computerChoice = randomComputerChoice;
            const constraint = 20;

            changeComputerPickAnimation(0, 0);
            housePickContainer.removeEventListener("transitionend", computerPickChoice);
            displayResult(checkWinner());
            animateChoicesLeftRight();


            function changeComputerPickAnimation(end, counter) {
                if (end == constraint) {
                    formerParent.replaceChild(randomComputerChoice, formerComputerChoiceNode);
                    formerComputerChoiceNode = randomComputerChoice;
                    return;
                }
                counter = counter == 3 ? 0 : counter;

                formerParent.replaceChild(choiceClones[counter], formerComputerChoiceNode);
                formerComputerChoiceNode = choiceClones[counter];

                setTimeout(() => {
                    changeComputerPickAnimation(end + 1, counter + 1)
                }, 50);
            }

            function animateChoicesLeftRight() {
                setTimeout(() => {
                    playerChoice.classList.add("final-left");
                    housePickContainer.classList.add("final-right");
                }, 1500);
            }
        }

        function checkWinner() {
            let player = playerChoice.getAttribute("data-value");
            let computer = computerChoice.getAttribute("data-value");
            let flag;

            if (player == computer) {
                flag = "draw";
            } else{
                switch (player) {
                    case "rock":
                        flag = computer == "scissor"? "win":"lose";
                        break;
                    case "paper":
                        flag = computer == "rock"? "win":"lose";
                        break;
                    case "scissor":
                        flag = computer == "paper"? "win":"lose";
                        break;
                }
            }
            return flag;
        }

        function displayResult(result) {
            switch (result) {
                case "draw":
                    resultText.childNodes[0].nodeValue = "DRAW!";
                    break;
                case "win":
                    resultText.childNodes[0].nodeValue = "YOU WIN";
                    sessionStorage.setItem("score", parseInt(sessionStorage.getItem("score"))+1);
                    winner = playerChoice;
                    setTimeout(() => {
                        playerChoice.classList.add("shadow-winner");
                        scoreText.textContent = sessionStorage.getItem("score");
                    }, 1500);
                    break;
                case "lose":
                    resultText.childNodes[0].nodeValue = "YOU LOSE";
                    winner = playerChoice;
                    setTimeout(() => {
                        computerChoice.classList.add("shadow-winner");
                    }, 1500);
                    break;
            }
            resultText.classList.add("show");
        }
    }

    startOptions();
};

gameEngine();