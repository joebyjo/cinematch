// handle login request
async function helperLogin(username, password) {
    try {
        // eslint-disable-next-line no-undef
        await axios.post('/api/auth/login', {
            username: username,
            password: password
        });

        return 0;
    } catch (e) {
        // eslint-disable-next-line no-console
        return 1;
    }
}

// eslint-disable-next-line no-undef
createApp({
    data() {
        return {
            showPass: false,
            password: "",
            username: "",
            loginFailed: false
        };
    },
    methods: {
        // go to another page
        redirect(path) {
            window.location.href = path;
        },
        // handle login logic
        async login() {
            const res = await helperLogin(this.username, this.password);
            if (res === 0) {
                this.redirect('/home');
            } else {
                this.loginFailed = true;
            }
        }
    },
    computed: {},
    mounted() {}
}).mount('#login-page');
