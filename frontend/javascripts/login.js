async function helperLogin(email, password) {
    try {
        // eslint-disable-next-line no-undef
        const res = await axios.post('/api/auth/login', {
            username: email,
            password: password
        });

        return 0;
    } catch (e) {
        // eslint-disable-next-line no-console
        return 1;
    }
}

createApp({
    data() {
        return {
            showPass: false,
            password: "",
            email: "",
            loginFailed: false
        };
    },
    methods: {
        redirect(path) {
            window.location.href = path;
        },
        login() {
            const res = helperLogin(this.email, this.password);
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
