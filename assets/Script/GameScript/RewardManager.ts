import { _decorator, Component, Node, randomRangeInt } from 'cc';
import { GameManager } from './GameManager';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

enum RewardType{
    Point,
    Rearrange,
    Hint
}

@ccclass('RewardManager')
export class RewardManager extends Component {
    private static instance: RewardManager;

    public static get Instance(): RewardManager{
        if(!this.instance){
            this.instance = new RewardManager();
            console.log("new Instance");
        }
        return this.instance;
    }
    
    public rewardType: RewardType;

    onload() {
        RewardManager.instance = this;
    }

    public define_reward(): RewardType {
        let i = randomRangeInt(0,3);
        switch(i){
            case 0:
                this.rewardType = RewardType.Point;
                break;
            case 1:
                this.rewardType = RewardType.Rearrange;
                break;
            case 3: 
                this.rewardType = RewardType.Hint;
                break;
        }
        return this.rewardType;
    }

    public receive_reward(rewardType: RewardType): void {
        switch(rewardType){
            case RewardType.Point:
                this.receive_reward_point();
                break;
            case RewardType.Rearrange:
                this.receive_reward_rearrange();
                break;
            case RewardType.Hint:
                this.receive_reward_hint();
                break;
        }
    }

    receive_reward_point(){
        //console.log('point');
        GameManager.Instance.point += 500;
        UIManager.Instance.setText(GameManager.Instance.point);
    }

    receive_reward_rearrange(){
        //console.log('rearrange');
        GameManager.Instance.rearrange_numbers += 1;
        UIManager.Instance.rearrange_node.set_rearrange_number(GameManager.Instance.rearrange_numbers);
    }

    receive_reward_hint(){
        GameManager.Instance.hint_numbers += 1;
        UIManager.Instance.hint_node.set_hint_numbers(GameManager.Instance.hint_numbers);
    }
}


