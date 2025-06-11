
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

            // dummy data
            users: []
        };
    },
    methods: {
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
        addUser() {
            if (Object.values(this.newUser).some((val) => !val)) {
                alert('Please fill all fields.');
                return;
            }
            this.validatePass(this.newUser.password);
            if (!this.isPassValid()) {
                this.passError = 'Password did not meet requirements';
                return;
            }
            this.users.push({
                username: this.newUser.username,
                firstname: this.newUser.firstname,
                lastname: this.newUser.lastname,
                role: this.newUser.role,
                dateJoined: new Date().toLocaleDateString(),
                pfp: this.newUser.pfp,
                lastActive: 'Not active'
            });
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
        imageUpload(event, isEditing) {
            const file = event.target.files[0];
            this.uploadError = '';

            if (!file) {
                return;
            }
            if (!file.type.match('image/jpg') && !file.type.match('image/jpeg') && !file.type.match('image/png')) {
                this.uploadError = 'Please upload a JPG/JPEG/PNG file';
                return;
            }
            if (file.size > 1024*1024) {
                this.uploadError = 'Max file size allowed is 1MB';
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
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
        selectAv(avatar, isEditing) {
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
            if (isEditing) {
                this.editingUser.pfp = avatar;
                this.editingUser.pfpPreview = `./images/settings/${avatar}.svg`;
            } else {
                this.newUser.pfp = avatar;
                this.newUser.pfpPreview = `./images/settings/${avatar}.svg`;
            }
        },
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
    }
}).mount('#admin-dash');
