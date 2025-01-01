let currentSlide = 1;
function goToSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        if (index === slideNumber - 1) {
            slide.style.display = 'flex';
        } else {
            slide.style.display = 'none';
        }
    });
    currentSlide = slideNumber;
}
function showFeature(feature) {
    const featureInfo = document.getElementById('feature-info');
    if (feature === 'feature1') {
        featureInfo.innerHTML = "<p>Feature 1: This is the first feature description.</p>";
    } else if (feature === 'feature2') {
        featureInfo.innerHTML = "<p>Feature 2: This is the second feature description.</p>";
    } else if (feature === 'feature3') {
        featureInfo.innerHTML = "<p>Feature 3: This is the third feature description.</p>";
    }
}
function showFeature(button, featureText) {
    const allButtons = document.querySelectorAll('.feature-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}
function openLoginPopup() {
    document.getElementById("loginPopup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}
function closeLoginPopup() {
    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "admin" && password === "12345") {
        alert("Login Successful!");
        closeLoginPopup();
    } else {
        alert("Invalid Username or Password");
    }
}
// Initialize the first slide
goToSlide(1);