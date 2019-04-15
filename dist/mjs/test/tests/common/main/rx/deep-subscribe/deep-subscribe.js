import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { ObservableMap } from '../../../../../../main/common/lists/ObservableMap';
import { ObservableSet } from '../../../../../../main/common/lists/ObservableSet';
import { SortedList } from '../../../../../../main/common/lists/SortedList';
import { deepSubscribe } from '../../../../../../main/common/rx/deep-subscribe/deep-subscribe';
import { ObservableObject } from '../../../../../../main/common/rx/object/ObservableObject';
import { ObservableObjectBuilder } from '../../../../../../main/common/rx/object/ObservableObjectBuilder';
describe('common > main > rx > deep-subscribe > deep-subscribe', function () {
  function createObject() {
    var object = {};
    var list = new SortedList(); // @ts-ignore

    Object.defineProperty(list, 'listChanged', {
      configurable: true,
      writable: true,
      value: null
    });
    var set = new Set();
    var map = new Map();
    var observableObject = new ObservableObject();
    var observableList = new SortedList();
    var observableSet = new ObservableSet();
    var observableMap = new ObservableMap();
    Object.assign(object, {
      observableObject: observableObject,
      observableList: observableList,
      observableSet: observableSet,
      observableMap: observableMap,
      object: object,
      list: list,
      set: set,
      map: map
    });
    var observableObjectBuilder = new ObservableObjectBuilder(observableObject);
    Object.keys(object).forEach(function (key) {
      list.add(object[key]);
      set.add(object[key]);
      map.set(key, object[key]);
      observableObjectBuilder.writable(key, null, object[key]);
      observableList.add(object[key]);
      observableSet.add(object[key]);
      observableMap.set(key, object[key]);
    });
    return object;
  }

  var Tester =
  /*#__PURE__*/
  function () {
    function Tester(obj, immediate, ruleBuilder) {
      _classCallCheck(this, Tester);

      this._subscribed = [];
      this._unsubscribed = [];
      this._object = obj;
      this._immediate = immediate;
      this._ruleBuilder = ruleBuilder;
    }

    _createClass(Tester, [{
      key: "subscribe",
      value: function subscribe(expectedSubscribed) {
        var _this = this;

        assert.ok(this._unsubscribe == null);
        assert.deepStrictEqual(this._subscribed, []);
        assert.deepStrictEqual(this._unsubscribed, []);
        this._unsubscribe = deepSubscribe(this._object, function (value) {
          _this._subscribed.push(value);

          return function () {
            _this._unsubscribed.push(value);
          };
        }, this._immediate, this._ruleBuilder);
        assert.deepStrictEqual(this._unsubscribed, []);

        if (!expectedSubscribed) {
          assert.strictEqual(this._unsubscribe, null);
          assert.deepStrictEqual(this._subscribed, []);
        } else {
          assert.deepStrictEqual(this._subscribed, expectedSubscribed);
          this._subscribed = [];
        }
      }
    }, {
      key: "change",
      value: function change(expectedUnsubscribed, expectedSubscribed, changeFunc) {
        assert.deepStrictEqual(this._subscribed, []);
        assert.deepStrictEqual(this._unsubscribed, []);
        changeFunc(this._object);
        assert.deepStrictEqual(this._unsubscribed, expectedUnsubscribed);
        assert.deepStrictEqual(this._subscribed, expectedSubscribed);
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(expectedUnsubscribed) {
        assert.ok(this._unsubscribe);
        assert.deepStrictEqual(this._subscribed, []);
        assert.deepStrictEqual(this._unsubscribed, []);

        this._unsubscribe();

        assert.deepStrictEqual(this._unsubscribed, expectedUnsubscribed);
        assert.deepStrictEqual(this._subscribed, []);
      }
    }]);

    return Tester;
  }();

  it('object', function () {
    var tester = new Tester(createObject().object, false, function (b) {
      return b.path(function (o) {
        return o.object;
      });
    });
    tester.subscribe(null);
    tester.change([], [], function (object) {
      object.object = null;
    });
  });
});