import { Group } from 'three';
import SceneManager from '..';

export default class ObjectGroup extends Group {
  public scm: SceneManager;

  constructor() {
    super();
    this.scm = SceneManager.getInstance();
  }
}