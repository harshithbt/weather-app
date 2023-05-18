export class imgLoader {
    constructor(DEVICE_WIDTH, DEVICE_HEIGHT) {
        this.DEVICE_WIDTH = DEVICE_WIDTH
        this.DEVICE_HEIGHT = DEVICE_HEIGHT
        this.loader = hmUI.createWidget(hmUI.widget.IMG_ANIM, {
            anim_path: 'anim',
            anim_prefix: 'animation',
            anim_ext: 'png',
            anim_fps: 8,
            anim_size: 8,
            repeat_count: 0,
            anim_status: 0,
            x: (this.DEVICE_WIDTH - 127) / 2,
            y: (this.DEVICE_HEIGHT - 127) / 2,
            anim_complete_call: () => {
                console.log('animation complete')
            }
        })
    }
}