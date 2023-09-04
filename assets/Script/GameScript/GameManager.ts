import { _decorator, Component, Node, Game, serializeTag, RichText, Input, macro, input, EventKeyboard, KeyCode, sys, UI } from 'cc';
import { HintComponent } from './HintComponent';
import { MainPanelSetUp } from './MainPanelSetUp';
import { RearrangeComponent } from './RearrangeComponent';
import { SelectPieceSolution } from './SelectPieceSolution';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    private static instance: GameManager;

    public static get Instance(): GameManager {
        return this.instance;
    }

    public onLoad() {
        GameManager.instance = this;
    }

    constructor() {
        super();
    }

    @property(MainPanelSetUp) private mainPanel: MainPanelSetUp = new MainPanelSetUp();
    @property(HintComponent) public hint: HintComponent = new HintComponent();
    @property(RearrangeComponent) public rearrange: RearrangeComponent = new RearrangeComponent();

    public rearrange_numbers: number;
    public hint_numbers: number;
    public count_pool: number;
    public point: number = 0;
    public isWinGame: boolean = false;



    start() {
        //console.log(this.mainPanel.name);
    }

    update() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    public get MainPanel(): MainPanelSetUp {
        return this.mainPanel
    }

    onKeyDown(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                console.log(this.mainPanel.column + " " + this.mainPanel.row);
                for (let i = 0; i < this.mainPanel.column; i++) {
                    for (let j = 0; j < this.mainPanel.row; j++) {
                        if (i == 0 || j == 0 || i == this.mainPanel.column - 1 || j == this.mainPanel.row - 1) {
                            SelectPieceSolution.Instance.canMoveThroughMatrix[i][j] = true;
                            continue;
                        }
                        console.log(i + " " + j);
                        console.log(SelectPieceSolution.Instance.piecesPool[i][j].name);
                        SelectPieceSolution.Instance.piecesPool[i][j].node.active = false;
                        SelectPieceSolution.Instance.canMoveThroughMatrix[i][j] = true;
                    }
                    this.count_pool = 0;
                }

                UIManager.Instance.win_game();

                console.log("Win Game");
                break;
            case KeyCode.KEY_N:
                SelectPieceSolution.Instance.update_levelType();
                console.log(SelectPieceSolution.Instance.levelType);
                break;
            case KeyCode.KEY_L:
                GameManager.Instance.game_over();
                break;
        }
    }

    public replay_game(): void {
        this.mainPanel.reinitialize_nodes_pool();
        this.mainPanel.initialize_sprite_data();
        GameManager.Instance.point = 0;
        GameManager.Instance.rearrange_numbers = 5;
        GameManager.Instance.hint_numbers = 3;
        UIManager.Instance.setText(GameManager.Instance.point);
        UIManager.Instance.rearrange_node.set_rearrange_number(GameManager.Instance.rearrange_numbers);
        UIManager.Instance.hint_node.set_hint_numbers(GameManager.Instance.hint_numbers);
        SelectPieceSolution.Instance.reset_leveltype();
    }

    public win_game(): void {
        this.isWinGame = true;
        this.mainPanel.reinitialize_nodes_pool();
        this.mainPanel.initialize_sprite_data();
        SelectPieceSolution.Instance.update_levelType();
        //console.log("win Game");
    }

    public check_game_over() {
        if (this.hint.CheckCantMoveMoreOver() && !this.isWinGame) {
            // UIManager.Instance.CantMoveNotify(/*() => {
            //     if (GameManager.Instance.rearrange.can_rearrange()) {
            //         GameManager.Instance.rearrange.rearrange();
            //     }
            //     else {
            //         GameManager.Instance.game_over();
            //     }
            // }*/);
            UIManager.Instance.cantMoveNotify.node.active = true;
        }
    }

    public game_over(): void {
        //console.log("Game Over");

        let highest = Number.parseInt(sys.localStorage.getItem("Highest Score"));
        if (highest < GameManager.Instance.point) {
            highest = GameManager.Instance.point;
        }
        sys.localStorage.setItem("Highest Score", highest.toString());
        //console.log(sys.localStorage.getItem("Highest Score"));
        UIManager.Instance.game_over(highest);
    }
}
