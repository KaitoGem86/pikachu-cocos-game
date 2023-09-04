import { _decorator, Component, Node, RichText, Vec3, tween, sys, Line, Graphics, UITransform, Game, Sprite, color, Color } from 'cc';
import { GameManager } from './GameManager';
import { HintComponent } from './HintComponent';
import { RearrangeComponent } from './RearrangeComponent';
import { ReceiveReward } from './ReceiveReward';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    private static instance: UIManager;

    public static get Instance(): UIManager {
        return this.instance;
    }

    constructor() {
        super();
    }

    @property(RearrangeComponent) rearrange_node: RearrangeComponent = new RearrangeComponent();
    @property(Sprite) cantMoveNotify: Sprite = new Sprite();
    @property(HintComponent) hint_node: HintComponent = new HintComponent();
    @property(Node) pointText: Node = new Node();
    @property(ReceiveReward) chest: ReceiveReward = new ReceiveReward();
    @property(Node) gameOver: Node = new Node();
    @property(RichText) highestScroe: RichText = new RichText();
    @property(Graphics) lineRender: Graphics = new Graphics();

    onLoad() {
        UIManager.instance = this;
        const uiTransform = UIManager.Instance.getComponent(UITransform);
        uiTransform.setContentSize(1920, 1080);
    }

    start() {
        console.log(UIManager.Instance.rearrange_node.name);
        GameManager.Instance.rearrange_numbers = 5;
        GameManager.Instance.hint_numbers = 3;
        this.rearrange_node.set_rearrange_number(GameManager.Instance.rearrange_numbers);
        this.hint_node.set_hint_numbers(GameManager.Instance.hint_numbers);
    }

    public setText(point: number): void {
        //console.log("Update Point");
        this.pointText.getComponent(RichText).string = "<color=#00ff00>Point:</color><color=#0fffff>" + point + "</color>";
    }

    public win_game(): void {
        this.chest.node.active = true;
    }

    public game_over(highest: number): void {
        this.highestScroe.string = "<color=#00ff00>Highes Score: </color><color=#0fffff>" + highest + "</color>"
        this.gameOver.active = true;
    }

    public CantMoveNotify(/*callback: any*/): void {
        console.log("hehe");
        this.cantMoveNotify.node.active = true;
        let c = this.cantMoveNotify.color;
        c = new Color(c.r, c.g, c.b, 0);
        this.cantMoveNotify.color = c;
        c = new Color(c.r, c.g, c.b, 255);
        tween(this.cantMoveNotify.color)
            .to(0.5, c, {
                onUpdate: (target: Color) => {
                    this.cantMoveNotify.color = target;
                },
            })
            .start();
    }

}


