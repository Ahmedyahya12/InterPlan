export function showAlertWithProgress(text, colorAlert, bgProgress) {
    // Create the alert with progress bar
    const alertContainer = document.getElementById("alertContainer");
  
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert  ${colorAlert} alert-with-progress`;
    alertDiv.setAttribute("role", "alert");
    alertDiv.innerHTML = `
        <strong> ${text}</strong>
          <div class="progress" style="height: 5px;">
            <div class="progress">
             <div class=" ${bgProgress} progress-bar" role="progressbar" style="width:0%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
            </div>
          </div>
  
      `;
  
    alertContainer.appendChild(alertDiv);
  
    // Progress bar animation
    const progressBar = alertDiv.querySelector(".progress-bar");
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 4; // Increase progress by 5% every 100ms
      progressBar.style.width = `${progress}%`;
      progressBar.setAttribute("aria-valuenow", progress);
  
      if (progress >= 100) {
        clearInterval(progressInterval); // Stop once the progress reaches 100%
        setTimeout(() => {
          alertDiv.style.display = "none"; // Hide the alert after the progress is complete
        }, 500); // Wait for the progress bar to finish before hiding the alert
      }
    }, 100); // Update progress every 100ms
  }
  