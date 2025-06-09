

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
  pills.forEach((pill) => {
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
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dropdown-toggle");
  const menu = document.getElementById("dropdown-menu");
  const chipList = document.getElementById("chip-list");
  const checkboxes = menu.querySelectorAll("input[type='checkbox']");

  // Toggle dropdown open/close
  toggle.addEventListener("click", () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== toggle) {
      menu.style.display = "none";
    }
  });

  // Handle checkbox change
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateChips();
    });
  });

  function updateChips() {
    chipList.innerHTML = "";
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const chip = document.createElement("div");
        chip.className = "chip";
        chip.textContent = checkbox.value;

        const close = document.createElement("span");
        close.className = "remove";
        close.innerHTML = "&times;";
        close.addEventListener("click", () => {
          checkbox.checked = false;
          updateChips();
        });

        chip.appendChild(close);
        chipList.appendChild(chip);
      }
    });
  }
});

// directing to langgrid
createApp({
  data() {
      return {
        showGenreGrid: true,
        showLangGrid: false
      };
  },
  methods: {
      redirect(path) {
          window.location.href = path;
      },
      nextLangPage() {
        this.showGenreGrid = false;
        this.showLangGrid = true;
      },
      backGenrePage() {
        this.showGenreGrid = true;
        this.showLangGrid = false;
      }
  },
  computed: {},
  mounted() {}
}).mount('#personalise-main');


