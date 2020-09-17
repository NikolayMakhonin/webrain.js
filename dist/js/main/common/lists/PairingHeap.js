"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.merge = merge;
exports.collapse = collapse;
exports.PairingHeap = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Each node is contained in a doubly linked list of
 * siblings and has a pointer to it's first child.  If a node is the
 * first of its siblings, then its prev pointer points to their
 * collective parent.  The last child is marked by a null next pointer.
 */
function lessThanDefault(o1, o2) {
  return o1 < o2;
}
/**
 * A mutable, meldable, two-pass Pairing heap.  Maintains a single multiary tree
 * with no structural constraints other than the standard heap invariant.
 * Handles most operations through cutting and pairwise merging.  Primarily uses
 * iteration for merging rather than the standard recursion methods (due to
 * concerns for stackframe overhead).
 */


var PairingHeap = /*#__PURE__*/function () {
  // ! Memory map to use for node allocation
  // ! The number of items held in the queue
  // ! Pointer to the minimum node in the queue
  function PairingHeap(_ref) {
    var objectPool = _ref.objectPool,
        lessThanFunc = _ref.lessThanFunc;
    (0, _classCallCheck2.default)(this, PairingHeap);
    this._size = 0;
    this._root = null;
    this.merge = merge;
    this.collapse = collapse;
    this._objectPool = objectPool;
    this._lessThanFunc = lessThanFunc || lessThanDefault;
  }
  /**
   * Deletes all nodes, leaving the queue empty.
   */


  (0, _createClass2.default)(PairingHeap, [{
    key: "clear",
    value: function clear() {
      // without put back to the pool
      this._root = null;
      this._size = 0;
    }
    /**
     * Returns the current size of the queue.
     *
     * @return      Size of queue
     */

  }, {
    key: "add",

    /**
     * Takes an item to insert it into the queue and creates a new
     * corresponding node.  Merges the new node with the root of the queue.
     *
     * @param item  Item to insert
     * @return      Pointer to corresponding node
     */
    value: function add(item) {
      var node = this._objectPool != null ? this._objectPool.get() : null;

      if (node == null) {
        node = {
          child: null,
          next: null,
          prev: null,
          item: item
        };
      } else {
        node.item = item;
      }

      this._size++;
      this._root = merge(this._root, node, this._lessThanFunc);
      return node;
    }
    /**
     * Returns the minimum item from the queue without modifying any data.
     *
     * @return      Minimum item
     */

  }, {
    key: "getMin",
    value: function getMin() {
      var _root = this._root;
      return _root == null ? void 0 : _root.item;
    }
    /**
     * Deletes the minimum item from the queue and returns it, restructuring
     * the queue along the way to maintain the heap property.  Relies on the
     * @ref <pq_delete> method to delete the root of the tree.
     *
     * @return      Minimum item, corresponding to item deleted
     */

  }, {
    key: "deleteMin",
    value: function deleteMin() {
      var _root = this._root;
      var result = _root == null ? void 0 : _root.item;
      this.delete(_root);
      return result;
    }
    /**
     * Deletes an arbitrary item from the queue and modifies queue structure
     * to preserve the heap invariant.  Requires that the location of the
     * item's corresponding node is known.  Removes the node from its list
     * of siblings, then merges all its children into a new tree and
     * subsequently merges that tree with the root.
     *
     * @param node  Pointer to node corresponding to the item to delete
     */

  }, {
    key: "delete",
    value: function _delete(node) {
      if (node === this._root) {
        this._root = collapse(node.child, this._lessThanFunc);
      } else {
        if (node.prev.child === node) {
          node.prev.child = node.next;
        } else {
          node.prev.next = node.next;
        }

        if (node.next != null) {
          node.next.prev = node.prev;
        }

        this._root = merge(this._root, collapse(node.child, this._lessThanFunc), this._lessThanFunc);
      }

      node.child = null;
      node.prev = null;
      node.next = null;
      node.item = void 0;

      this._objectPool.release(node);

      this._size--;
    }
    /**
     * If the item in the queue is modified in such a way to decrease the
     * item, then this function will update the queue to preserve queue
     * properties given a pointer to the corresponding node.  Cuts the node
     * from its list of siblings and merges it with the root.
     *
     * @param node      Node to change
     */

  }, {
    key: "decreaseKey",
    value: function decreaseKey(node) {
      if (node === this._root) {
        return;
      }

      if (node.prev.child === node) {
        node.prev.child = node.next;
      } else {
        node.prev.next = node.next;
      }

      if (node.next != null) {
        node.next.prev = node.prev;
      }

      this._root = merge(this._root, node, this._lessThanFunc);
    }
    /**
     * Determines whether the queue is empty, or if it holds some items.
     *
     * @return      True if queue holds nothing, false otherwise
     */

  }, {
    key: "size",
    get: function get() {
      return this._size;
    }
  }, {
    key: "isEmpty",
    get: function get() {
      return this._root == null;
    }
  }]);
  return PairingHeap;
}();
/**
 * Merges two nodes together, making the greater item the child
 * of the other.
 *
 * @param a     First node
 * @param b     Second node
 * @return      Resulting tree root
 */


exports.PairingHeap = PairingHeap;

function merge(a, b, lessThanFunc) {
  var parent;
  var child;

  if (a == null) {
    return b;
  } else if (b == null) {
    return a;
  } else if (a === b) {
    return a;
  }

  if (lessThanFunc(b.item, a.item)) {
    parent = b;
    child = a;
  } else {
    parent = a;
    child = b;
  }

  child.next = parent.child;

  if (parent.child != null) {
    parent.child.prev = child;
  }

  child.prev = parent;
  parent.child = child;
  parent.next = null;
  parent.prev = null;
  return parent;
}
/**
 * Performs an iterative pairwise merging of a list of nodes until a
 * single tree remains.  Implements the two-pass method without using
 * explicit recursion (to prevent stack overflow with large lists).
 * Performs the first pass in place while maintaining only the minimal list
 * structure needed to iterate back through during the second pass.
 *
 * @param node  Head of the list to collapse
 * @return      Root of the collapsed tree
 */


function collapse(node, lessThanFunc) {
  var tail;
  var a;
  var b;
  var next;
  var result;

  if (node == null) {
    return null;
  }

  next = node;
  tail = null;

  while (next != null) {
    a = next;
    b = a.next;

    if (b != null) {
      next = b.next;
      result = merge(a, b, lessThanFunc); // tack the result onto the end of the temporary list

      result.prev = tail;
      tail = result;
    } else {
      a.prev = tail;
      tail = a;
      break;
    }
  }

  result = null;

  while (tail != null) {
    // trace back through to merge the list
    next = tail.prev;
    result = merge(result, tail, lessThanFunc);
    tail = next;
  }

  return result;
}