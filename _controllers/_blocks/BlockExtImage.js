/**
 * BlockExtImage block resides inside a scene or timeline
 * @class BlockExtImage
 * @extends Block
 * @constructor
 * @param {string} i_placement location where objects resides which can be scene or timeline
 * @param {string} i_campaign_timeline_chanel_player_id required and set as block id when block is inserted onto timeline_channel
 * @return {Object} Block instance
 */
define(['jquery', 'backbone', 'Block'], function ($, Backbone, Block) {

    var BlockExtImage = Block.extend({

        /**
         Constructor
         @method initialize
         **/
        constructor: function (options) {
            var self = this;
            self.m_blockType = 3160;
            _.extend(options, {blockType: self.m_blockType})
            Block.prototype.constructor.call(this, options);
            self._initSubPanel(Elements.BLOCK_EXT_IMAGE_COMMON_PROPERTIES);
            self._listenInputChange();
        },

        /**
         When user changes a URL link for the feed, update the msdb
         @method _listenInputChange
         @return none
         **/
        _listenInputChange: function () {
            var self = this;
            self.m_inputChangeHandler = _.debounce(function (e) {
                if (!self.m_selected)
                    return;
                var text = $(e.target).val();
                if (!text.match('http://') && !text.match('https://'))
                    text = 'http://' + text;
                var domPlayerData = self._getBlockPlayerData();
                var xSnippet = $(domPlayerData).find('LINK');
                xSnippet.attr('src', text);
                self._setBlockPlayerData(domPlayerData);
            }, 150);
            $(Elements.EXT_IMAGE_TEXT).on("input", self.m_inputChangeHandler);
        },

        /**
         Load up property values in the common panel
         @method _populate
         @return none
         **/
        _populate: function () {
            var self = this;
            var domPlayerData = self._getBlockPlayerData();
            var xSnippet = $(domPlayerData).find('LINK');
            var src = xSnippet.attr('src');
            $(Elements.EXT_IMAGE_TEXT).val(src);
        },

        /**
         Populate the common block properties panel, called from base class if exists
         @method _loadBlockSpecificProps
         @return none
         **/
        _loadBlockSpecificProps: function () {
            var self = this;
            self._populate();
            this._viewSubPanel(Elements.BLOCK_EXT_IMAGE_COMMON_PROPERTIES);
        },

        /**
         Delete this block
         @method deleteBlock
         @params {Boolean} i_memoryOnly if true only remove from existance but not from msdb
         **/
        deleteBlock: function (i_memoryOnly) {
            var self = this;
            $(Elements.EXT_IMAGE_TEXT).off("input", self.m_inputChangeHandler);
            self._deleteBlock(i_memoryOnly);
        }
    });

    return BlockExtImage;
});