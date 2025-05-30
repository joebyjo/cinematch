// const { createApp } = Vue;

// eslint-disable-next-line no-undef
createApp({
    data() {
        return {
            isFlipped1: false,
            isFlipped2: false,
            isFlipped3: false,
            isFlipped4: false
        };
    },
    methods: {
        flipCard(cardNum, event) {
            // stop click from going outside
            event.stopPropagation();

            this.isFlipped1 = false;
            this.isFlipped2 = false;
            this.isFlipped3 = false;
            this.isFlipped4 = false;

            if (cardNum === 1) this.isFlipped1 = true;
            if (cardNum === 2) this.isFlipped2 = true;
            if (cardNum === 3) this.isFlipped3 = true;
            if (cardNum === 4) this.isFlipped4 = true;
        },
        flipAllBack() {
            this.isFlipped1 = false;
            this.isFlipped2 = false;
            this.isFlipped3 = false;
            this.isFlipped4 = false;
        }
    },
    mounted() {
        document.addEventListener('click', () => {
            this.flipAllBack();
        });
    }
}).mount('#about-us');
