/* eslint-disable no-useless-concat */
// adding theme preference to body tag

// get theme cookie
function getThemeCookie() {
    const match = document.cookie.match(new RegExp('(?:^|; )' + 'theme' + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

// set default theme
if (!getThemeCookie()) {
    document.cookie = 'theme=dark; path=/; max-age=31536000';
}

// get theme
const theme = getThemeCookie() || 'dark';

// add theme class to body after dom loads
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add(theme);
});
