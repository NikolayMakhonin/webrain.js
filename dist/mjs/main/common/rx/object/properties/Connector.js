import { ObservableClass } from '../ObservableClass';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
export class ConnectorState extends ObservableClass {}
new ObservableObjectBuilder(ConnectorState.prototype).writable('source');
export class Connector extends ObservableClass {
  constructor(source, name) {
    super();
    this.connectorState.name = name;
    this.connectorState.source = source;
  }

}
new ObservableObjectBuilder(Connector.prototype).readable('connectorState', {
  hidden: true,

  factory() {
    return new ConnectorState();
  }

});