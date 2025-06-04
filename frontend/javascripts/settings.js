const { createApp } = Vue;

createApp({
    data() {
        return {
            dropdowns: {
                theme: false,
                languages: false,
                genres: false
            },
            selectedTheme: 'dark', // default
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
            newPass: '',
            confirmPass: '',
            passMatch: true,
            uploadedImage: null,
            uploadError: '',
            currAvIdx: 2,
            selectedAv: null,
            showPass: false,

            // dummy data
            languages: [
                { id: 1, name: 'English', selected: false },
                { id: 2, name: 'Español', selected: false },
                { id: 3, name: 'Italiano', selected: false },
                { id: 4, name: 'Português', selected: false },
                { id: 5, name: 'French', selected: false },
                { id: 6, name: 'German', selected: false },
                { id: 7, name: 'Hindi', selected: false }
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
    methods: {
        toggleDropdown(type) {
            this.dropdowns[type] = !this.dropdowns[type];
        },
        selectTheme(theme) {
            this.selectedTheme = theme;
        },
        toggleLanguage(languageId) {
            const language = this.languages.find((lang) => lang.id === languageId);
            if (language) {
                language.selected = !language.selected;
            }
        },
        toggleGenre(genreId) {
            const genre = this.genres.find((gen) => gen.id === genreId);
            if (genre) {
                genre.selected = !genre.selected;
            }
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
        checkMatch() {
            this.passMatch = this.newPass === this.confirmPass;
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
            if (file.size> 1024*1024) {
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
        }
    },
    watch: {
        newPass(newVal) {
            this.validatePass(newVal);
        },
        confirmPass() {
            this.checkMatch();
        }
    }
}).mount('#settings');
