const profile = Vue.createApp({
    data() {
        return {
            isLogin: false,
            showMenu: false
        };
    },
    methods: {
        checkLoginStatus() {
            // checkif the user has login
            console.log("Checking login status...");
            this.isLogin = true;
        },
        onMenu() {
            this.showMenu = !this.showMenu;
        },
        offMenu() {
            this.showMenu = false;
        }
    },
    mounted() {
        this.checkLoginStatus();
    }
});

profile.mount('#profile');
