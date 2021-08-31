---

title: Melody

---

# Melody

If rhythm is the element of music that makes us tap our foot and want to dance, melody is what we hum along to, or whistle for days on end. Here is one example of a melody:

<iframe height="100%" src="https://luisaph.github.io/the-code-of-music-jekyll/sketches/melody/2_melody_4/index.html"></iframe>

A melody is a sequence of tones of that we, as listeners, perceive as a single entity. One of the things we perceive when we listen to a melody is how high or low each tone is.

{% p5 melody/melody-0/ %}

We also perceive the duration of the tones in a melody: some are shorter, some are longer. Let's draw the tones in our melody as they occur over time:

{% p5 melody/melody-1/ %}

The drawing suggests that tones can be placed on an underlying grid. On the time axis, the start and duration of tones follows (or breaks) the same kind of time grid we discussed on our Rhythm lesson - we could count them like so: click here to show grid on sketch (and add a metronome?).

But what about the pitches? There seem to be only three or four pitches in this melody ––are they placed on an underlying perceptual grid as well? (click here to show pitch grid on sketch)

We will address this question in the next sections, by creating a series of digital instruments and generative melodies.

## Pitch and Loudness

When we whistle, we displace the air molecules next to our lips, and cause them to move back and forth - to oscillate. This causes the molecules next to them to oscillate, and so on. The chain reaction creates a sound wave that, when it reaches our ears, we perceive as pitch.

{% p5 melody/melody-2/ %}

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

### Pitches in Code

With this knowledge - melodies are sequences of tones, tones are oscillations at different amplitudes and frequencies which make them higher, lower, louder and softer - let's create our first pitched digital instrument.

We need an object that oscillates, generating a sound wave that goes out of the computer speakers, and allows us to control the frequency and amplitude of its oscillation. Tone.js' Oscillator does just that.

```js
// Create an object of the Oscillator class
let osc = new Tone.Oscillator();

// Connect it to our computer's audio output
osc.toDestination();
```

We can make the oscillator's pitch higher or lower by changing its frequency property, and make it louder or softer by changing the value of its amplitude property. Drag the values on the code below and listen to the changes.

<figure>

![Melody-3.png](Melody-3.png)
_The ball moves up and down for amplitude; left and right for pitch_

</figure><br>

```js
osc.frequency.value = 400;
osc.amplitude.value = 0.9;
```

### Exercise

By giving control of these two parameters to the user, create your own [Theremin](https://www.youtube.com/watch?v=PjnaciNT-wQ)-like instrument. Map the x position of the mouse to the pitch, and the y position to the amplitude of the oscillator. What range of frequencies does your instrument have? What's the range of amplitudes?Extension: allow user to add guides to the interface by clicking (see ICM Sound example).

References: Learning Synths and the Theremin from class.

Starter Code (has Tone.js imported, the oscillator running, suggestions to use map, mouseX and mouseY?)

## The Pitch Helix

In our oscillator example above, we are laying out frequencies on a line, like so:

<iframe height="100%" src="https://luisaph.github.io/the-code-of-music-jekyll/sketches/melody/2_melody_1/index.html"></iframe>

But a line might not be the best way to represent pitches. Using the frequency input box above, set the frequency to 100Hz and listen to it. Then, compare it to 200Hz, and to 110Hz. Which of these feels more similar to the original 100Hz?

It is likely that 200Hz feels more similar: like it's the same kind of pitch, but higher.

A helix might be a better representation for pitches as we perceive them:

<iframe height="100%" src="https://luisaph.github.io/the-code-of-music-jekyll/sketches/melody/2_melody_glide_up_mouseIsPressed/index.html"></iframe>

On the sketch below, start with the lowest pitch, drag a full cycle up (until you get to the same color), and then another. Do you get a feeling of arrival when you get to the same color again?

<iframe height="100%" src="https://luisaph.github.io/the-code-of-music-jekyll/sketches/melody/2_melody_2/index.html"></iframe>

Now using the input field, input 100Hz, 200Hz, 400Hz, 800Hz. Do these all feel similar?

If we take any pitch and multiply its frequency by two, we will get a pitch that we perceive to be higher, but of the same class. In the interactive above, pitch classes are represented by color hues.
