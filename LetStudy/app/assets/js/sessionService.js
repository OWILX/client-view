// sessionService.js

const API_URL = 'https://letstudy.infinityfreeapp.com/session.php';

/**
 * Fetches a session variable from the PHP backend.
 * @param {string} varName - The key of the session variable.
 */
 
async function getSessionValue() {
    fetch(API_URL, {
    credentials: 'include' // important to send PHP cookies
})
.then(res => res.json())
.then(data => {
    if (data.loggedIn) {
        console.log("Welcome", data.user.username);
    } else {
        console.log("Not logged in");
    }
});
}