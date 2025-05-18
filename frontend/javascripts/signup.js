async function helperSignup(firstName, lastName, email, password) {
    try {
        // eslint-disable-next-line no-undef
        const res = await axios.post('/api/auth/signup', {
            username: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        });

        return res;
    } catch (e) {
        // eslint-disable-next-line no-console
        // Return error response
        if (e.response) {
            return e.response;
        }

        return { status: 500, data: { error: 'Unexpected error' } };
    }
}

createApp({
    data() {
        return {
            password: "",
            email: "",
            firstName: "",
            lastName: "",
            message: "Unexpected error",
            signupFailed: false
        };
    },
    methods: {
        redirect(path) {
            window.location.href = path;
        },
        async signup() {
            // eslint-disable-next-line max-len
            const res = await helperSignup(this.firstName, this.lastName, this.email, this.password);
            if (res.status === 200 || res.status === 201) {
                this.redirect('/login');
            } else {
                console.log(res.data);
                this.message = res.data.errors[0].msg;
                this.signupFailed = true;
            }
        }
    },
    computed: {},
    mounted() {}
}).mount('#signup-page');
