console.log('loaded sketch');


// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

const drone = function (s) {

  s.base_freq = 55 //A3
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
        // 'sine', 'triangle', 'sawtooth' and 'square'
      }



      ///~~~ EFFECTS ~~~///
      ///~~~ DISTORTION ~~~///
      s.distortion = new p5.Distortion(0.1, 'none')
      ///~~~ DELAY ~~~///
      s.delay = new p5.Delay()
      s.delay.delayTime(0.65)
      s.delay.feedback(0.35) // <== please below 1.0
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

  s.percussion = function (id, data) {
    // change pitch of the drone with a sweep
    console.log(id, data)
    let custom_freq, attack, decay
    switch (id) {
      case 'watchtime':
        console.log('~~~ watchtime ~~~')
        const volume = data['volume']
        let value = volume.split('%2C') // ['55', '55', '55']
        value = value[value.length - 1]

        custom_freq = s.map(value, 0, 100, 330, 1100)

        attack = 0.02
        decay = 0.5

        s.drone[0].freq(custom_freq, attack) // increase pitch to custom_freq Hz in 0.02 s
        s.drone[0].freq(s.base_freq, decay, attack) // decrease back to base frequency

        s.drone[1].freq(custom_freq, attack) // increase pitch to custom_freq Hz in 0.02 s
        s.drone[1].freq(s.base_freq, decay, attack) // decrease back to base frequency

        break;

      case 'qoe':

        custom_freq = 1100

        attack = 1
        decay = 0.75

        s.drone[0].freq(custom_freq, attack) // increase pitch to custom_freq Hz in 0.02 s
        s.drone[0].freq(s.base_freq, decay, attack) // decrease back to base frequency

        s.drone[1].freq(custom_freq, attack) // increase pitch to custom_freq Hz in 0.02 s
        s.drone[1].freq(s.base_freq, decay, attack) // decrease back to base frequency

        break;

      case 'log-event':
        custom_freq = 1100

        attack = 0.02
        decay = 0.5

        s.drone[0].freq(custom_freq, attack) // increase pitch to custom_freq Hz in 0.02 s
        s.drone[0].freq(s.base_freq, decay, attack) // decrease back to base frequency

        s.drone[1].freq(custom_freq, attack) // increase pitch to custom_freq Hz in 0.02 s
        s.drone[1].freq(s.base_freq, decay, attack) // decrease back to base frequency
        break;
    }
    // attack = 0.02
    // decay = 0.2
    // s.drone[0].freq(880, attack) // increase pitch to 880 Hz in 0.02 s
    // s.drone[0].freq(s.base_freq, decay, attack) // decrease back to base frequency


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