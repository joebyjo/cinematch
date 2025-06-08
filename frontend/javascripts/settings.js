/* eslint-disable no-undef */
/* eslint-disable max-len */
const { createApp } = Vue;

async function getMethod(url) {
    try {
        // eslint-disable-next-line no-undef
        const res = await axios.get(url);
        return res.data;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error retrieving data from server", e);
        return [];
    }
}
async function postLanguages(languages) {
    // Collect selected language IDs
    const languageIds = languages
        .filter((lang) => lang.selected)
        .map((lang) => lang.id);

    if (!languageIds.length) {
        console.warn("[INFO] No selected languages to post.");
        return;
    }

    try {
        const res = await axios.post("/api/personalise/languages-id", languageIds);
        // console.log("[INFO] Languages updated successfully.", res.data);
    } catch (e) {
        console.error("[ERROR] Failed to update languages:", e.message || e);
    }
}

async function postGenres(genres) {
    // Collect selected genre IDs
    const genreIds = genres
        .filter((genre) => genre.selected)
        .map((genre) => genre.id);

    if (!genreIds.length) {
        console.warn("[INFO] No selected genres to post.");
        return;
    }

    try {
        const res = await axios.post("/api/personalise/genres-id", genreIds);
        // console.log("[INFO] Genres updated successfully.", res.data);
    } catch (e) {
        console.error("[ERROR] Failed to update genres:", e.message || e);
    }
}

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

