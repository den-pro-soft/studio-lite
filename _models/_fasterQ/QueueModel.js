/**
 Queue Model
 @class QueueModel
 @constructor
 @return {Object} instantiated QueueModel
 **/
define(['jquery', 'backbone'], function ($, Backbone) {

    var QueueModel = Backbone.Model.extend({

        /**
         Constructor
         @method initialize
         **/
        initialize: function () {
        },
        urlRoot: BB.CONSTS.ROOT_URL + '/Queue',
        idAttribute: 'queue_id'
    });

    return QueueModel;

});