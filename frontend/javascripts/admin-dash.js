
async function getMethod(url) {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (e) {
        console.error("Error retrieving data from server", e);
        return [];
    }
}

createApp({
    data() {
        return {
            showSort: false,
            showFilters: false,
            showLoadLimit: false,
            totalUsers: 0,
            totalActive:0,
            totalContent:0,
            totalVisits:0,
            loadLimit: 10,
            sort: "",
            search: "",
            filter: {
                roles: []
            },
            currentPage: 1,
            totalPages: 1,
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
                id: 0,
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
            users: []
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
        SelectUser(id) {
            const index = this.selectedUsers.indexOf(id);
            if (index === -1) {
                this.selectedUsers.push(id);
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
                user_id: user.user_id,
                username: user.user_name,
                firstname: user.first_name,
                lastname: user.last_name,
                role: user.role,
                pfp: user.profile_picture_url,
                pfpPreview: user.profile_picture_url.includes('avatar') ? `${user.profile_picture_url}` : user.profile_picture_url
            };
            console.log('Editing user role:', this.editingUser.role);
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
        helperProfilePicture(profile_picture_url) {

            if (profile_picture_url.startsWith('/uploads/avatar')) {
                return profile_picture_url.replaceAll("/uploads/","");
            } else {
                return 'Uploaded image'
            }
        },
        async getStats() {
            const stats =  await getMethod('api/admin/stats');

            this.totalUsers = stats.total_users;
            this.totalActive = stats.total_active;
            this.totalContent = stats.total_movies;
            this.totalVisits = stats.total_visits;
        },
        createUrl() {
            // base url
            const url = new URL("/api/admin/users", window.location.origin);

            // Set query parameters
            url.searchParams.set("page", this.currentPage);
            url.searchParams.set("limit", this.loadLimit);

            if (this.sort) {
                url.searchParams.set("sort", this.sort);
            }

            this.filter.roles.forEach((role) => {
                url.searchParams.append("role", role);
            });

            url.searchParams.set("username", this.search);


            return url;
        },
        async getUsers(url) {
            const res = await getMethod(url);

            if (!res) {
                console.error("getMethod returned nothing.");
                return;
            }

            const data = res;

            this.users = data.users || [];
            this.loadLimit = data.limit || 0;
            this.totalPages = data.total_pages || 0;
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
        // totalPages() {
        //     return Math.ceil(this.users.length/this.loadLimit);
        // },
        // currPageUsers() {
        //     const start = (this.currentPage-1) * this.loadLimit;
        //     const end = start + this.loadLimit;
        //     return this.users.slice(start, end);
        // },
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
        this.getStats();
        this.getUsers('/api/admin/users');
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