createApp({
    data() {
        return {
            isError: false,

            selectedTheme: 'dark',

            nameChangeRequest: {
                firstName: '',
                lastName: '',
                password: '',
                passMatch: false
            },

            newPass: '',
            confirmPass: '',
            curPass: '',
            passMatch: true,
            passwordError: '',

            deleteRequest: {
                password: '',
                isPass: true
            },

            uploadedImage: null,
            uploadError: '',
            currAvIdx: 2,
            selectedAv: null,
            showPass: false,

            user: {
                firstName: "",
                lastName: "",
                userName: "",
                profilePic: ""
            },

            dropdowns: {
                theme: false,
                languages: false,
                genres: false
            },
            passReq: {
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false,
                noSpaces: false
            },
            popup: {
                show: false,
                text: '',
                timeout: null
            },
            search: {
                languages: '',
                genres: ''
            },

            languages: [],
            genres: [],
            avatars: [
                { id: 1, src: 'images/settings/avatar1.svg' },
                { id: 2, src: 'images/settings/avatar2.svg' },
                { id: 3, src: 'images/settings/avatar3.svg' },
                { id: 4, src: 'images/settings/avatar4.svg' },
                { id: 5, src: 'images/settings/avatar5.svg' }
            ]
        };
    },
    computed: {
        filterLang() {
            if (!this.search.languages) {
                return this.languages;
            }
            return this.languages.filter((lang) => lang.name.toLowerCase().includes(this.search.languages.toLowerCase()));
        },
        fullName() {
            return this.user.firstName + " " + this.user.lastName;
        },
        checkMatch() {
            return this.newPass === this.confirmPass;
        }
    },
    methods: {
        toggleDropdown(type) {
            this.dropdowns[type] = !this.dropdowns[type];
            if (!this.dropdowns[type]) {
                this.search[type] = '';
            }
        },
        selectTheme(theme) {
            this.selectedTheme = theme;
            axios.post("/api/users/me/theme", { theme: this.selectedTheme });
        },
        toggleLanguage(languageId) {
            const language = this.languages.find((lang) => lang.id === languageId);
            if (language) {
                language.selected = !language.selected;
            }

            postLanguages(this.languages);
        },
        toggleGenre(genreId) {
            const genre = this.genres.find((gen) => gen.id === genreId);
            if (genre) {
                genre.selected = !genre.selected;
            }

            postGenres(this.genres);
        },
        validatePass(password) {
            this.passReq = {
                length: password.length >= 8 && password.length <= 16,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                special: /[!_@#$%^&*(),?":{}|<>]/.test(password),
                noSpaces: !/\s/.test(password) && !password.includes('.') && password.length > 0
            };
        },
        isPassValid() {
            return Object.values(this.passReq).every((req) => req);
        },
        goHome() {
            window.location.href = '/';
        },
        showPopup(message) {
            this.popup = {
                show: true,
                text: message,
                timeout: setTimeout(() => {
                    this.popup.show = false;
                }, 2500)
            };
        },
        fileUpload(event) {
            const file = event.target.files[0];
            this.uploadError = '';

            if (!file) {
                return;
            }
            if (!file.type.match('image/jpg') && !file.type.match('image/jpeg') && !file.type.match('image/png')) {
                this.uploadError = 'Please upload a JPG/JPEG/PNG file';
                return;
            }
            if (file.size > 1024 * 1024) {
                this.uploadError = 'Max file size allowed is 1MB';
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                this.uploadedImage = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        selectUpload() {
            if (this.uploadedImage) {
                if (this.isUploadAvSelected()) return;
                this.selectedAv = {
                    src: this.uploadedImage,
                    isUploaded: true
                };
                this.showPopup('Avatar updated successfully');
            }
        },
        nextAv() {
            this.currAvIdx = (this.currAvIdx + 1) % this.avatars.length;
        },
        prevAv() {
            this.currAvIdx = (this.currAvIdx - 1 + this.avatars.length)
                % this.avatars.length;
        },
        selectAv() {
            if (this.isCurrAvSelected()) return;
            this.selectedAv = this.avatars[this.currAvIdx];
            this.showPopup('Avatar updated successfully');
        },
        getAvatars() {
            const total = this.avatars.length;
            const avatars = [];

            for (let i = -2; i <= 2; i++) {
                let id = this.currAvIdx + i;

                if (id < 0) {
                    id += total;
                } else if (id >= total) {
                    id -= total;
                }

                const avatar = {
                    ...this.avatars[id],
                    isSelected: i === 0,
                    isLarge: i === -1 || i === 1
                };
                avatars.push(avatar);
            }
            return avatars;
        },
        isCurrAvSelected() {
            if (!this.selectedAv) return false;
            const currAv = this.avatars[this.currAvIdx];
            return this.selectedAv.src === currAv.src && !this.selectedAv.isUploaded;
        },
        isUploadAvSelected() {
            if (!this.selectedAv || !this.uploadedImage) return false;
            return this.selectedAv.isUploaded && this.selectedAv.src === this.uploadedImage;
        },
        redirect(path) {
            if (path === "/logout") {
                helperLogout('api/auth/logout');
                window.location.href = '/home';
            } else {
                window.location.href = path;
            }
        },

        async changeName() {
            try {
                await axios.put("api/users/me", {
                    first_name: this.nameChangeRequest.firstName,
                    last_name: this.nameChangeRequest.lastName,
                    password: this.nameChangeRequest.password
                });
                this.showPopup("Name updated successfully");
                this.getUserDetails();

                this.nameChangeRequest.firstName = '';
                this.nameChangeRequest.lastName = '';
                this.nameChangeRequest.password = '';

                this.nameChangeRequest.passMatch = false;
            } catch (error) {
                this.nameChangeRequest.password = '';
                this.nameChangeRequest.passMatch = true;
            }
        },

        async deleteAccount() {
            try {
                console.log(this.deleteRequest.password);
                await axios.delete("api/users/me", {
                    data: {
                        password: this.deleteRequest.password
                    }
                });
                this.redirect("/home");
            } catch (error) {
                this.deleteRequest.isPass = false;
            }
        },

        async changePassword() {
            if (!this.checkMatch || !this.newPass || !this.curPass) return;
            try {
                const res = await axios.post("api/auth/change-password", {
                    current_password: this.curPass,
                    new_password: this.newPass
                });

                this.showPopup("Password changed successfully");
                this.passMatch = true;

                this.curPass = '';
                this.newPass = '';
                this.confirmPass = '';
            } catch (error) {
                console.log(error);
                this.passwordError = error.response.data.msg;
                this.passMatch = false;
            }
        },

        // Initialization function to fetch user preferences, genres, languages, and user details
        async init() {
            this.isError = false;

            try {
                // Fetch user preferences (favorite genres and preferred languages)
                const preferences = await getMethod("api/users/languages-genres");

                const favoriteGenres = Array.isArray(preferences.favorite_genres)
                    ? preferences.favorite_genres
                    : [];
                const preferredLanguages = Array.isArray(preferences.preferred_languages)
                    ? preferences.preferred_languages
                    : [];

                // Fetch genres, languages, and user details concurrently
                await Promise.all([
                    this.fetchGenres(favoriteGenres),
                    this.fetchLanguages(preferredLanguages),
                    this.getUserDetails()
                ]);

                // console.log("[INFO] Initialization successful");
            } catch (e) {
                this.isError = true;
                console.error("[ERROR] Initialization failed:", e.message || e);
            }
        },
        // Fetch genres and mark user's favorites as selected
        async fetchGenres(favoriteGenres) {
            try {
                const res = await getMethod("/api/movies/genres");

                if (!Array.isArray(res)) {
                    throw new Error("Genres response is not an array");
                }

                this.genres = res.map((genre) => ({
                    ...genre,
                    selected: favoriteGenres.includes(genre.name)
                }));

                // console.log("[INFO] Genres loaded successfully");
            } catch (error) {
                console.error("[ERROR] Failed to fetch genres:", error.message || error);
                throw error; // Propagate to init()
            }
        },
        // Fetch languages and mark user's preferences as selected
        async fetchLanguages(preferredLanguages) {
            try {
                const res = await getMethod("/api/movies/languages");

                if (!Array.isArray(res)) {
                    throw new Error("Languages response is not an array");
                }

                this.languages = res.map((lang) => ({
                    ...lang,
                    selected: preferredLanguages.includes(lang.code)
                }));

                // console.log("[INFO] Languages loaded successfully");
            } catch (error) {
                console.error("[ERROR] Failed to fetch languages:", error.message || error);
                throw error; // Propagate to init()
            }
        },
        // Fetch and populate user details
        async getUserDetails() {
            try {
                const data = await getMethod("api/users/me");

                if (!data) {
                    throw new Error("User details not received");
                }

                // Populate user details
                this.user.userName = data.user_name || "";
                this.user.firstName = (data.first_name || "").toUpperCase();
                this.user.lastName = (data.last_name || "").toUpperCase();
                this.user.profilePic = data.profile_picture_url || "";
                this.selectedTheme = (data.theme || "dark").toLowerCase();

                // console.log("[INFO] User details loaded successfully");
            } catch (error) {
                console.error("[ERROR] Failed to fetch user details:", error.message || error);
                throw error; // Propagate to init()
            }
        }
    },
    watch: {
        newPass(newVal) {
            this.validatePass(newVal);
        }
    },
    mounted() {
        this.init();
    }
}).mount('#settings');
