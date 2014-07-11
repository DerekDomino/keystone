/**
 * Created by vboucher on 03/07/14.
 */

/*!
 * Module dependencies.
 */

var util = require('util'),
    keystone = require('../../'),
    super_ = require('../field'),
    _ = require('underscore'),
    MockItem = require('../mockItem');

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

    this._uniqueIdx = 0;

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

    // schema.nested[this.path] = true;

    // Record now that the model List describes a list of subdocuments
    this.options.model.parentList = this.list;
    this.options.model.parentField = field;

    // TODO: handle nested sublists (with a concatenated fullParentListPath?)
    this.options.model.parentFieldPath = field.path;

    var subdocSchema = this.options.model.schema;

    schema.add(this._path.addTo({}, [subdocSchema]));

};

/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

array.prototype.updateItem = function(item, data) {
    
    return; // WIP

    var subdocArr = data[this.path];
    // Clear existing item content under this path
    item[this.path] = [];

    if (!util.isArray(subdocArr)) {
        // TODO: manage invalid data
        console.error('Expected data as a list of subdocuments');
        return;
    }
    // Loop over list entries
    _.each(
        subdocArr
        ,
        function (entry, indexEntry){
            // Somehow same level as a List validation / transform
            var itemContent = {};
            mockedItem = new MockItem(itemContent);
            var dataEntry = subdocArr[indexEntry];
            // Loop over expected fields of entry
            _.each(
                this.options.model.fields,
                function(subfield){
                    subfield.updateItem(mockedItem, dataEntry);
                },
                this
            );
            // kind of set (subdocument-set)
            item.push(itemContent);
        },
        this
    );
};

/*!
 * Export class
 */

exports = module.exports = array;
