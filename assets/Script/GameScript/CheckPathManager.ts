import { _decorator, Component, Node, pingPong, path, find, TiledMap, UI, Vec3, tween, Color, UICoordinateTracker, TiledObjectGroup } from 'cc';
import { GameManager } from './GameManager';
import { PieceController } from './PieceController';
import { SelectPieceSolution } from './SelectPieceSolution';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('CheckPathManager')
export class CheckPathManager extends Component {

    private static instance: CheckPathManager;

    public static get Instance(): CheckPathManager {
        if (!this.instance)
            this.instance = new CheckPathManager();
        return this.instance;
    }


    onLoad() {
        if (!CheckPathManager.instance)
            CheckPathManager.instance = new CheckPathManager();
        CheckPathManager.instance = this;
        console.log(CheckPathManager.instance.name);
    }

    row: number;
    column: number;
    count: number = 3;
    path: { x: number, y: number }[] = [];
    bfs_queue: PieceController[] = [];
    vertexs: PieceController[] = [];
    pars: PieceController[][][];
    visited: boolean[][];
    isFind: boolean = false;


    CheckPath(p1: { x: number, y: number }, p2?: { x: number, y: number }, p3?: { x: number, y: number }): boolean {
        if (p2 === undefined || p3 === undefined) {
            return true;
        }
        if ((p1.x - p2.x) * (p2.x - p3.x) + (p1.y - p2.y) * (p2.y - p3.y) == 0) {
            return false;
        }
        if ((p1.x === p3.x) && (p1.y === p3.y)) {
            return false;
        }
        return true;
    }

    CheckPathContain(p1: { x: number, y: number }): boolean {
        for (const iterator of this.path) {
            if (iterator.x === p1.x && iterator.y === p1.y) {
                return true;
            }
        }
        return false;
    }

    CheckContain(piece: PieceController): boolean {
        for (const element of this.vertexs) {
            if (element.pos.x === piece.pos.x && element.pos.y === piece.pos.y) {
                console.log("true");
                return true;
            }
        }
        return false;
    }

    /**
     * FindPathBetween2Node
     */
    public CheckPathBetween2Node(point1: PieceController, point2: PieceController, check?: boolean): boolean {
        this.path = new Array();
        this.row = GameManager.Instance.MainPanel.row;
        this.column = GameManager.Instance.MainPanel.column;
        this.pars = new Array(this.column);
        this.visited = new Array(this.column);
        for (let i = 0; i < this.column; i++) {
            this.pars[i] = new Array(this.row);
            this.visited[i] = new Array(this.row);
            for (let j = 0; j < this.row; j++) {
                this.pars[i][j] = new Array();
                this.visited[i][j] = false;
            }
        }

        this.bfs(point1, point2);

        if (this.CheckContain(point2)) {
            this.trace_back(point1, point2);
        }
        else {
            this.visited = null;
            this.pars = null;
            this.bfs_queue = new Array();
            this.vertexs = new Array();
            console.log("no path 1 ");
            return false
        };

        this.count = 3;


        if (this.CheckPathContain({ x: point1.pos.x, y: point1.pos.y })) {
            if (check == undefined) {
                UIManager.Instance.lineRender.clear();
                let oldPos = new Vec3(point2.pos.x * 64 - GameManager.Instance.MainPanel.offSetX + point2.pos.x - 1, point2.pos.y * 64 - GameManager.Instance.MainPanel.offSetX / 2 + point2.pos.y - 1);
                UIManager.Instance.lineRender.moveTo(oldPos.x, oldPos.y);
                for (const iterator of this.path) {
                    UIManager.Instance.lineRender.lineTo(iterator.x * 64 - GameManager.Instance.MainPanel.offSetX + iterator.x - 1, iterator.y * 64 - GameManager.Instance.MainPanel.offSetX / 2 + iterator.y - 1);
                }
                UIManager.Instance.lineRender.stroke();
                tween(GameManager.Instance.MainPanel.node.scale)
                    .delay(0.3)
                    .to(0, Vec3.ONE, {
                        onComplete: () => {
                            UIManager.Instance.lineRender.clear();
                        }
                    })
                    .start();
            }
            this.isFind = false;
            this.visited = null;
            this.pars = null;
            this.path = null;
            this.bfs_queue = new Array();
            this.vertexs = new Array();
            return true;
        }
        else {
            console.log("no path 2");
            this.visited = null;
            this.pars = null;
            this.bfs_queue = new Array();
            this.vertexs = new Array();
            return false
        }

    }

