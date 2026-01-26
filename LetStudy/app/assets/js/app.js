/**(async () => {
    try {
        const username = await getSessionValue('username');
        console.log(username);
    } catch (e) {
        console.error(e);
    }
})();*/

(async function () {
    const v = await getSessionValue("user_id");
    console.log(v);
    alert(v);
})();
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in (localStorage)
  const isLoggedIn = localStorage.getItem('letstudyUser') !== null;
  // Wait for splash animation, then redirect
  /**setTimeout(() => {
    if (isLoggedIn) {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'login.html';
    }
  }, 2000); // Matches splash duration (1.8s animation + buffer)*/
});
