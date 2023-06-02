export class Fx {
    constructor({ delay, begin, end, x_start, x_end, time, fx, func, fps, enable, style, onStop }) {
      if (fx) {
        this.x_start = x_start * 1.0
        this.x_end = x_end * 1.0
        this.fx = fx
        this.speed = (x_end - x_start) / (time * fps)
      }
      else {
        this.begin = begin
        this.end = end
        this.fps = fps
        this.time = time
        switch (style) {
          case Fx.Styles.LINEAR:
            this.fx = x => fx_inside.LINEAR(x, begin, end, fps * time)
            this.x_start = 0
            this.x_end = fps * time
            this.speed = 1
            break;
          case Fx.Styles.EASE_IN_OUT_QUAD:
            this.fx = x => fx_inside.EASE_IN_OUT_QUAD(x, begin, end, fps * time)
            this.x_start = 0
            this.x_end = fps * time
            this.speed = 1
            break;
          case Fx.Styles.EASE_IN_QUAD:
            this.fx = x => fx_inside.EASE_IN_QUAD(x, begin, end, this.fps * this.time)
            this.x_start = 0
            this.x_end = fps * time
            this.speed = 1
            break;
          case Fx.Styles.EASE_OUT_QUAD:
            this.fx = x => fx_inside.EASE_OUT_QUAD(x, begin, end, fps * time)
            this.x_start = 0
            this.x_end = fps * time
            this.speed = 1
            break;
        }
      }
      this.per_clock = 1000 / fps
      this.delay = delay
      this.func = func
      this.x_now = this.x_start
      this.onStop = onStop
      if (enable == undefined) {
        this.enable = true
      }
      else {
        this.enable = enable
      }
      this.timer = null
  
      this.setEnable(this.enable)
    }
    restart() {
      this.x_now = this.x_start
      this.setEnable(false)
      this.setEnable(true)
    }
    setEnable(enable) {
      if (enable) {
        this.registerTimer()
      }
      else {
        if (this.timer) {
          timer.stopTimer(this.timer)
          this.timer = null
        }
      }
    }
    registerTimer() {
      this.timer = timer.createTimer(
        this.delay ? this.delay : 0,
        this.per_clock,
        (option) => {
  
          this.func(this.fx(this.x_now += this.speed))
          if (this.x_now > this.x_end) {
            this.func(this.fx(this.x_end))
            if (this.onStop != undefined) { this.onStop() }
            timer.stopTimer(this.timer)
            this.timer = null
            this.enable = false
          }
        },
        {}
      )
    }
    static getMixColor(color0, color1, percentage) {
      let r0 = color0 & 0xFF0000, g0 = color0 & 0x00FF00, b0 = color0 & 0x0000FF
      let r1 = color1 & 0xFF0000, g1 = color1 & 0x00FF00, b1 = color1 & 0x0000FF
      return (Math.floor((r1 - r0) * percentage + r0) & 0xFF0000)
        + (Math.floor((g1 - g0) * percentage + g0) & 0x00FF00)
        + (Math.floor((b1 - b0) * percentage + b0) & 0x0000FF)
    }
    static getMixBorder(border1, border2, percentage) {
      return {
        x: border1.x + (border2.x - border1.x) * percentage,
        y: border1.y + (border2.y - border1.y) * percentage,
        x: border1.w + (border2.w - border1.w) * percentage,
        x: border1.h + (border2.h - border1.h) * percentage,
      }
    }
  }
  Fx.Styles = {
    LINEAR: 0,
    EASE_IN_OUT_QUAD: 1,
    EASE_IN_QUAD: 2,
    EASE_OUT_QUAD: 3
  }
  const fx_inside = {
    LINEAR: function (now_x, begin, end, max_x) {
      return (end - begin) / max_x * now_x + begin
    },
    EASE_IN_OUT_QUAD: function (now_x, begin, end, max_x) {
      let length = end - begin
      if ((now_x /= max_x / 2) < 1) {
        return length / 2 * now_x * now_x + begin
      }
      else {
        return -length / 2 * ((--now_x) * (now_x - 2) - 1) + begin
      }
    },
    EASE_IN_QUAD: function (now_x, begin, end, max_x) {
      return (begin - end) / (max_x * max_x) * (max_x - now_x) * (max_x - now_x) + end
    },
    EASE_OUT_QUAD: function (now_x, begin, end, max_x) {
      return (end - begin) / (max_x * max_x) * now_x * now_x + begin
    },
  }
  