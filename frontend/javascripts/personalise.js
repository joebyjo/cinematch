

  document.addEventListener("DOMContentLoaded", () => {
    const pills = document.querySelectorAll(".pill");
    const nextBtn = document.querySelector(".next-btn");

    // Update next button state
    function updateNextButton() {
      const hasSelected = getSelectedPills().length > 0;
      nextBtn.disabled = !hasSelected;
      nextBtn.style.opacity = hasSelected ? "1" : "0.5";
      nextBtn.style.cursor = hasSelected ? "pointer" : "not-allowed";
    }

    // Toggle pill selection and update button
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pill.classList.toggle("selected");
        updateNextButton();
      });
    });

    // Initial state check
    updateNextButton();

    // Handle "Next" button click
    nextBtn.addEventListener("click", () => {
      const selected = getSelectedPills();
      if (selected.length === 0) {
        alert("Please select at least one genre before continuing.");
        return;
      }

      // Log or send selected genres
      console.log("Selected genres:", selected);

      // Example: proceed to next page
      // window.location.href = "/swipe";
    });
  });
