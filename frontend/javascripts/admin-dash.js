// get data from api
async function getMethod(url) {
    try {
        const res = await axios.get(url); // send get request
        return res.data;
    } catch (e) {
        console.error("Error retrieving data from server", e);
        return [];
    }
}

// update user by id
async function editUser(user_id, updates) {
    try {
        // send put request with updates
        const res = await axios.put(`/api/admin/users/${user_id}`, updates);
        return res.data;
    } catch (e) {
        console.error("Error updating user", e);
        return { msg: "Failed to update user" };
    }
}

// add a new user
async function addNewUser(userPayload) {
    try {
        const response = await axios.post('/api/admin/users', userPayload);

        return response.data

    } catch (error) {
        // handle duplicate username
        if (error.response?.status === 409) {
            alert('Username already exists.');
        } else {
            console.error(error);
            alert('Failed to add user.');
        }
    }
}


// delete multiple users
async function deleteUsersHelper(user_ids) {
    try {
        // send post request with list of ids to delete
        const res = await axios.post('/api/admin/users/delete-multiple', { user_ids });
        return res.data;
    } catch (e) {
        console.error("Failed to delete users:", e);
        return { msg: "Failed to delete users" };
    }
}


createApp({
    data() {
        return {
            showSort: false,
            showFilters: false,
            showLoadLimit: false,
            totalUsers: 0,
            totalActive: 0,
            totalContent: 0,
            totalVisits: 0,
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
                user_name: '',
                first_name: '',
                last_name: '',
                password: '',
                role: 'user',
                profile_picture_url: '/uploads/avatar3.svg'
            },
            editingUser: {
                user_id: 0,
                user_name: '',
                first_name: '',
                last_name: '',
                role: '',
                profile_picture_url: '',
                pfpPreview: null
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
        async addUser() {
            // Check if all fields are filled
            if (Object.values(this.newUser).some(val => !val)) {
                alert('Please fill all fields.');
                return;
            }

            // validate password
            this.validatePass(this.newUser.password);
            if (!this.isPassValid()) {
                this.passError = 'Password did not meet requirements';
                return;
            }

            const userPayload = {
                username: this.newUser.user_name,
                password: this.newUser.password,
                firstName: this.newUser.first_name,
                lastName: this.newUser.last_name,
                role: this.newUser.role
            };

            const newUserDetails = await addNewUser(userPayload);

            // add new user to UI list
            this.users.push({
                user_id: newUserDetails.user_id,
                user_name: this.newUser.user_name,
                first_name: this.newUser.first_name,
                last_name: this.newUser.last_name,
                role: this.newUser.role,
                registration_date: new Date().toLocaleDateString(),
                profile_picture_url: this.newUser.profile_picture_url,
                last_login: 'Not active'
            });

            this.resetForm();

        },
        resetForm() {
            // discard last new user data
            this.newUser = {
                user_name: '',
                first_name: '',
                last_name: '',
                password: '',
                role: 'user',
                profile_picture_url: '/uploads/avatar3.svg'
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
        async imageUpload(event, isEditing) {
            const file = event.target.files[0];
            this.uploadError = '';

            if (!file) {
                return;
            }

            // Validate file type
            if (!file.type.match('image/jpg') && !file.type.match('image/jpeg') && !file.type.match('image/png')) {
                this.uploadError = 'Please upload a JPG/JPEG/PNG file';
                return;
            }

            // Validate file size
            if (file.size > 1024 * 1024) {
                this.uploadError = 'Max file size allowed is 1MB';
                return;
            }

            const formData = new FormData();
            formData.append('profile_picture', file);

            // Get target user ID
            const userId = isEditing ? this.editingUser.user_id : null;
            if (!userId) {
                this.uploadError = 'User ID not found for upload';
                return;
            }

            try {
                const response = await axios.post(`/api/admin/users/${userId}/profile-picture`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const uploadedUrl = response.data.profile_picture_url;

                if (isEditing) {
                    this.editingUser.pfpPreview = uploadedUrl;
                    this.editingUser.profile_picture_url = uploadedUrl;
                } else {
                    this.newUser.pfpPreview = uploadedUrl;
                    this.newUser.profile_picture_url = uploadedUrl;
                }
            } catch (error) {
                console.error('Upload failed:', error);
                this.uploadError = 'Failed to upload profile picture';
            }
        },
        // select pre made avatars
        selectAv(avatar, isEditing) {
            // set avatar 3 as default if no av input entered
            if (!avatar) {
                if (isEditing) {
                    this.editingUser.profile_picture_url = `/uploads/avatar3.svg`;
                    this.editingUser.pfpPreview = `/uploads/avatar3.svg`;
                } else {
                    this.newUser.profile_picture_url = `/uploads/avatar3.svg`;
                    this.newUser.pfpPreview = `/uploads/avatar3.svg`;
                }
                return;
            }
            // check if selection is for editing or adding new user
            if (isEditing) {
                this.editingUser.profile_picture_url = `/uploads/${avatar}.svg`;
                this.editingUser.pfpPreview = `/uploads/${avatar}.svg`;
            } else {
                this.newUser.profile_picture_url = `/uploads/${avatar}.svg`;
                this.newUser.pfpPreview = `/uploads/${avatar}.svg`;
            }
        },
        // edit an existing user
        editUser(user) {
            this.editingUser = {
                user_id: user.user_id,
                user_name: user.user_name,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                profile_picture_url: user.profile_picture_url,
                pfpPreview: user.profile_picture_url.includes('avatar') ? `${user.profile_picture_url}` : user.profile_picture_url
            };
            console.log('Editing user role:', this.editingUser.role);
            this.showEditUser = true;
        },
        // save edits made to existing user
        async saveEdits() {
            const userIdx = this.users.findIndex((u) => u.user_id === this.editingUser.user_id);

            if (userIdx !== -1) {
                const originalUserData = { ...this.users[userIdx] };

                const updates = {};

                if (this.editingUser.first_name !== originalUserData.first_name) {
                    updates.firstName = this.editingUser.first_name;
                }
                if (this.editingUser.last_name !== originalUserData.last_name) {
                    updates.lastName = this.editingUser.last_name;
                }
                if (this.editingUser.user_name !== originalUserData.user_name) {
                    updates.userName = this.editingUser.user_name;
                }
                if (this.editingUser.role !== originalUserData.role) {
                    updates.role = this.editingUser.role;
                }
                if (this.editingUser.profile_picture_url !== originalUserData.profile_picture_url) {
                    updates.profile_picture_url = this.editingUser.profile_picture_url;
                }

                const response = await editUser(originalUserData.user_id, updates);
                if (response.msg === "User updated") {
                    // Update only modified fields in local state
                    this.users[userIdx] = {
                        ...this.users[userIdx],
                        first_name: updates.firstName || originalUserData.first_name,
                        last_name: updates.lastName || originalUserData.last_name,
                        user_name: updates.userName || originalUserData.user_name,
                        role: updates.role || originalUserData.role,
                        profile_picture_url: this.editingUser.profile_picture_url
                    };
                } else {
                    alert("Failed to update user.");
                }
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
        },
        helperProfilePicture(profile_picture_url) {

            if (profile_picture_url.includes('avatar')) {
                const fileName = profile_picture_url.replace("/upload/", "").replace(".svg", "");

                // Step 2: Extract number using regex
                const match = fileName.match(/\d+/); // \d+ = one or more digits
                const number = match ? parseInt(match[0], 10) : 0;

                return "Avatar " + number;
            } else {
                return 'Uploaded Image'
            }
        },
        async getStats() {
            const stats = await getMethod('api/admin/stats');

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
                url.searchParams.set("sort", this.sort + ".asc");
            }

            this.filter.roles.forEach((role) => {
                url.searchParams.append("role", role);
            });

            if (this.search) {
                url.searchParams.set("username", this.search);
            }


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
        },
        async deleteUsers() {
            if (this.selectedUsers.length === 0) {
                alert("No users selected for deletion.");
                return;
            }

            const confirmDelete = confirm("Are you sure you want to delete the selected users?");
            if (!confirmDelete) return;

            const resp = await deleteUsersHelper(this.selectedUsers);

            if (resp.deleted_ids && Array.isArray(resp.deleted_ids)) {
                // remove the deleted users from local list
                this.users = this.users.filter(user => !resp.deleted_ids.includes(user.user_id));

                // clear selection
                this.selectedUsers = [];
                this.isSelectOn = false;

                alert("Selected users have been deleted.");
            } else {
                alert(resp.msg || "Failed to delete users.");
            }

            this.currentPage = 1;
        },
        toggleRole(role) {
            const idx = this.filter.roles.indexOf(role);
            if (idx === -1) {
                this.filter.roles.push(role);
            } else {
                this.filter.roles.splice(idx, 1);
            }

            showFilters = false;
        },
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
        adminCount() {
            return this.users.filter(user => user.role === 'admin').length;
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
        sort() {
            this.getUsers(this.createUrl());
        },
        currentPage() {
            this.getUsers(this.createUrl());
        },
        loadLimit() {
            this.getUsers(this.createUrl());
        },
        'filter.roles': {
            handler() {
                this.getUsers(this.createUrl());
            },
            deep: true
        },
        search() {
            this.getUsers(this.createUrl());
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
