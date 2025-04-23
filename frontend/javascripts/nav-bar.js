const profile = Vue.createApp({
    data() {
        return {
            isLogin: false
        };
    },
    methods: {
        checkLoginStatus() {
            // checkif the user has login
            // eslint-disable-next-line no-console
            console.log("Checking login status...");
            this.isLogin = true;
        }
    },
    mounted() {
        this.checkLoginStatus();
    }
});

profile.mount('#profile');
