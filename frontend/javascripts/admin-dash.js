createApp({
    data() {
        // dummy data
        return {
            showSort: false,
            showFilters: false,
            showLoadLimit: false,
            loadLimit: 10,
            currentPage: 1,
            isSelectOn: false,
            selectedUsers: [],
            currAdmin: {
                username: 'josheen_1',
                firstname: 'Josheen',
                lastname: 'Kour',
                role: 'Administrator',
                dateJoined: '01/01/2025',
                pfp: 'avatar 1',
                lastActive: '15/03/2024 14:30'
            },
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
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.users.length/this.loadLimit);
        },
        CurrPageUsers() {
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
