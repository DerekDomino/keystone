/**
 * Created by vboucher on 11/07/14.
 */

// TODO: should better have an ArrayItem deriving from List instead of mocking set/get

/**
 * MockItem Class
 *  Mocking set() and get() methods of item instance of List
 *  To be used/injected in Field.updateItem(item, data)
 *
 * @param {String} key
 * @param {Object} options
 * @api public
 */

function MockItem(subdocument){
    if (!(this instanceof MockItem)) return new MockItem(subdocument);

    // Reference to subdocument
    this.subdocument = subdocument;

}


/**
 * Sets MockItem options
 *
 * ####Example:
 *
 *     item.set('test', value) // sets the 'test' option to `value`
 *
 * @param {String} key
 * @param {String} value
 * @api public
 */

MockItem.prototype.set = function(key, value) {
    if (arguments.length === 1) {
        return this.subdocument[key];
    }
    this.subdocument[key] = value;
    return value;
};


/**
 * Gets MockItem options
 *
 * ####Example:
 *
 *     item.get('test') // returns the 'test' value
 *
 * @param {String} key
 * @method get
 * @api public
 */

MockItem.prototype.get = MockItem.prototype.set;


/*!
 * Export class
 */

exports = module.exports = MockItem;
