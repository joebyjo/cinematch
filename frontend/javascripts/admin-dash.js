createApp({
    data() {
        // dummy data
        return {
            showSort: false,
            showFilters: false,
            showLoadLimit: false,
            loadLimit: 10,
            currentPage: 1,
            users: [
                {
                    username: 'josheen_1',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'Administrator',
                    dateJoined: '01/01/2025',
                    pfp: 'avatar 1'
                },
                {
                    username: 'liri_1',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '02/02/2025',
                    pfp: 'uploaded image : link'
                },
                {
                    username: 'joe_1',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'Administrator',
                    dateJoined: '03/03/2025',
                    pfp: 'avatar 2'
                },
                {
                    username: 'hiten_1',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'User',
                    dateJoined: '04/04/2025',
                    pfp: 'avatar 5'
                },
                {
                    username: 'josheen_2',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '05/01/2025',
                    pfp: 'uploaded image : link'
                },
                {
                    username: 'liri_2',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'Administrator',
                    dateJoined: '06/02/2025',
                    pfp: 'uploaded image : link'
                },
                {
                    username: 'joe_2',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'User',
                    dateJoined: '07/03/2025',
                    pfp: 'avatar 3'
                },
                {
                    username: 'hiten_2',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'Administrator',
                    dateJoined: '08/04/2025',
                    pfp: 'uploaded image : link'
                },
                {
                    username: 'josheen_3',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '09/01/2025',
                    pfp: 'avatar 4'
                },
                {
                    username: 'liri_3',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '10/02/2025',
                    pfp: 'avatar 2'
                },
                {
                    username: 'josheen_4',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'Administrator',
                    dateJoined: '01/01/2025',
                    pfp: 'avatar 1'
                },
                {
                    username: 'liri_4',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '02/02/2025',
                    pfp: 'uploaded image : link'
                },
                {
                    username: 'joe_3',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'Administrator',
                    dateJoined: '03/03/2025',
                    pfp: 'avatar 2'
                },
                {
                    username: 'hiten_3',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'User',
                    dateJoined: '04/04/2025',
                    pfp: 'avatar 5'
                },
                {
                    username: 'josheen_5',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '05/01/2025',
                    pfp: 'uploaded image : link'
                },
                {
                    username: 'liri_5',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'Administrator',
                    dateJoined: '06/02/2025',
                    pfp: 'uploaded image : link'
                },
                {
                    username: 'joe_4',
                    firstname: 'Joe Byjo',
                    lastname: 'Puthussery',
                    role: 'User',
                    dateJoined: '07/03/2025',
                    pfp: 'avatar 3'
                },
                {
                    username: 'hiten_4',
                    firstname: 'Hiten',
                    lastname: 'Gupta',
                    role: 'Administrator',
                    dateJoined: '08/04/2025',
                    pfp: 'uploaded image : link'
                },
                {
                    username: 'josheen_6',
                    firstname: 'Josheen',
                    lastname: 'Kour',
                    role: 'User',
                    dateJoined: '09/01/2025',
                    pfp: 'avatar 4'
                },
                {
                    username: 'liri_6',
                    firstname: 'Subhashree',
                    lastname: 'Das',
                    role: 'User',
                    dateJoined: '10/02/2025',
                    pfp: 'avatar 2'
                }
            ]
        };
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
