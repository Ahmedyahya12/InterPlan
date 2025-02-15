export function showProgress(message, iconHTML, iconColor) {
    const button = document.querySelector("button"),
      toast = document.querySelector(".toast");
    const closeIcon = document.querySelector(".close"),
      progress = document.querySelector(".progress"),
      icon = document.querySelector(".check");
    
    let timer1, timer2;
  
    toast.style.borderLeft=`6px solid ${iconColor}`
  
    progress.style.setProperty("--progress-color", iconColor);
    // Update message and icon
    const textElements = document.querySelectorAll('.text');
    textElements[0].textContent = message; // First text (success message)
    icon.innerHTML = iconHTML; // Set the icon HTML
    
    // Update icon color
    icon.style.backgroundColor = iconColor;
  
    toast.classList.add("active");
    progress.classList.add("active");
  
    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 5000); // 5 seconds for toast to disappear
  
    timer2 = setTimeout(() => {
      progress.classList.remove("active");
    }, 5300);
  
    closeIcon.addEventListener("click", () => {
      toast.classList.remove("active");
  
      setTimeout(() => {
        progress.classList.remove("active");
      }, 300);
  
      clearTimeout(timer1);
      clearTimeout(timer2);
    });
  }
  