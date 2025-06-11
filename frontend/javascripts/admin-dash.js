createApp({
    data() {
        return {
            showSort: false,
            showFilters: false,
            showLoadLimit: false,
            loadLimit: 10,
            currentPage: 1,
            isSelectOn: false,
            selectedUsers: [],
            showAddUser: false,
            showEditUser: false,
            uploadError: '',
            showPass: false,
            passError: '',
            newUser: {
                username: '',
                firstname: '',
                lastname: '',
                password: '',
                role: '',
                pfp: '',
                pfpPreview: null
            },
            editingUser: {
                username: '',
                firstname: '',
                lastname: '',
                role: '',
                pfp: '',
                pfpPreview: null
            },
            currAdmin: {
                username: 'josheen_1',
                firstname: 'Josheen',
                lastname: 'Kour',
                role: 'Administrator',
                dateJoined: '01/01/2025',
                pfp: 'avatar1',
                lastActive: '15/03/2024 14:30'
            },
            passReq: {
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false,
                noSpaces: false
            },
            logoutTime: null, // Timer for inactivity
            inactiveTime: 180000, // 3 minutes in milliseconds

            // dummy data
            users: [
                {
                    username: 'josheen_1',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'Administrator',
                    dateJoined: '01/01/2025',
                    pfp: 'avatar1',
                    lastActive: '15/03/2024 14:30'
                },
                {
                    username: 'liri_1',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '02/02/2025',
                    pfp: 'https://camo.githubusercontent.com/238055d74a4a963ecc573726f31395a1d523e264c3f17ed5316ca13e21c8a3dc/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f616c6f68652f617661746172732f706e672f6d656d6f5f32302e706e67',
                    lastActive: '15/03/2024 15:45'
                },
                {
                    username: 'joe_1',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'Administrator',
                    dateJoined: '03/03/2025',
                    pfp: 'avatar2',
                    lastActive: '14/03/2024 09:15'
                },
                {
                    username: 'hiten_1',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'User',
                    dateJoined: '04/04/2025',
                    pfp: 'avatar5',
                    lastActive: '15/03/2024 11:20'
                },
                {
                    username: 'josheen_2',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '05/01/2025',
                    pfp: 'https://camo.githubusercontent.com/d8c6127ca1b58383265a1e073b925f75e9f81096c683ff43fb46a8fc4f2cd4e3/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f616c6f68652f617661746172732f706e672f6d656d6f5f382e706e67',
                    lastActive: '15/03/2024 16:00'
                },
                {
                    username: 'liri_2',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'Administrator',
                    dateJoined: '06/02/2025',
                    pfp: 'uploaded image',
                    lastActive: '15/03/2024 15:30'
                },
                {
                    username: 'joe_2',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'User',
                    dateJoined: '07/03/2025',
                    pfp: 'avatar3',
                    lastActive: '13/03/2024 18:45'
                },
                {
                    username: 'hiten_2',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'Administrator',
                    dateJoined: '08/04/2025',
                    pfp: 'uploaded image',
                    lastActive: '15/03/2024 14:15'
                },
                {
                    username: 'josheen_3',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '09/01/2025',
                    pfp: 'avatar4',
                    lastActive: '15/03/2024 12:30'
                },
                {
                    username: 'liri_3',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '10/02/2025',
                    pfp: 'avatar2',
                    lastActive: '15/03/2024 15:45'
                },
                {
                    username: 'josheen_4',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'Administrator',
                    dateJoined: '01/01/2025',
                    pfp: 'avatar1',
                    lastActive: '08/03/2024 10:20'
                },
                {
                    username: 'liri_4',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '02/02/2025',
                    pfp: 'uploaded image',
                    lastActive: '13/03/2024 16:30'
                },
                {
                    username: 'joe_3',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'Administrator',
                    dateJoined: '03/03/2025',
                    pfp: 'avatar2',
                    lastActive: '15/03/2024 13:15'
                },
                {
                    username: 'hiten_3',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'User',
                    dateJoined: '04/04/2025',
                    pfp: 'avatar5',
                    lastActive: '15/03/2024 16:00'
                },
                {
                    username: 'josheen_5',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '05/01/2025',
                    pfp: 'uploaded image',
                    lastActive: '14/03/2024 20:45'
                },
                {
                    username: 'liri_5',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'Administrator',
                    dateJoined: '06/02/2025',
                    pfp: 'uploaded image',
                    lastActive: '15/03/2024 11:30'
                },
                {
                    username: 'joe_4',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'User',
                    dateJoined: '07/03/2025',
                    pfp: 'avatar3',
                    lastActive: '15/03/2024 14:30'
                },
                {
                    username: 'hiten_4',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'Administrator',
                    dateJoined: '08/04/2025',
                    pfp: 'uploaded image',
                    lastActive: '15/02/2024 09:15'
                },
                {
                    username: 'josheen_6',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '09/01/2025',
                    pfp: 'avatar4',
                    lastActive: '12/03/2024 17:30'
                },
                {
                    username: 'liri_6',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '10/02/2025',
                    pfp: 'avatar2',
                    lastActive: '15/03/2024 15:00'
                }
            ]
        };
    },
    methods: {
        // turn on select button
        toggleSelect() {
            this.isSelectOn = !this.isSelectOn;
            if (!this.isSelectOn) {
                this.selectedUsers = [];
            }
        },
        // select users
        selectUser(username) {
            const index = this.selectedUsers.indexOf(username);
            if (index === -1) {
                this.selectedUsers.push(username);
            } else {
                this.selectedUsers.splice(index, 1);
            }
        },
        // add a new user to the table
        addUser() {
            // check if all fields are filled
            if (Object.values(this.newUser).some((val) => !val)) {
                alert('Please fill all fields.');
                return;
            }
            // validate password
            this.validatePass(this.newUser.password);
            if (!this.isPassValid()) {
                this.passError = 'Password did not meet requirements';
                return;
            }
            // push added data
            this.users.push({
                username: this.newUser.username,
                firstname: this.newUser.firstname,
                lastname: this.newUser.lastname,
                role: this.newUser.role,
                dateJoined: new Date().toLocaleDateString(),
                pfp: this.newUser.pfp,
                lastActive: 'Not active'
            });
            // reset add form once done
            this.resetForm();
        },
        resetForm() {
            // discard last new user data
            this.newUser = {
                username: '',
                firstname: '',
                lastname: '',
                password: '',
                role: '',
                pfp: '',
                pfpPreview: null
            };
            // hide add user card
            this.showAddUser = false;
            // reset errors shown
            this.passError = '';
            this.uploadError = '';
            this.showPass = false;
            // reset av select and upload input
            const avSelect = document.querySelector('.av-options select');
            if (avSelect) {
                avSelect.value = '';
            }
            const fileInput = document.querySelector('.av-options input[type="file"]');
            if (fileInput) {
                fileInput.value = '';
            }
        },
        // upload image
        imageUpload(event, isEditing) {
            const file = event.target.files[0];
            this.uploadError = '';

            if (!file) {
                return;
            }
            // check if file type is valid
            if (!file.type.match('image/jpg') && !file.type.match('image/jpeg') && !file.type.match('image/png')) {
                this.uploadError = 'Please upload a JPG/JPEG/PNG file';
                return;
            }
            // check if file size is valid
            if (file.size > 1024*1024) {
                this.uploadError = 'Max file size allowed is 1MB';
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                // check if upload is for editing user or adding new
                if (isEditing) {
                    this.editingUser.pfpPreview = e.target.result;
                    this.editingUser.pfp = 'uploaded image';
                } else {
                    this.newUser.pfpPreview = e.target.result;
                    this.newUser.pfp = 'uploaded image';
                }
            };
            reader.readAsDataURL(file);
        },
        // select pre made avatars
        selectAv(avatar, isEditing) {
            // set avatar 3 as default if no av input entered
            if (!avatar) {
                if (isEditing) {
                    this.editingUser.pfp = 'avatar3';
                    this.editingUser.pfpPreview = `./images/settings/avatar3.svg`;
                } else {
                    this.newUser.pfp = 'avatar3';
                    this.newUser.pfpPreview = `./images/settings/avatar3.svg`;
                }
                return;
            }
            // check if selection is for editing or adding new user
            if (isEditing) {
                this.editingUser.pfp = avatar;
                this.editingUser.pfpPreview = `./images/settings/${avatar}.svg`;
            } else {
                this.newUser.pfp = avatar;
                this.newUser.pfpPreview = `./images/settings/${avatar}.svg`;
            }
        },
        // edit an existing user
        editUser(user) {
            this.editingUser = {
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                pfp: user.pfp,
                pfpPreview: user.pfp.includes('avatar') ? `./images/settings/${user.pfp}.svg` : user.pfp
            };
            this.showEditUser = true;
        },
        // save edits made to existing user
        saveEdits() {
            const userIdx = this.users.findIndex((u) => u.username === this.editingUser.username);
            if (userIdx!== -1) {
                this.users[userIdx] = {
                    ...this.users[userIdx],
                    firstname: this.editingUser.firstname,
                    lastname: this.editingUser.lastname,
                    role: this.editingUser.role,
                    pfp: this.editingUser.pfp
                };
            }
            this.showEditUser = false;
        },
        // check if password meets req while adding new user
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
        // logout user for being inactive over 3 mins
        logoutUser() {
            helperLogout('api/auth/logout');
            window.location.href = '/home';
            alert('You were logged out due to inactivity.');
        },
        // reset the timer
        resetLogoutTime() {
            clearTimeout(this.logoutTime);
            this.logoutTime = setTimeout(() => {
                this.logoutUser();
            }, this.inactiveTime);
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.users.length/this.loadLimit);
        },
        currPageUsers() {
            const start = (this.currentPage-1) * this.loadLimit;
            const end = start + this.loadLimit;
            return this.users.slice(start, end);
        },
        visiblePages() {
            const pages = [];
            const maxVisible = 3;
            let start = Math.max(1, this.currentPage - 1);

            if (start + maxVisible - 1 > this.totalPages) {
                start = Math.max(1, this.totalPages - maxVisible + 1);
            }
            for (let i = start; i < start + maxVisible && i <= this.totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }
    },
    watch: {
        loadLimit() {
            this.currentPage = 1;
        }
    },
    mounted() {
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.dropdown')) {
                this.showSort = false;
                this.showFilters = false;
                this.showLoadLimit = false;
            }
            if (event.target.closest('.sort')) {
                this.showFilters = false;
                this.showLoadLimit = false;
            } else if (event.target.closest('.filter')) {
                this.showSort = false;
                this.showLoadLimit = false;
            } else if (event.target.closest('.load')) {
                this.showSort = false;
                this.showFilters = false;
            }
        });
        // check for cicks to stay logged in
        this.resetLogoutTime();
        document.addEventListener('mousemove', this.resetLogoutTime);
        document.addEventListener('keypress', this.resetLogoutTime);
        document.addEventListener('click', this.resetLogoutTime);
    }
}).mount('#admin-dash');
