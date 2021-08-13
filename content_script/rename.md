A melody is a sequence of tones of that we, as listeners, perceive as a single entity. One of the things we perceive when we listen to a melody is how high or low each tone is.
We also perceive the duration of the tones in a melody: some are shorter, some are longer. Let's draw the tones in our melody as they occur over time:
The drawing suggests that tones can be placed on an underlying grid. On the time axis, the start and duration of tones follows (or breaks) the same kind of time grid we discussed on our Rhythm lesson - we could count them like so: 
click here to show grid on sketch (and add a metronome?)
.
But what about the pitches? There seem to be only three or four pitches in this melody  ––are they placed on an underlying perceptual grid as well? (
click here to show pitch grid on sketch
) 
We will address this question in the next sections, by creating a series of digital instruments and generative melodies.
## Pitch and Loudness
When we whistle, we displace the air molecules next to our lips, and cause them to move back and forth - to oscillate. This causes the molecules next to 
them 
to oscillate, and so on. The chain reaction creates a sound wave that, when it reaches our ears, we perceive as pitch. 
If rhythm is the element of music that makes us tap our foot and want to dance, melody is what we hum along to, or whistle for days on end. Here is one example of a melody:
If we zoomed into a single molecule, we would see that its trajectory draws a waveform over time: 
[](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/423039f6-01c9-4d66-af7f-2ec915e236f4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210813%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210813T173708Z&X-Amz-Expires=3600&X-Amz-Signature=a1bf1a337ac2425651c176748631115b22372a38927377aff597977a79eb8056&X-Amz-SignedHeaders=host)
Switch the sketch to Microphone mode, and whistle or sing some tones - higher, lower, louder, softer.  How do changes in pitch and volume affect the waveform?
You might have noticed the following: 
* The louder the tone, the larger the distance traveled by the molecule. This distance is the 
* amplitude
*  of the waveform: 
[](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/3dba363f-e2cc-44fe-8fe8-26d22b1033b2/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210813%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210813T173708Z&X-Amz-Expires=3600&X-Amz-Signature=f82bf43606b3906c19fb0aea6d8cd423e004fdedab9aa6da0fa71a3d8825b58e&X-Amz-SignedHeaders=host)
* The higher the pitch, the faster the molecule moves up and down - the more cycles the it completes per second. This is the 
* frequency
*  of the waveform:
[](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/96adf8f0-f4c4-4d4b-8d81-b4453a2abd29/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210813%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210813T173708Z&X-Amz-Expires=3600&X-Amz-Signature=bdbb1504bdfdfa4f8761592538f2b4fae4bccf2d0c7a3b2c2f9d854816fdc546&X-Amz-SignedHeaders=host)
### Pitches in Code
With this knowledge - melodies are sequences of tones, tones are oscillations at different amplitudes and frequencies which make them higher, lower, louder and softer - let's create our first pitched digital instrument. 
We need an object that oscillates, generating a sound wave that goes out of the computer speakers, and allows us to control the frequency and amplitude of its oscillation. Tone.js' Oscillator does just that. 
We can make the oscillator's pitch higher or lower by changing its frequency property, and make it louder or softer by changing the value of its amplitude property. Drag the values on the code below and listen to the changes.
[](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0455bbfc-af36-4f2e-88a5-ba45e4ae657f/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210813%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210813T173708Z&X-Amz-Expires=3600&X-Amz-Signature=21b6a61defc494868fa1a0ceb716211909b866416745ac1f3a504d0ebe28c439&X-Amz-SignedHeaders=host)
### Exercise
By giving control of these two parameters to the user, create your own 
[Theremin](https://www.youtube.com/watch?v=PjnaciNT-wQ)
-like instrument. Map the x position of the mouse to the pitch, and the y position to the amplitude of the oscillator. What range of frequencies does your instrument have? What's the range of amplitudes?Extension: allow user to add guides to the interface by clicking (see ICM Sound example). 
References: Learning Synths and the Theremin from class.
Starter Code (has Tone.js imported, the oscillator running, suggestions to use map, mouseX and mouseY?)
## The Pitch Helix
In our oscillator example above, we are laying out frequencies on a line, like so: 
But a line might not be the best way to represent pitches. Using the frequency input box above, set the frequency to 100Hz and listen to it. Then, compare it to 200Hz, and to 110Hz. Which of these feels more similar to the original 100Hz? 
It is likely that 200Hz feels more similar: like it's the same kind of pitch, but higher. 
A helix might be a better representation for pitches as we perceive them:
On the sketch below, start with the lowest pitch, drag a full cycle up (until you get to the same color), and then another. Do you get a feeling of arrival when you get to the same color again? 
Now using the input field, input 100Hz, 200Hz, 400Hz, 800Hz. Do these all feel similar? 
If we take any pitch and multiply its frequency by two, we will get a pitch that we perceive to be higher, but of the same class. In the interactive above, pitch classes are represented by color hues. 
