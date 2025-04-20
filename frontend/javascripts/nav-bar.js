function helperCheckLoginStatus() {
    // checkif the user has login
    console.log("Checking login status...");
    return true;
}

const profile = Vue.createApp({
    data() {
        return {
            isLogin: true,
            showMenu: false
        };
    },
    methods: {
        checkLoginStatus() {
            this.isLogin = helperCheckLoginStatus();
        },
        onMenu() {
            this.showMenu = !this.showMenu;
        }
    },
    mounted() {
        this.checkLoginStatus();
    }
});

profile.mount('#profile');
