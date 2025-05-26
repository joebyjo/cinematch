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
            isLogin: true,
            showMenu: false,
            isDark: true
        };
    },
    methods: {
        async checkLoginStatus() {
            this.isLogin = await helperCheckLoginStatus();
        },
        onMenu() {
            this.showMenu = !this.showMenu;
        },
        changeDark() {
            this.isDark = !this.isDark;
            helperChangeDark(this.isDark);
        },
        redirect(path) {
            if (path === "/logout") {
                helperLogout('api/auth/logout');
                window.location.href = '/home';
            }
        },
        clickOutside(e) {
            const profile = document.getElementById('profile');
            if (this.showMenu && profile && !profile.contains(e.target)) {
                this.showMenu = false;
            }
        }
    },
    computed: {},
    mounted() {
        this.checkLoginStatus();
        document.addEventListener('click', this.clickOutside);
    }
}).mount('#nav-bar');
