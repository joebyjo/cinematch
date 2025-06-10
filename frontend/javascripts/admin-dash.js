
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
            currentPage: 1,
            isSelectOn: false,
            selectedUsers: [],
            showAddUser: false,
            showEditUser: false,
            uploadError: '',
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
                    pfp: 'uploaded image',
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
                    pfp: 'uploaded image',
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
        toggleSelect() {
            this.isSelectOn = !this.isSelectOn;
            if (!this.isSelectOn) {
                this.selectedUsers = [];
            }
        },
        SelectUser(username) {
            const index = this.selectedUsers.indexOf(username);
            if (index === -1) {
                this.selectedUsers.push(username);
            } else {
                this.selectedUsers.splice(index, 1);
            }
        },
        addUser() {
            if (Object.values(this.newUser).some((val) => !val)) {
                alert('Please fill all fields.');
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
            this.newUser = {
                username: '',
                firstname: '',
                lastname: '',
                password: '',
                role: '',
                pfp: '',
                pfpPreview: null
            };
            this.showAddUser = false;
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
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                pfp: user.pfp,
                pfpPreview: user.pfp.includes('avatar')?`./images/settings/${user.pfp}.svg` : null // need to get uploaded here
            };
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
        async getStats() {
            const stats =  await getMethod('api/admin/stats');

            this.totalUsers = stats.total_users;
            this.totalActive = stats.total_active;
            this.totalContent = stats.total_movies;
            this.totalVisits = stats.total_visits;
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
        this.getStats();
    }
}).mount('#admin-dash');
