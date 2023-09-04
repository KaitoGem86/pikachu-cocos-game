import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

interface EventListener {
    evt: Event;
    onNotify(evt: Event);
}

@ccclass('EventManager')
export class EventManager extends Component {

    start() {
    }

    update(deltaTime: number) {

    }
}


