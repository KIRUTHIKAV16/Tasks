//nav links
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const navbarCollapse = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
  
    if (navbarCollapse.classList.contains('show')) {
      navbarToggler.click(); 
    }
  });
});

// Back to Top Button
const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Project Description
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".project-image");
  const modal = document.getElementById("project-modal");
  const modalDescription = document.getElementById("modal-description");
  const closeModal = document.getElementById("close-modal");

  images.forEach(image => {
    image.addEventListener("click", function () {
      const description = this.getAttribute("data-description");
    
      modalDescription.innerHTML = description.replace(/•/g, "<br>•");
      modal.style.display = "block";
    });
  });

  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});


// Form Validation
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !subject || !message) {
    alert("All fields are required.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  alert("Message sent successfully!");
});


