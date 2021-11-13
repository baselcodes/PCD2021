// const p5Min = require("./p5.min");

console.log('loaded sketch');


// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

const drone = function (s) {

  s.base_freq = 80
  s.detune_mult = 2
  s.drone = new Array(3)
  s.delay,
    s.reverb,
    s.filter,
    s.analyzer,

    s.setup = function () {
      document.body.style['userSelect'] = 'none'
      let h = document.body.clientHeight
      let c = s.createCanvas(s.windowWidth, s.windowHeight)
      c.position(0, 25)
      c.style('pointer-events', 'none')
      c.style('position', 'fixed')
      c.style('z-index', '99999999')
      s.userStartAudio()
      for (let i = 0; i < s.drone.length; i++) {
        s.drone[i] = new p5.Oscillator(s.base_freq + (i * s.detune_mult), 'sawtooth')
      }



      ///~~~ EFFECTS ~~~///
      ///~~~ DISTORTION ~~~///
      s.distortion = new p5.Distortion(0.1, 'none')
      ///~~~ DELAY ~~~///
      s.delay = new p5.Delay()
      s.delay.delayTime(0.65)
      s.delay.feedback(0.35)
      ///~~~ REVERB ~~~///
      s.reverb = new p5.Reverb()
      s.reverb.set(6, 2)
      ///~~~ FILTER ~~~///
      s.filter = new p5.LowPass()
      s.filter.freq(250) // min = 20
      // s.filter.res(0.001) // max 1000
      s.filter.chain(s.distortion, s.delay, s.reverb)

      for (const osc of s.drone) {
        osc.start()
        osc.disconnect()
        osc.connect(s.filter)
        osc.amp(0)
      }
      s.analyzer = new p5.FFT();
    }
  s.draw = function () {
    s.clear()

    let freq = s.map(s.mouseX, 0, s.width, 20, 1000)
    freq = s.constrain(freq, 0, 22050)
    s.filter.freq(freq)

    let distortion_amount = s.map(s.mouseY, 0, s.height, 0.2, 1)
    distortion_amount = s.constrain(distortion_amount, 0.2, 1)
    s.distortion.set(distortion_amount)


    // analyze the waveform
    waveform = s.analyzer.waveform();

    // draw the shape of the waveform
    s.noFill()
    s.stroke(255)
    s.strokeWeight(4)
    s.beginShape()
    for (let i = 0; i < waveform.length; i++) {
      let x = s.map(i, 0, waveform.length, 0, s.width)
      let y = s.map(waveform[i], -1, 1, -s.height / 2, s.height / 2)
      s.vertex(x, y + s.height / 2)
    }
    s.endShape()

  }

  s.percussion = function () {
    // change pitch of the drone with a sweep
    console.log('percussion!')
    s.drone[0].freq(440, 0.02) // increase pitch to 440 Hz in 0.02 s
    s.drone[0].freq(s.base_freq, 0.5, 0.2) // decrease back to base frequency


  }

  s.keyPressed = function () {
    switch (s.key) {
      case ' ':
        console.log('start audio')
        for (const osc of s.drone) {
          osc.amp(0.15, 0.1)
        }

        break;
      case 's':
        console.log('stop audio')

        for (const osc of s.drone) {
          osc.amp(0, 0.1)
        }
        break;
      case 'k':
        console.log('kick')
        s.percussion()
        // s.drone.freq(440, 0.02)
        // s.drone.freq(s.base_freq, 0.5, 0.2)
        break;
    }
  }
}