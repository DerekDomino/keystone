/**
 * Created by vboucher on 03/07/14.
 */

/*!
 * Module dependencies.
 */

var util = require('util'),
    keystone = require('../../'),
//    utils = require('keystone-utils'),
    super_ = require('../field');

/**
 * Array FieldType Constructor
 * @extends Field
 * @api public
 *
 *  Example (verbose):
 *   var subdocItem = keystone.List('subdocItem');
 *   subdocItem.add({
 *      title: String,
 *      content: String
 *   });
 *   var mainList = keystone.List('mainList');
 *
 *   mainList.add({
 *      subdocs: {type: Types.Array, model: subdocItem}
 *   });
 *
 *   mainList.register();
 *
 */

function array(list, path, options) {
    // TODO: implement filtering, hard-coded as disabled for now
    options.nofilter = true;

    // TODO: implement initial form, usage disabled for now
    if (options.initial) {
        throw new Error('Invalid Configuration\n\n' +
            'array fields (' + list.key + '.' + path + ') do not currently support being used as initial fields.\n');
    }

    array.super_.call(this, list, path, options);

    // validate model
    if (!options.model) {
        throw new Error('Invalid Configuration\n\n' +
            'array fields (' + list.key + '.' + path + ') require the "model" (a keystone.List) option to be set.');
    }
}

/*!
 * Inherit from Field
 */

util.inherits(array, super_);



/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

array.prototype.addToSchema = function() {

    var field = this,
        schema = this.list.schema;
    var mongoose = keystone.mongoose;

    var subdocSchema = this.options.model.schema;

    schema.add(this._path.addTo({}, [subdocSchema]));

};

/*!
 * Export class
 */

exports = module.exports = array;
