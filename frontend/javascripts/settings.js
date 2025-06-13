const { createApp } = Vue;

createApp({
    // Data properties: hold all reactive variables used in the app
    data() {
        return {
            // Theme selected by the user, default is dark
            selectedTheme: 'dark',
            // Password fields and validation flags
            newPass: '',
            confirmPass: '',
            passMatch: true,
            // Uploaded image for avatar and related error message
            uploadedImage: null,
            uploadError: '',
            // Current avatar index and selected avatar object
            currAvIdx: 2,
            selectedAv: null,
            // Toggle for showing password fields
            showPass: false,
            // User name and password input fields
            firstName: '',
            deletePassword: '',
            lastName: '',
            namePassword: '',
            currentPassword: '',
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

            // dummy data
            languages: [
                { id: 1, name: 'English', selected: false },
                { id: 2, name: 'Español', selected: false },
                { id: 3, name: 'Italiano', selected: false },
                { id: 4, name: 'Português', selected: false },
                { id: 5, name: 'French', selected: false },
                { id: 6, name: 'German', selected: false },
                { id: 7, name: 'Hindi', selected: false },
                { id: 8, name: 'Arabic', selected: false },
                { id: 9, name: 'Korean', selected: false },
                { id: 10, name: 'Chinese', selected: false }
            ],
            genres: [
                { id: 1, name: 'Action', selected: false },
                { id: 2, name: 'Adventure', selected: false },
                { id: 3, name: 'Animation', selected: false },
                { id: 4, name: 'Biography', selected: false },
                { id: 5, name: 'Comedy', selected: false },
                { id: 6, name: 'Crime', selected: false },
                { id: 7, name: 'Documentary', selected: false },
                { id: 8, name: 'Drama', selected: false },
                { id: 9, name: 'Family', selected: false },
                { id: 10, name: 'Fantasy', selected: false }
            ],
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
        // Checks if change name inputs are valid (non-empty trimmed)
        isChangeNameValid() {
            return this.firstName.trim() && this.lastName.trim() && this.namePassword.trim();
        },

        // Checks if delete account password is entered
        isDeleteAccountValid() {
            return this.deletePassword.trim() !== '';
        },

        // Checks if password change fields are valid and passwords match
        isChangePasswordValid() {
            return this.currentPassword && this.newPass && this.confirmPass && this.passMatch;
        },

        // Filters languages list based on user search input (case-insensitive)
        filterLang() {
            if (!this.search.languages) {
                return this.languages;
            }
            return this.languages.filter((lang) =>
                lang.name.toLowerCase().includes(this.search.languages.toLowerCase()));
        }
    },
    methods: {
        changeName() {
            if (this.isChangeNameValid) {
                // send API request or show popup
                this.showPopup("Name changed successfully!");
            } else {
                this.showPopup("Please enter your first name, last name, and password.");
            }
        },

        changePassword() {
            if (this.isChangePasswordValid) {
                // API call or logic to change password
                this.showPopup("Password changed successfully!");
            } else {
                this.showPopup("Please fill in all fields correctly.");
            }
        },

        deleteAccount() {
            if (this.isDeleteAccountValid) {
                // delete account logic
                this.showPopup("Account deleted.");
            } else {
                this.showPopup("Please enter your password to delete the account.");
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
        },

        // Toggle selection state of a language by id
        toggleLanguage(languageId) {
            const language = this.languages.find((lang) => lang.id === languageId);
            if (language) {
                language.selected = !language.selected;
            }
        },

        // Toggle selection state of a genre by id
        toggleGenre(genreId) {
            const genre = this.genres.find((gen) => gen.id === genreId);
            if (genre) {
                genre.selected = !genre.selected;
            }
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

        // Select the uploaded image as the current avatar if not already selected
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
        }
    },
    mounted() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            this.selectedTheme = savedTheme;
        }
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
