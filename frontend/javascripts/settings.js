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
    // Data properties: hold all reactive variables used in the app
    data() {
        return {
            isError: false,
            // Theme selected by the user, default is dark
            selectedTheme: 'dark',
            // Password fields and validation flags
            newPass: '',
            confirmPass: '',
            curPass: '',
            passMatch: true,
            passwordError: '',
            isAdmin: false,
            countAdmin: 0,

            nameChangeRequest: {
                firstName: '',
                lastName: '',
                password: '',
                passMatch: false
            },

            deleteRequest: {
                password: '',
                isPass: true
            },

            // Uploaded image for avatar and related error message
            uploadedImage: null,
            uploadError: '',
            // Current avatar index and selected avatar object
            currAvIdx: 2,
            selectedAv: null,
            // Toggle for showing password fields
            showPass: false,

            user: {
                firstName: "",
                lastName: "",
                userName: "",
                profilePic: ""
            },

            // Dropdown visibility states for theme, languages, and genres
            dropdowns: {
                theme: false,
                languages: false,
                genres: false
            },
            // Password requirement checks
            passReq: {
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false,
                noSpaces: false
            },
            // Popup message display state and timer
            popup: {
                show: false,
                text: '',
                timeout: null
            },
            // Search input for filtering languages and genres
            search: {
                languages: '',
                genres: ''
            },

            languages: [],
            genres: [],
            avatars: [
                { id: 1, src: '/uploads/avatar1.svg' },
                { id: 2, src: '/uploads/avatar2.svg' },
                { id: 3, src: '/uploads/avatar3.svg' },
                { id: 4, src: '/uploads/avatar4.svg' },
                { id: 5, src: '/uploads/avatar5.svg' }
            ]
        };
    },
    computed: {
        // Checks if change name inputs are valid (non-empty trimmed)
        isChangeNameValid() {
            return this.nameChangeRequest.firstName.trim() &&
                   this.nameChangeRequest.lastName.trim() &&
                   this.nameChangeRequest.password.trim();
        },

        // Checks if delete account password is entered
        isDeleteAccountValid() {
            return this.deleteRequest.password.trim() !== '';
        },

        // Checks if password change fields are valid and passwords match
        isChangePasswordValid() {
            return this.curPass && this.newPass && this.confirmPass && this.passMatch;
        },

        // Filters languages list based on user search input (case-insensitive)
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
        },

        isOnlyAdmin() {
            return this.isAdmin && this.countAdmin <= 1;
        }
    },
    methods: {
        async changeName() {
            if (!this.isChangeNameValid) {
                this.showPopup("Please fill in all fields correctly.");
                return;
            }
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

        async changePassword() {
            if (!this.isChangePasswordValid) {
                this.showPopup("Please fill in all fields correctly.");
                return;
            }
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

        async deleteAccount() {
            if (!this.isDeleteAccountValid || this.isOnlyAdmin) {
                this.showPopup("Please enter your password to delete the account.");
                return;
            }
            try {
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

        // Toggle visibility of dropdown menus and reset search input when closed
        toggleDropdown(type) {
            this.dropdowns[type] = !this.dropdowns[type];
            if (!this.dropdowns[type]) {
                this.search[type] = '';
            }
        },

        // Select theme and save preference to localStorage
        selectTheme(theme) {
            this.selectedTheme = theme;
            localStorage.setItem('theme', theme);
            document.body.classList.remove('dark', 'light');
            document.body.classList.add(theme);
            axios.post("/api/users/me/theme", { theme: this.selectedTheme });
        },

        // Toggle selection state of a language by id
        toggleLanguage(languageId) {
            const language = this.languages.find((lang) => lang.id === languageId);
            if (language) {
                language.selected = !language.selected;
            }

            postLanguages(this.languages);
        },

        // Toggle selection state of a genre by id
        toggleGenre(genreId) {
            const genre = this.genres.find((gen) => gen.id === genreId);
            if (genre) {
                genre.selected = !genre.selected;
            }

            postGenres(this.genres);
        },

        // Validate password against set requirements and update passReq object
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

        // Check if new password and confirm password fields match
        checkMatch() {
            this.passMatch = this.newPass === this.confirmPass;
        },

        // Returns true if all password requirements are met
        isPassValid() {
            return Object.values(this.passReq).every((req) => req);
        },

        // Redirect user to home page
        goHome() {
            window.location.href = '/';
        },

        // Show popup message for a limited time
        showPopup(message) {
            this.popup = {
                show: true,
                text: message,
                timeout: setTimeout(() => {
                    this.popup.show = false;
                }, 2500)
            };
        },

        // Handle file upload for avatar, validate file type and size
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

        async selectUpload() {
            if (this.uploadedImage) {
                if (this.isUploadAvSelected()) return;

                const serverImageUrl = await this.uploadProfilePictureToServer(this.uploadedImage);
                if (!serverImageUrl) return;

                this.selectedAv = {
                    src: serverImageUrl,
                    isUploaded: true
                };

                this.showPopup('Avatar updated successfully');
            }
        },

        // Add this method to your Vue component
        async uploadProfilePictureToServer(base64Image) {
            try {
                const blob = await (await fetch(base64Image)).blob();
                const formData = new FormData();
                formData.append('profile_picture', blob, 'avatar.png');

                const response = await axios.post('api/users/me/profile-picture', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                return response.data.profile_picture_url;
            } catch (err) {
                console.error(err);
                this.uploadError = err.response?.data?.msg || 'An error occurred during upload';
                return null;
            }
        },

        // Cycle to the next avatar in the list
        nextAv() {
            this.currAvIdx = (this.currAvIdx + 1) % this.avatars.length;
        },

        // Cycle to the previous avatar in the list
        prevAv() {
            this.currAvIdx = (this.currAvIdx - 1 + this.avatars.length)
                % this.avatars.length;
        },

        // Select the currently displayed avatar as the user's avatar
        selectAv() {
            if (this.isCurrAvSelected()) return;
            this.selectedAv = this.avatars[this.currAvIdx];
            this.uploadAvatar(this.avatars[this.currAvIdx].id);
            this.showPopup('Avatar updated successfully');
        },

        // Get a list of avatars to display around the current selection with visual indicators
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

        // Check if the currently displayed avatar is selected (and not an uploaded image)
        isCurrAvSelected() {
            if (!this.selectedAv) return false;
            const currAv = this.avatars[this.currAvIdx];
            return this.selectedAv.src === currAv.src && !this.selectedAv.isUploaded;
        },

        // Check if the uploaded image avatar is currently selected
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

        async uploadAvatar(i) {
            try {
                await axios.post("api/users/me/profile-avatar", {
                    id: i
                });
            } catch (error) {
                console.error('Upload Failed!');
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

                this.setProfilePic();

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
                this.isAdmin = data.role === 'admin';

                // count for admin
                if (this.isAdmin) {
                    const adminUsers = await getMethod("api/admin/users");
                    this.countAdmin = adminUsers.users.filter(user => user.role === 'admin').length;
                }

                // console.log("[INFO] User details loaded successfully");
            } catch (error) {
                console.error("[ERROR] Failed to fetch user details:", error.message || error);
                throw error; // Propagate to init()
            }
        },

        // Function to store image
        setProfilePic() {
            const url = this.user.profilePic;

            // check if it is a avatar or uploaded pic
            const index = this.avatars.findIndex(avatar => avatar.src === url);
            if (index != -1) {
                this.selectedAv = this.avatars[index];
                this.currAvIdx = index;
            } else {
                this.uploadedImage = url;
                this.selectedAv = {
                    src: url,
                    isUploaded: true
                };
            }
        }
    },
    mounted() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            this.selectedTheme = savedTheme;
        }
        this.init();
    },
    watch: {
        newPass(newVal) {
            this.validatePass(newVal);
        },
        confirmPass() {
            this.checkMatch();
        },
        selectedTheme(newTheme) {
            localStorage.setItem('theme', newTheme);
            document.body.classList.remove('dark', 'light');
            document.body.classList.add(newTheme);
        }
    }
}).mount('#settings');
