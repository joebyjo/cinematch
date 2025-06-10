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
            uploadError: '',
            newUser: {
                firstname: '',
                lastname: '',
                username: '',
                password: '',
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
                pfp: 'avatar 1',
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
                    pfp: 'avatar 1',
                    lastActive: '15/03/2024 14:30'
                },
                {
                    username: 'liri_1',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '02/02/2025',
                    pfp: 'uploaded image : link',
                    lastActive: '15/03/2024 15:45'
                },
                {
                    username: 'joe_1',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'Administrator',
                    dateJoined: '03/03/2025',
                    pfp: 'avatar 2',
                    lastActive: '14/03/2024 09:15'
                },
                {
                    username: 'hiten_1',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'User',
                    dateJoined: '04/04/2025',
                    pfp: 'avatar 5',
                    lastActive: '15/03/2024 11:20'
                },
                {
                    username: 'josheen_2',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '05/01/2025',
                    pfp: 'uploaded image : link',
                    lastActive: '15/03/2024 16:00'
                },
                {
                    username: 'liri_2',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'Administrator',
                    dateJoined: '06/02/2025',
                    pfp: 'uploaded image : link',
                    lastActive: '15/03/2024 15:30'
                },
                {
                    username: 'joe_2',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'User',
                    dateJoined: '07/03/2025',
                    pfp: 'avatar 3',
                    lastActive: '13/03/2024 18:45'
                },
                {
                    username: 'hiten_2',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'Administrator',
                    dateJoined: '08/04/2025',
                    pfp: 'uploaded image : link',
                    lastActive: '15/03/2024 14:15'
                },
                {
                    username: 'josheen_3',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '09/01/2025',
                    pfp: 'avatar 4',
                    lastActive: '15/03/2024 12:30'
                },
                {
                    username: 'liri_3',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '10/02/2025',
                    pfp: 'avatar 2',
                    lastActive: '15/03/2024 15:45'
                },
                {
                    username: 'josheen_4',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'Administrator',
                    dateJoined: '01/01/2025',
                    pfp: 'avatar 1',
                    lastActive: '08/03/2024 10:20'
                },
                {
                    username: 'liri_4',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '02/02/2025',
                    pfp: 'uploaded image : link',
                    lastActive: '13/03/2024 16:30'
                },
                {
                    username: 'joe_3',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'Administrator',
                    dateJoined: '03/03/2025',
                    pfp: 'avatar 2',
                    lastActive: '15/03/2024 13:15'
                },
                {
                    username: 'hiten_3',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'User',
                    dateJoined: '04/04/2025',
                    pfp: 'avatar 5',
                    lastActive: '15/03/2024 16:00'
                },
                {
                    username: 'josheen_5',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '05/01/2025',
                    pfp: 'uploaded image : link',
                    lastActive: '14/03/2024 20:45'
                },
                {
                    username: 'liri_5',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'Administrator',
                    dateJoined: '06/02/2025',
                    pfp: 'uploaded image : link',
                    lastActive: '15/03/2024 11:30'
                },
                {
                    username: 'joe_4',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'User',
                    dateJoined: '07/03/2025',
                    pfp: 'avatar 3',
                    lastActive: '15/03/2024 14:30'
                },
                {
                    username: 'hiten_4',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'Administrator',
                    dateJoined: '08/04/2025',
                    pfp: 'uploaded image : link',
                    lastActive: '15/02/2024 09:15'
                },
                {
                    username: 'josheen_6',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '09/01/2025',
                    pfp: 'avatar 4',
                    lastActive: '12/03/2024 17:30'
                },
                {
                    username: 'liri_6',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '10/02/2025',
                    pfp: 'avatar 2',
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
                firstname: '',
                lastname: '',
                username: '',
                password: '',
                role: '',
                pfp: '',
                pfpPreview: null
            };
            this.showAddUser = false;
        },
        imageUpload(event) {
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
                this.newUser.pfpPreview = e.target.result;
                this.newUser.pfp = `Uploaded image`;
            };
            reader.readAsDataURL(file);
        },
        selectAv(avatar) {
            if (!avatar) {
                this.newUser.pfp = '';
                this.newUser.pfpPreview = null;
                return;
            }
            this.newUser.pfp = avatar;
            this.newUser.pfpPreview = `./images/settings/${avatar}.svg`;
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
    }
}).mount('#admin-dash');
