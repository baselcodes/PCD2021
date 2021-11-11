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


    s.drone[0].freq(440, 0.02)
    s.drone[0].freq(s.base_freq, 0.5, 0.2)


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

//   sketch.carrier; // this is the oscillator we will hear
//   sketch.modulator; // this oscillator will modulate the frequency of the sketch.carrier

//   sketch.analyzer; // we'll use this visualize the waveform

//   // the sketch.carrier frequency pre-modulation
//   sketch.carrierBaseFreq = 80;

//   // min/max ranges for sketch.modulator
//   sketch.modMaxFreq = 200;
//   sketch.modMinFreq = 0;
//   sketch.modMaxDepth = 150;
//   sketch.modMinDepth = -150;

//   sketch.env_1
//   sketch.env_2
//   sketch.setup = function () {
//     console.log('setup');
//     document.body.style['userSelect'] = 'none'
//     let h = document.body.clientHeight
//     let c = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight)
//     c.position(0, 25)
//     c.style('pointer-events', 'none')
//     c.style('position', 'fixed')
//     c.style('z-index', '99999999')
//     sketch.noFill();

//     sketch.env_1 = new p5.Envelope(0.01, 0.5)
//     sketch.env_2 = new p5.Envelope(0.001, 0.7)

//     sketch.carrier = new p5.Oscillator('sine');
//     // sketch.carrier.amp(0); // set amplitude
//     sketch.carrier.freq(sketch.carrierBaseFreq); // set frequency
//     // sketch.carrier.start(); // start oscillating

//     // try changing the type to 'square', 'sine' or 'triangle'
//     sketch.modulator = new p5.Oscillator('sawtooth');
//     sketch.modulator.start();

//     // add the sketch.modulator's output to modulate the sketch.carrier's frequency
//     sketch.modulator.disconnect();
//     sketch.carrier.freq(sketch.modulator);
//     sketch.modulator.amp(sketch.modMaxDepth)

//     // create an FFT to analyze the audio
//     sketch.analyzer = new p5.FFT();

//     // fade sketch.carrier in/out on mouseover / touch start
//     // toggleAudio(cnv);
//   }

//   sketch.draw = function () {
//     sketch.clear()

//     // map mouseY to sketch.modulator freq between a maximum and minimum frequency
//     let modFreq = sketch.map(sketch.mouseY, sketch.height, 0, sketch.modMinFreq, sketch.modMaxFreq);
//     // sketch.modulator.freq(modFreq);

//     // change the amplitude of the sketch.modulator
//     // negative amp reverses the sawtooth waveform, and sounds percussive
//     //
//     let modDepth = sketch.map(sketch.mouseX, 0, sketch.width, sketch.modMinDepth, sketch.modMaxDepth);
//     // sketch.modulator.amp(modDepth);

//     // analyze the waveform
//     waveform = sketch.analyzer.waveform();

//     // draw the shape of the waveform
//     sketch.stroke(255);
//     sketch.strokeWeight(10);
//     sketch.beginShape();
//     for (let i = 0; i < waveform.length; i++) {
//       let x = sketch.map(i, 0, waveform.length, 0, sketch.width);
//       let y = sketch.map(waveform[i], -1, 1, -sketch.height / 2, sketch.height / 2);
//       sketch.vertex(x, y + sketch.height / 2);
//     }
//     sketch.endShape();

//     sketch.strokeWeight(1);
//     // add a note about what's happening
//     sketch.text('Modulator Frequency: ' + modFreq.toFixed(3) + ' Hz', 20, 20);
//     sketch.text(
//       'Modulator Amplitude (Modulation Depth): ' + modDepth.toFixed(3),
//       20,
//       40
//     );
//     sketch.text(
//       'Carrier Frequency (pre-modulation): ' + sketch.carrierBaseFreq + ' Hz',
//       sketch.width / 2,
//       20
//     );
//   }

//   sketch.keyPressed = function () {
//     console.log(sketch.key);
//     switch (sketch.key) {
//       case ' ':
//         // toggleAudio()
//         console.log('nothing');
//         break;
//       case 't':
//         console.log('pressed t');
//         sketch.carrier.start()
//         sketch.modulator.freq(sketch.env_2)
//         sketch.env_2.play()
//         sketch.carrier.freq(sketch.env_1)
//         sketch.env_1.play(sketch.carrier)
//         break;
//     }
//   }

//   // let start_stop = true
//   // // helper function to toggle sound
//   // function toggleAudio() {
//   //   if (start_stop) {
//   //     sketch.carrier.amp(0)
//   //     start_stop = !start_stop
//   //   } else {
//   //     sketch.carrier.amp(0.5)
//   //     start_stop = !start_stop
//   //   }
//   //   // cnv.mouseOver(function () {
//   //   //   sketch.carrier.amp(1.0, 0.01);
//   //   // });
//   //   // cnv.touchStarted(function () {
//   //   //   sketch.carrier.amp(1.0, 0.01);
//   //   // });
//   //   // cnv.mouseOut(function () {
//   //   //   sketch.carrier.amp(0.0, 1.0);
//   //   // });
//   // }
// }