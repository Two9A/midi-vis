# MIDI Piano visualiser

As used on ostilton's Twitch stream:

![Capture example](http://c64clicker.com/dump/20211107-twitch.gif)

Uses the Web MIDI API to visualise keypresses on a connected MIDI piano. Code
for subscribing to Web MIDI events is adapted from
[omi-yusuke's visualiser](https://github.com/ysk-omi/web-midi-api-visualizer).

## Usage

- Connect your MIDI device before loading `index.html`;
- In OBS, add your browser as a Window Capture source;
- Add a Chroma Key filter to the new source, type Green, and adjust the
similarity until the green surround is keyed out;
- Ensure that keys appear in the OBS overlay when pressed on the piano.
