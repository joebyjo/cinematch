// handle signup request
async function helperSignup(firstName, lastName, email, password) {
    try {
        // eslint-disable-next-line no-undef
        // send post request
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

        return { status: 500, data: { msg: 'Unexpected error' } };
    }
}

// eslint-disable-next-line no-undef
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
        // go to another page
        redirect(path) {
            window.location.href = path;
        },
        // handle signup logic
        async signup() {
            // eslint-disable-next-line max-len
            const res = await helperSignup(this.firstName, this.lastName, this.email, this.password);
            if (res.status === 200 || res.status === 201) {
                this.redirect('/login');
            } else {
                this.message = res.data.msg;
                this.signupFailed = true;
            }
        }
    },
    computed: {},
    mounted() {}
}).mount('#signup-page');
