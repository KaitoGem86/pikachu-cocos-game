import { _decorator, Component, Node, SpriteFrame, PostProcessStage } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpriteData')
export class SpriteData extends Component {

    @property({
        type: [SpriteFrame],
        visible: true,
        serializable: true,
    })
    public data : SpriteFrame[] = [];

    public notify(): void {
        console.log(this.data.length);
    }
}


