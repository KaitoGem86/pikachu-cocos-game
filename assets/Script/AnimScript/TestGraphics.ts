import { _decorator, Component, Node, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TestGraphics')
export class TestGraphics extends Component {
    
    
    i: number = 0;
    g: Graphics = null;
    node = new Node();
    graphics: Graphics = null;
    
    start() {
        const ctx = this.node.getComponent(Graphics);
        ctx.moveTo(20,100);
        ctx.lineTo(20,20);
        ctx.lineTo(70,20);
        ctx.stroke();

    }

    update(deltaTime: number) {
        
    }
}


