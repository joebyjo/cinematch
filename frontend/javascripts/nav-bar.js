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

function helperCheckLoginStatus() {
    // checkif the user has login
    console.log("Checking login status...");
    return true;
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
        checkLoginStatus() {
            this.isLogin = helperCheckLoginStatus();
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
        }
    },
    computed: {},
    mounted() {
        this.checkLoginStatus();
    }
}).mount('#nav-bar');
