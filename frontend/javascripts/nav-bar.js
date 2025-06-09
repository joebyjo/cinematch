/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
async function helperLogout(path) {
    try {
        // eslint-disable-next-line no-undef
        const res = await axios.post(path);
        return 0;
    } catch (e) {
        // eslint-disable-next-line no-console
        return 1;
    }
}

async function helperCheckLoginStatus() {
    // checkif the user has login
    try {
        // eslint-disable-next-line no-undef
        const res = await axios.get('api/auth/status');
        return true;
    } catch (e) {
        // eslint-disable-next-line no-console
        return false;
    }
}

function helperChangeDark(isDark) {
    if (isDark) {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
    }
}

// eslint-disable-next-line no-undef
const { createApp } = Vue;
createApp({
    data() {
        return {
            isLogin: false,
            showMenu: false,
            isDark: true,
            inProcess: true,
            userName: "guest",
            firstName: "guest",
            lastName: "user",
            profilePic: "" // add default profile pic path
        };
    },
    methods: {
        async checkLoginStatus() {
            this.isLogin = await helperCheckLoginStatus();

            if (this.isLogin) {
                const { data } = await axios.get('api/users/me');
                this.isDark = data.theme==='dark';
                helperChangeDark(this.isDark);
                this.userName = data.user_name;
                this.firstName = data.first_name;
                this.lastName = data.last_name;
                this.profilePic = data.profile_picture_url;
                document.cookie = `theme=${this.isDark ? 'dark' : 'light'}; path=/; max-age=31536000`;
            } else {
                helperChangeDark(this.isDark);
                document.cookie = `theme=${this.isDark ? 'dark' : 'light'}; path=/; max-age=31536000`;
            }

            this.inProcess = false;
        },
        onMenu() {
            this.showMenu = !this.showMenu;
        },
        changeDark() {
            this.isDark = !this.isDark;
            document.cookie = `theme=${this.isDark ? 'dark' : 'light'}; path=/; max-age=31536000`;

            // updating users preference for theme
            if (this.isDark) {
                const res = axios.post('api/users/me/theme',{ theme: "dark" });
            } else {
                const res = axios.post('api/users/me/theme',{ theme: "light" });
            }

            // adding transition between theme change
            document.body.classList.add('theme-transition');
            helperChangeDark(this.isDark);
            setTimeout(() => { document.body.classList.remove('theme-transition'); }, 700);

        },
        redirect(path) {
            if (path === "/logout") {
                helperLogout('api/auth/logout');
                window.location.href = '/home';
            } else {
                window.location.href = path;
            }
        },
        clickOutside(e) {
            const profile = document.getElementById('profile');
            if (this.showMenu && profile && !profile.contains(e.target)) {
                this.showMenu = false;
            }
        }
    },
    computed: {

        // for welcome message in navbar
        initials() {
            if (this.firstName && this.lastName) {
                return `${this.firstName[0].toUpperCase()}.${this.lastName[0].toUpperCase()}`;
            }
            return '';
        }
    },
    mounted() {
        this.checkLoginStatus();
        document.addEventListener('click', this.clickOutside);
    }
}).mount('#nav-bar');
