import { Group } from 'three';
import SceneManager from '..';

export default class ObjectGroup extends Group {
  public smc: SceneManager;

  constructor() {
    super();
    this.smc = SceneManager.getInstance();
  }
}