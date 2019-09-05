import { ObservableObject } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
export class Connector extends ObservableObject {
  constructor(connectorSource) {
    super();
    this.connectorSource = connectorSource;
  }

}
new ObservableObjectBuilder(Connector.prototype).writable('connectorSource', {
  hidden: true
});