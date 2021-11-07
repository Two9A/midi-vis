/**
 * MIDI key visualiser
 * Imran Nazar, 2021
 */
class Vis {
    constructor() {
        // Configuration variables:
        // Dimensions of the internal canvas
        this.WIDTH = 1250;
        this.HEIGHT = 720;

        // Frames per second and amount of scroll per frame
        // Reduce STEP for a slower scroll
        this.FPS = 30;
        this.STEP = 10;

        // Visualisation colours: defaults are blue shades
        this.CANVAS_BG = '#333333';
        this.NOTE_BG_WHITE = '#19b0ff';
        this.NOTE_BG_BLACK = '#006499';
        this.NOTE_WIDTH_WHITE = 24;
        this.NOTE_WIDTH_BLACK = 16;

        this.canvas = document.getElementById('scr');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');

        this.keysPressed = {};

        setTimeout(this.step.bind(this), 1000 / this.FPS);
    }

    /**
     * step: Render the currently pressed keys, and scroll the canvas
     */
    step() {
        const ctx = this.ctx;

        // Move everything on canvas up STEP pixels
        const img = ctx.getImageData(0, this.STEP, this.WIDTH, this.HEIGHT);
        ctx.putImageData(img, 0, 0);

        // Blank out the bottom STEP pixels
        ctx.fillStyle = this.CANVAS_BG;
        ctx.fillRect(0, this.HEIGHT - this.STEP, this.WIDTH, this.STEP);

        for (let i in this.keysPressed) {
            this.drawKey(0 | i);
        }

        // Reset the timeout, so we come back again
        setTimeout(this.step.bind(this), 1000 / this.FPS);
    }

    /**
     * drawKey: Render a key based on its MIDI key number
     * @param note int The MIDI value (0 is bottom A)
     */
    drawKey(note) {
        // Each octave is 7 white notes wide on-screen; we include the
        // 5 off-piano white keys below bottom A, to simplify the
        // octave + note calculation
        const octaveOffsets = [
            -5, 2, 9, 16, 23, 30, 37, 44, 51
        ];

        // Black keys are 2/3 width, and render 1/3 on either side
        // of a white-key boundary
        const noteOffsets = [
            0, 0.67, 1, 1.67, 2,
            3, 3.67, 4, 4.67, 5, 5.67, 6,
        ];

        // Black keys are C#, D#, F#, G#, A#
        const isBlack = [1, 3, 6, 8, 10].includes(note % 12);

        const offset =
            octaveOffsets[0 | (note / 12)] +
            noteOffsets[note % 12];

        // Draw the rect at the bottom of canvas
        this.ctx.fillStyle = isBlack ? this.NOTE_BG_BLACK : this.NOTE_BG_WHITE;
        this.ctx.fillRect(
            offset * this.NOTE_WIDTH_WHITE,
            this.HEIGHT - this.STEP,
            isBlack ? this.NOTE_WIDTH_BLACK : this.NOTE_WIDTH_WHITE,
            this.STEP
        );
    }

    /**
     * Subscription events: keydown, keyup
     * @param e MIDIEvent
     * @note MIDI note numbers are 0 to 127, 60 is middle C
     *       12 is the C below bottom A (the lowest real event is 21)
     */
    onKeydown(e) {
        this.keysPressed[e.note - 12] = true;
    }
    onKeyup(e) {
        delete this.keysPressed[e.note - 12];
    }
};
