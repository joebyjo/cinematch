// const { createApp } = Vue;

// eslint-disable-next-line no-undef
createApp({
    data() {
        return {
            // track if each card is flipped
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

            // reset all flips before flipping the selected one
            this.isFlipped1 = false;
            this.isFlipped2 = false;
            this.isFlipped3 = false;
            this.isFlipped4 = false;

            // flip the selected card only
            if (cardNum === 1) this.isFlipped1 = true;
            if (cardNum === 2) this.isFlipped2 = true;
            if (cardNum === 3) this.isFlipped3 = true;
            if (cardNum === 4) this.isFlipped4 = true;
        },
        flipAllBack() {
            // reset all flipped cards
            this.isFlipped1 = false;
            this.isFlipped2 = false;
            this.isFlipped3 = false;
            this.isFlipped4 = false;
        }
    },
    mounted() {
        // listen for outside clicks to close all cards
        document.addEventListener('click', () => {
            this.flipAllBack();
        });
    }
}).mount('#about-us');