    bfs(p1: PieceController, p2: PieceController) {

        this.bfs_queue.push(p1);
        this.vertexs.push(p1);

        this.visited[p1.pos.x][p1.pos.y] = true;

        while (this.bfs_queue.length != 0 && this.bfs_queue[0] != null) {

            let top = this.bfs_queue[0];
            this.bfs_queue.shift();

            if (SelectPieceSolution.Instance.canMoveThroughMatrix[top.pos.x][top.pos.y] || top.pos.x == p2.pos.x && top.pos.y == p2.pos.y) {
                this.vertexs.push(top);
            }
            top.neighbors.forEach(element => {

                if (SelectPieceSolution.Instance.canMoveThroughMatrix[element.x][element.y] || element.x == p2.pos.x && element.y == p2.pos.y) {
                    if (!this.visited[element.x][element.y]) {
                        this.visited[element.x][element.y] = true;
                        this.bfs_queue.push(SelectPieceSolution.Instance.piecesPool[element.x][element.y]);
                    }
                    if (this.pars[element.x][element.y] == null) {
                        this.pars[element.x][element.y] = new Array();
                    }
                    this.pars[element.x][element.y].push(top);
                }
            })
        }
    }

    trace_back(p1: PieceController, p2: PieceController) {
        let tmp: PieceController = p2;

        if ((tmp.pos.x != p1.pos.x || tmp.pos.y != p1.pos.y) && (this.pars[tmp.pos.x][tmp.pos.y] != null)) {
            this.path.push({ x: tmp.pos.x, y: tmp.pos.y });
            for (let i = 0; i < this.pars[tmp.pos.x][tmp.pos.y].length; i++) {
                if (this.isFind) {
                    break;
                }
                let j = this.path.length;
                let check = false;
                switch (j) {
                    case 0:
                        if (!this.CheckPath({ x: tmp.pos.x, y: tmp.pos.y })) {
                            this.count -= 1;
                            check = true;
                        }
                        break;
                    case 1:
                        if (this.CheckPath({ x: this.pars[tmp.pos.x][tmp.pos.y][i].pos.x, y: this.pars[tmp.pos.x][tmp.pos.y][i].pos.y },
                            { x: this.path[j - 1].x, y: this.path[j - 1].y })) {
                            this.count -= 1;
                            check = true;
                        }
                        break;
                    default:
                        if ((this.pars[tmp.pos.x][tmp.pos.y][i].pos.x === this.path[j - 2].x) && (this.pars[tmp.pos.x][tmp.pos.y][i].pos.y === this.path[j - 2].y)) {
                            continue;
                        }
                        if (!this.CheckPath({ x: this.pars[tmp.pos.x][tmp.pos.y][i].pos.x, y: this.pars[tmp.pos.x][tmp.pos.y][i].pos.y },
                            { x: this.path[j - 1].x, y: this.path[j - 1].y },
                            { x: this.path[j - 2].x, y: this.path[j - 2].y })) {
                            this.count -= 1;
                            check = true;
                        }
                        break;
                }

                if (this.count >= 0) {
                    this.trace_back(p1, this.pars[tmp.pos.x][tmp.pos.y][i]);
                    if (this.CheckPathContain({ x: p1.pos.x, y: p1.pos.y }))
                        return;
                    if (check) {
                        this.count += 1;
                    }
                    this.path.pop();
                }
                else {
                    if (check) {
                        this.count += 1;
                    }
                }

            }
        }
        else {
            this.path.push({ x: p1.pos.x, y: p1.pos.y });
            this.isFind = true;
            return;
        }
    }
}