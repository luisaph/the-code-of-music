---

title: Melody

---

# Melody

If rhythm is the element of music that makes us tap our foot and want to dance, melody is what we hum along to, or whistle for days on end.

A melody is a sequence of tones that we, as listeners, perceive as a single entity. One of the things we perceive when we listen to a melody is pitch - how high or low each tone is. Here is one example of a melody:

{% p5 0_3_amplitude %}

There are also slight differences in loudness: some tones are louder, some are softer:

<iframe src="https://editor.p5js.org/luisa_NYU/full/vynz3it3_"></iframe>

Tones also have a duration: some are shorter, some are longer. Let's draw the tones in our melody as they occur over time:

{% p5 melody/melody-2 %}

The drawing suggests that tones can be placed on an underlying grid. On the time axis, the start and duration of tones follows (or breaks) the same kind of time grid we discussed on our Rhythm lesson - we could count them like so: {% inlinebutton sketch2toggleTimeGrid() [Show Time Grid] %}

But what about the pitch axis? There seem to be only three or four pitches in this melody –– are they placed on an underlying perceptual grid as well? {% inlinebutton sketch2togglePitchGrid() [Show Pitch Grid] %}

We will address this question in the next sections, by creating a series of digital instruments and generative melodies.
