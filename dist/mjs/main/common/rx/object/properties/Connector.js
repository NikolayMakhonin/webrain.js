import { ObservableClass } from '../ObservableClass';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
export class Connector extends ObservableClass {
  constructor(connectorSource) {
    super();
    this.connectorSource = connectorSource;
  }

}
new ObservableObjectBuilder(Connector.prototype).writable('connectorSource', {
  hidden: true
});