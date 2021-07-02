---
layout: page
title: Melody
permalink: /elements/melody/
categories: chapter
i: 2
---

# Melody

If rhythm is the element of music that makes us tap your foot and want to dance, melody is the element that we hum along to, or whistle for days on end. Here is one example of a melody: 
<iframe style="border-width:0px" width="100%" height="80" src="{{ site.sketchesURL }}/melody/2_melody_4/index.html"></iframe>

A melody is a sequence of tones of that we, as listeners, perceive as a single entity. One of the things we perceive when we listen to a melody is how high or low each tone is. This quality of a tone is called pitch. 
<iframe style="border-width:0px" width="100%" height="290" src="{{ site.sketchesURL }}/melody/2_melody_5/index.html"></iframe>

We also perceive the duration of tones: some are shorter, some are longer. Let's draw the tones in our melody as they occur over time:  
<iframe style="border-width:0px" width="100%" height="290" src="{{ site.sketchesURL }}/melody/2_melody_7/index.html"></iframe>

The drawing suggests that tones are placed on an underlying grid. On the time axis, the start and duration of tones follows (or breaks) the same kind of time grid we discussed on our Rhythm lesson - we could count them like so: 

Sketch: add time grid to the duration sketch, highlighting current count. Set it to a metronome? Or maybe just add a button that says "SHOW GRID" and ask reader to click on it to show the grid on the previous sketch.
{: .alert .alert-info}

But what about the pitches? There seem to be only three or four pitches in this melody ––are they placed on an underlying perceptual grid as well? We will address this question in the next sections, by creating a series of simple digital instruments and generative melodies.

## Pitches
When we whistle (or when we pluck a guitar string, sing, play a marimba, flute, or any other pitched instrument), we cause a repeating vibration in the air molecules. When this vibration - this sound wave - reaches our ears, we perceive it as pitch. 

<img src ="{{ site.assetsURL }}/drafts/wave_propagation.png" width="800"/>
<!-- {: .alert .alert-info} -->
<!-- add mic input? -->

Early implementation sketch: 
<iframe style="border-width:0px" width="100%" height="290" src="{{ site.sketchesURL }}/melody/2_melody_6/index.html"></iframe>

Each molecule moves back and forth a certain number of times per second. The measure of how many cycles the sound wave completes per second is called Frequency, and is measured in Hz. The higher a tone's frequency, the higher we perceive its pitch to be. 

Three sketches side-by-side: low pitch (with sinewave drawing + frequency label); medium pitch (same); high pitch (same). Click and hold to play each.
{: .alert .alert-info}

Drag the slider below, and note the change in the frequency as you do so. The slider covers the range of frequencies humans are able to hear, which is somewhere between 20 and 20.000 Hz. 

<iframe style="border-width:0px" width="100%" height="200" src="{{ site.sketchesURL }}/melody/2_melody_1/index.html"></iframe>

### Code Tutorial Section
Code tutorial sections will have running sketches with asides like this: 

<!-- add mic input? -->
{% highlight javascript %}
  osc = new Tone.Oscillator(freq, "sine");
  osc.frequency.value = 100 //update this value based on the position of the reader's slider
{% endhighlight %}

See the Straight Lines section <a href="https://programmingdesignsystems.com/shape/custom-shapes/index.html#custom-shapes-pANLh0l">here</a> as a reference.
{: .alert .alert-info}

#### Exercise section.
This is a description of an exercise.

## Notes and Scales

A line might not be the best representation for pitches as we perceive them. On the sketch above, listen to these two tones: 100 and 200Hz (ADD INPUT BOX). You will probably perceive them as being more similar than, say, 100 and 120Hz. In spite the fact that 110 is a lot closer to 100Hz, we perceive 200Hz as being much more similar to it - it feels like it is the same, but higher.

A helix might be a better representation of the audio frequency range as we perceive it. On the sketch below, start with the lowest pitch, drag a full cycle up (until you get to the same color), and then another. Do you get a feeling of arrival when you get to the same color again? Now using the input field, input 100Hz, 200Hz, 400Hz, 800Hz. Do these all feel similar? If we multiply a frequency by 2 we perceive the pitch to be higher, but of the same class. This pitch class is called chroma. On the sketch below, it's represented by color.
<iframe style="border-width:0px" width="100%" height="450" src="{{ site.sketchesURL }}/melody/2_melody_2/index.html"></iframe>

Alternative interactive: Click or press mouse down to hear/see tone spiralling up.
<iframe style="border-width:0px" width="100%" height="450" src="{{ site.sketchesURL }}/melody/2_melody_glide_up_mouseIsPressed/index.html"></iframe>

Now that we have our possible pitches and a way to represent them, let's create a melody by picking random pitches.
