// Adfundum Meter JavaScript
class AdfundumMeter {
  constructor() {
    this.isGameActive = false;
    this.isKeyPressed = false;
    this.startTime = null;
    this.endTime = null;
    this.timerInterval = null;
    this.currentPlayer = "";
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.stream = null;

    this.initializeElements();
    this.bindEvents();
    this.loadScores();
  }

  initializeElements() {
    // Form elements
    this.nameForm = document.getElementById("nameForm");
    this.gameArea = document.getElementById("gameArea");
    this.playerNameInput = document.getElementById("playerName");
    this.submitNameBtn = document.getElementById("submitName");
    this.currentPlayerSpan = document.getElementById("currentPlayer");

    // Game elements
    this.startGameBtn = document.getElementById("startGame");
    this.resetGameBtn = document.getElementById("resetGame");
    this.timerDisplay = document.getElementById("timer");
    this.statusDisplay = document.getElementById("status");

    // Webcam elements
    this.webcam = document.getElementById("webcam");
    this.enableWebcamBtn = document.getElementById("enableWebcam");
    this.recordingStatus = document.getElementById("recordingStatus");
    // Scoreboard elements
    this.scoresList = document.getElementById("scoresList");
  }

  bindEvents() {
    // Form submission
    this.submitNameBtn.addEventListener("click", () => this.submitName());
    this.playerNameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.submitName();
    });

    // Game controls
    this.startGameBtn.addEventListener("click", () => this.startGame());
    this.resetGameBtn.addEventListener("click", () => this.resetGame());

    // Key events for "8" key
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.addEventListener("keyup", (e) => this.handleKeyUp(e));
    // Webcam
    this.enableWebcamBtn.addEventListener("click", () => this.enableWebcam());

    // Prevent page reload on spacebar or other keys
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    });
  }
  submitName() {
    const name = this.playerNameInput.value.trim();
    if (name === "") {
      alert("Voer je naam in!");
      return;
    }

    this.currentPlayer = name;
    this.currentPlayerSpan.textContent = name;
    this.nameForm.classList.add("hidden");
    this.gameArea.classList.remove("hidden");

    // Focus on the document to capture key events
    document.body.focus();
  }

  startGame() {
    this.isGameActive = true;
    this.isKeyPressed = false;
    this.startTime = null;
    this.endTime = null;
    this.startGameBtn.disabled = true;
    this.statusDisplay.textContent = "Begin met drinken om de tijd te starten!";
    this.statusDisplay.className = "status waiting";
    this.timerDisplay.textContent = "0.00";

    // Focus on the document to ensure key events are captured
    document.body.focus();
  }
  resetGame() {
    this.isGameActive = false;
    this.isKeyPressed = false;
    this.startTime = null;
    this.endTime = null;
    this.currentPlayer = "";

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.stopRecording();
    // Reset all displays
    this.startGameBtn.disabled = false;
    this.statusDisplay.textContent = "Begin met drinken wanneer je klaar bent!";
    this.statusDisplay.className = "status";
    this.timerDisplay.textContent = "0.00";
    this.playerNameInput.value = "";
    this.currentPlayerSpan.textContent = "";

    // Show name form and hide game area
    this.nameForm.classList.remove("hidden");
    this.gameArea.classList.add("hidden");
    // Reset webcam button if it was enabled
    if (this.enableWebcamBtn.disabled) {
      this.enableWebcamBtn.textContent = "Webcam Inschakelen";
      this.enableWebcamBtn.disabled = false;
    }

    // Focus on name input
    this.playerNameInput.focus();
  }

  handleKeyDown(e) {
    // Only respond to "8" key
    if (e.key !== "8" && e.code !== "Digit8") return;

    e.preventDefault();

    if (!this.isGameActive || this.isKeyPressed) return;
    this.isKeyPressed = true;
    this.startTime = Date.now();

    this.statusDisplay.textContent = "Aan het timen... Blijf drinken!";
    this.statusDisplay.className = "status recording";

    this.startTimer();
    this.startRecording();
  }

  handleKeyUp(e) {
    // Only respond to "8" key
    if (e.key !== "8" && e.code !== "Digit8") return;

    e.preventDefault();

    if (!this.isGameActive || !this.isKeyPressed) return;    this.isKeyPressed = false;
    this.endTime = Date.now();

    this.stopTimer();
    this.stopRecording();
    
    const duration = ((this.endTime - this.startTime) / 1000).toFixed(2);
    // Update timer display to show exact final time
    this.timerDisplay.textContent = duration;
    this.statusDisplay.textContent = `Klaar! Tijd: ${duration}s`;
    this.statusDisplay.className = "status finished";
    
    this.saveScore();

    this.isGameActive = false;
    this.startGameBtn.disabled = false;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.startTime) {
        const elapsed = (Date.now() - this.startTime) / 1000;
        this.timerDisplay.textContent = elapsed.toFixed(2);
      }
    }, 10);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  async enableWebcam() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.webcam.srcObject = this.stream;
      this.enableWebcamBtn.textContent = "Webcam Ingeschakeld";
      this.enableWebcamBtn.disabled = true;
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Kan geen toegang krijgen tot webcam. Controleer de rechten.");
    }
  }

  startRecording() {
    if (!this.stream) return;

    try {
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: "video/webm" });
        this.downloadRecording(blob);
      };

      this.mediaRecorder.start();
      this.recordingStatus.classList.remove("hidden");
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  }
  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    this.recordingStatus.classList.add("hidden");
  }

  downloadRecording(blob) {
    if (!this.startTime || !this.endTime || !this.currentPlayer) return;

    const duration = ((this.endTime - this.startTime) / 1000).toFixed(2);
    const filename = `${this.currentPlayer}_${duration}s.webm`;

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";

    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    URL.revokeObjectURL(url);

    console.log(`Recording downloaded as: ${filename}`);
  }

  saveScore() {
    if (!this.startTime || !this.endTime) return;

    const duration = ((this.endTime - this.startTime) / 1000).toFixed(2);
    const score = {
      name: this.currentPlayer,
      time: parseFloat(duration),
      date: new Date().toLocaleString(),
    };
    let scores = this.getScores();
    scores.push(score);
    scores.sort((a, b) => a.time - b.time); // Sort by shortest time first (best scores)

    sessionStorage.setItem("adfundumScores", JSON.stringify(scores));
    this.displayScores();
  }

  getScores() {
    const scores = sessionStorage.getItem("adfundumScores");
    return scores ? JSON.parse(scores) : [];
  }

  loadScores() {
    this.displayScores();
  }
  displayScores() {
    const scores = this.getScores();

    if (scores.length === 0) {
      this.scoresList.innerHTML = "<p>Nog geen scores!</p>";
      return;
    }

    const scoresHTML = scores
      .map(
        (score, index) => `
            <div class="score-item">
                <div class="score-info">
                    <div class="score-name">#${index + 1} ${score.name}</div>
                    <div class="score-date">${score.date}</div>
                </div>
                <div class="score-time">${score.time}s</div>
                <button class="delete-score-btn" onclick="game.deleteScore(${index})" title="Verwijder deze score">×</button>
            </div>
        `
      )
      .join("");

    this.scoresList.innerHTML = scoresHTML;
  }
  deleteScore(index) {
    if (confirm("Weet je zeker dat je deze score wilt verwijderen?")) {
      let scores = this.getScores();
      scores.splice(index, 1);
      sessionStorage.setItem("adfundumScores", JSON.stringify(scores));
      this.displayScores();
    }
  }
}

// Initialize the game when the page loads
let game;
document.addEventListener("DOMContentLoaded", () => {
  game = new AdfundumMeter();
  // Add some helpful instructions
  console.log("Adfundum Meter geladen!");
  console.log(
    "Instructies: Voer je naam in, klik start, begin dan met drinken en houd vol zo lang mogelijk!"
  );

  // Focus the name input
  document.getElementById("playerName").focus();
});

// Prevent context menu and other default behaviors that might interfere
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("selectstart", (e) => e.preventDefault());
