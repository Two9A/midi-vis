// Lifted from https://github.com/ysk-omi/web-midi-api-visualizer
class MIDI {
    constructor() {
        this.midi = null;
        this.inputs = [];
        this.subscribers = [];
    }

    onConnect(access) {
        return new Promise((resolve, reject) => {
            console.log('[MIDI] Connected');
            this.midi = access;
            resolve();
        });
    }

    onFail(msg) {
        console.log('[MIDI] Failure', msg);
    }

    setInputs() {
        return new Promise((resolve, reject) => {
            console.log('[MIDI] Inputs ready');
            this.inputs = this.midi.inputs;
            this.inputs.forEach((i) => {
                console.log('[MIDI] Input', i);
                i.onmidimessage = this.onMessage.bind(this);
            });
            resolve();
        });
    }

    onMessage(e) {
        let ev = {
            command: e.data[0] >> 4,
            channel: e.data[0] & 15,
            note: e.data[1],
            velocity: e.data[2]
        };
        console.log('[MIDI] Message', ev);
        switch (ev.command) {
            // Keyup
            case 8:
                this.subscribers.forEach((sub) => {
                    sub.onKeyup(ev);
                });
                break;

            // Keydown
            case 9:
                this.subscribers.forEach((sub) => {
                    sub.onKeydown(ev);
                });
                break;
        }
    }

    connect() {
        return navigator.requestMIDIAccess({sysex: false})
            .then(this.onConnect.bind(this), this.onFail.bind(this))
            .then(this.setInputs.bind(this), this.onFail.bind(this));
    }

    subscribe(o) {
        console.log('[MIDI] Subscriber', o);
        this.subscribers.push(o);
    }
}
