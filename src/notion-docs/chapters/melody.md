---

title: Melody

---

# Melody

If rhythm is the element of music that makes us tap our foot and want to dance, melody is what we hum along to, or whistle for days on end.

A melody is a sequence of tones that we, as listeners, perceive as a single entity. One of the things we perceive when we listen to a melody is pitch - how high or low each tone is. Here is one example of a melody:

{% p5 melody/melody-1 %}

There are also slight differences in loudness: some tones are louder, some are softer:

<iframe src="https://editor.p5js.org/luisa_NYU/full/vynz3it3_"></iframe>

Tones also have a duration: some are shorter, some are longer. Let's draw the tones in our melody as they occur over time:

{% p5 melody/melody-2 %}

The drawing suggests that tones can be placed on an underlying grid. On the time axis, the start and duration of tones follows (or breaks) the same kind of time grid we discussed on our Rhythm lesson - we could count them like so: {% inlinebutton sketch2toggleTimeGrid() [Show Time Grid] %}

But what about the pitch axis? There seem to be only three or four pitches in this melody –– are they placed on an underlying perceptual grid as well? {% inlinebutton sketch2togglePitchGrid() [Show Pitch Grid] %}

We will address this question in the next sections, by creating a series of digital instruments and generative melodies.

## Pitch and Loudness

When we whistle, we displace the air molecules next to our lips, and cause them to move back and forth - to oscillate. This causes the molecules next to them to oscillate, and so on. The chain reaction creates a sound wave that, when it reaches our ears, we perceive as pitch.

{% p5 melody/melody-3/ %}

If we zoomed into a single molecule, we would see that its trajectory draws a waveform over time:

<figure>

![Melody-0.png](Melody-0.png)

</figure><br>

Switch the sketch to Microphone mode, and whistle or sing some tones - higher, lower, louder, softer. How do changes in pitch and volume affect the waveform?

You might have noticed the following:

- The louder the tone, the larger the distance traveled by the molecule. This distance is the amplitude of the waveform:

<figure>

![Melody-1.png](Melody-1.png)
_Click and hold to play each. Amplitude is often measured in decibels (dB). UX reference [here](https://learningsynths.ableton.com/en/lfos/changing-the-modulation-shape)._

</figure><br>

- The higher the pitch, the faster the molecule moves up and down - the more cycles the it completes per second. This is the frequency of the waveform:

<figure>

![Melody-2.png](Melody-2.png)
_Click and hold to play each. Frequency is measured in Hertz (Hz). One hertz is one cycle per second._

</figure><br>

### Code

With this knowledge - melodies are sequences of tones, tones are oscillations at different amplitudes and frequencies which make them higher, lower, louder and softer - let's create our first pitched digital instrument.

We need an object that oscillates, generating a sound wave that goes out of the computer speakers, and allows us to control the frequency and amplitude of its oscillation. Tone.js' Oscillator does just that.

```javascript
// Create an object of the Oscillator class
let osc = new Tone.Oscillator();

// Connect it to our computer's audio output
osc.toDestination();
```

We can make the oscillator's pitch higher or lower by changing its frequency, and make it louder or softer by changing the value of its amplitude. Drag the circle in the sketch below and listen to the changes in pitch and volume.

{% interactiveSketch theraminInteractive 29 35 %}

### Exercise

Modify the example above, and create your own [Theremin](https://www.youtube.com/watch?v=PjnaciNT-wQ)-like instrument:

- What range of frequencies does your instrument offer? What's the range of amplitudes?
- Applying what you learned in the Elements of Sound chapter, change the volume and frequency mapping so that instead of being linear, it is on a logarithmic scale. Is the difference noticeable?
- Allow your user to add pitch guides to the interface by clicking at certain Y positions.
- Connect the circle’s position to the motion of your body using [ml5 and PoseNet](https://learn.ml5js.org/#/reference/posenet).

References:

- Theremin

<figure>

![Melody-3.png](Melody-3.png)
_Alexandra Stepanoff playing the theremin on [NBC Radio](https://en.wikipedia.org/wiki/NBC_Red_Network), 1930. Image source: [wikipedia](https://en.wikipedia.org/wiki/Theremin)._

</figure><br>

<figure>

![Melody-4.png](Melody-4.png)
_Pamela Z’s [suite for solo voice and electronics](https://www.youtube.com/watch?v=ebxvVJwGWek)_

</figure><br>
