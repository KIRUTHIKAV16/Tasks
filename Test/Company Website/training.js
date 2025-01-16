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

// Toggle visibility of the contact form
document.getElementById('contact-now-btn').addEventListener('click', toggleContactForm);

function toggleContactForm() {
  const contactFormSection = document.getElementById('contact-form-container');
  contactFormSection.classList.toggle('d-none'); 
}

document.getElementById('contact-form').addEventListener('submit', function (event) {
  event.preventDefault();

  let isValid = true;
  const errors = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    mobile: document.getElementById('mobile-error'),
    subject: document.getElementById('subject-error'),
    message: document.getElementById('message-error')
  };

  Object.values(errors).forEach(error => (error.textContent = ''));

  const form = document.getElementById('contact-form');
  let loadingIndicator = document.getElementById('loading-indicator');
  if (!loadingIndicator) {
    loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.style.marginTop = '10px';
    loadingIndicator.style.color = 'blue';
    form.appendChild(loadingIndicator);
  }
  loadingIndicator.textContent = 'Loading...';
  setTimeout(() => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    if (!name) {
      errors.name.textContent = 'This field is required';
      errors.name.style.color = 'red';
      isValid = false;
    } else {
      errors.name.textContent = '';
    }

    if (!email) {
      errors.email.textContent = 'This field is required';
      errors.email.style.color = 'red';
      isValid = false;
    } else {
      errors.email.textContent = '';
    }

    if (!mobile) {
      errors.mobile.textContent = 'This field number is required';
      errors.mobile.style.color = 'red';
      isValid = false;
    } else {
      errors.mobile.textContent = '';
    }

    if (!subject) {
      errors.subject.textContent = 'This field is required';
      errors.subject.style.color = 'red';
      isValid = false;
    } else {
      errors.subject.textContent = '';
    }

    if (!message) {
      errors.message.textContent = 'This field is required';
      errors.message.style.color = 'red';
      isValid = false;
    } else {
      errors.message.textContent = '';
    }
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');

    if (isValid) {
      successMessage.textContent = 'Message sent successfully!';
      errorMessage.textContent = '';
    } else {
      successMessage.textContent = '';
      errorMessage.textContent = 'Please fill all the fields correctly.';
    }

    form.removeChild(loadingIndicator);
  }, 2000);
});


// search 
document.getElementById('search-icon').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('search-overlay').style.display = 'flex';
  });
  
  document.getElementById('close-btn').addEventListener('click', function () {
    document.getElementById('search-overlay').style.display = 'none';
  });
  

  document.getElementById('search-form').addEventListener('submit', function (event) {
    const query = document.querySelector('.search-input').value.trim();
    if (!query) {
      event.preventDefault(); 
      alert('Please enter a search term!');
    }
  });