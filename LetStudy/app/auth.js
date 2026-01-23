function setLoading(button, isLoading) {
  button.classList.toggle("loading", isLoading);
  button.classList.toggle("skeleton", isLoading);
}

// Example
const googleBtn = document.querySelector(".btn-google");

googleBtn.addEventListener("click", () => {
  setLoading(googleBtn, true);

  // Simulate auth
  setTimeout(() => {
    setLoading(googleBtn, false);
  }, 2000);
});

document.addEventListener('DOMContentLoaded', () => {
  const googleBtn = document.getElementById('google-btn');

  googleBtn.addEventListener('click', () => {
    // Mock successful Google auth
    document.body.classList.add("page-exit");
    setTimeout(() => {
    window.location.href =  'https://letstudy.infinityfreeapp.com/google-callback.php';
  }, 100);
  });
});