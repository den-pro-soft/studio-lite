/**
 * Image block resides inside a scene or timeline
 * @class BlockImage
 * @extends Block
 * @constructor
 * @param {string} i_placement location where objects resides which can be scene or timeline
 * @param {string} i_campaign_timeline_chanel_player_id required and set as block id when block is inserted onto timeline_channel
 * @return {Object} Block instance
 */
define(['jquery', 'backbone', 'Block'], function ($, Backbone, Block) {

    var BlockImage = Block.extend({

        /**
         Constructor
         @method initialize
         **/
        constructor: function (options) {
            var self = this;
            self.m_blockType = 3130;
            _.extend(options, {blockType: self.m_blockType})
            Block.prototype.constructor.call(this, options);
            self._initSubPanel(Elements.BLOCK_IMAGE_COMMON_PROPERTIES);
            self._listenInputChange();
            self._initResourcesData();
        },

        /**
         Set the instance resource data from msdb which includes resource_id (handle of a resource)
         as well as the description of the resource and icon.
         @method _initResourcesData
         **/
        _initResourcesData: function () {
            var self = this;
            var domPlayerData = self._getBlockPlayerData();
            var xSnippet = $(domPlayerData).find('Resource');
            self.m_resourceID = $(xSnippet).attr('hResource');
            self.m_nativeID = pepper.getResourceNativeID(self.m_resourceID);
            if (_.isNull(self.m_nativeID)) {
                self._selfDestruct();
                return;
            }
            self.m_blockName = pepper.getResourceRecord(self.m_resourceID).resource_name;
            self.m_blockDescription = pepper.getResourceName(self.m_resourceID);
            self.m_fileFormat = pepper.getResourceType(self.m_resourceID);
            self.m_blockFontAwesome = BB.PepperHelper.getFontAwesome(self.m_fileFormat);
        },

        /**
         Populate the common block properties panel, called from base class if exists
         @method _loadBlockSpecificProps
         @return none
         **/
        _loadBlockSpecificProps: function () {
            var self = this;
            self._populate();
            this._viewSubPanel(Elements.BLOCK_IMAGE_COMMON_PROPERTIES);
        },

        /**
         Update common property title element
         @method _updateTitle override
         @return none
         **/
        _updateTitle: function () {
            var self = this;
            $(Elements.SELECTED_CHANNEL_RESOURCE_NAME).text(self.m_blockDescription);
        },

        /**
         When user changes a URL link for the feed, update the msdb
         @method _listenInputChange
         @return none
         **/
        _listenInputChange: function () {
            var self = this;
            self.m_inputChangeHandler = function () {
                if (!self.m_selected)
                    return;
                var aspectRatio = $(Elements.IMAGE_ASPECT_RATIO + ' option:selected').val() == "on" ? 1 : 0;
                var domPlayerData = self._getBlockPlayerData();
                var xSnippet = $(domPlayerData).find('AspectRatio');
                $(xSnippet).attr('maintain', aspectRatio);
                self._setBlockPlayerData(domPlayerData, BB.CONSTS.NO_NOTIFICATION);
            };
            $(Elements.IMAGE_ASPECT_RATIO).on('change', self.m_inputChangeHandler);
        },

        /**
         Load up property values in the common panel
         @method _populate
         @return none
         **/
        _populate: function () {
            var self = this;
            var domPlayerData = self._getBlockPlayerData();
            var xSnippet = $(domPlayerData).find('AspectRatio');
            var aspectRatio = xSnippet.attr('maintain') == '1' ? 'on' : 'off';
            $(Elements.IMAGE_ASPECT_RATIO + ' option[value="' + aspectRatio + '"]').prop("selected", "selected");
        },

        /**
         Convert the block into a fabric js compatible object
         @Override
         @method fabricateBlock
         **/
        fabricateBlock: function (i_canvasScale, i_callback) {
            var self = this;

            var domPlayerData = self._getBlockPlayerData();
            var layout = $(domPlayerData).find('Layout');
            var businessID = pepper.getUserData().businessID;
            var elemID = _.uniqueId('imgElemrand')
            var imgPath;

            if (self.m_fileFormat == 'swf') {
                imgPath = './_assets/flash.png';
            } else {
                /*
                 if (platform.name == 'Chrome') {
                 // CDN
                 imgPath = window.g_protocol + 's3.signage.me/business' + pepper.getUserData().businessID + '/resources/';
                 imgPath = 'https://s3.signage.me/business' + pepper.getUserData().businessID + '/resources/';
                 imgPath += +self.m_nativeID + '.' + self.m_fileFormat;
                 } else {
                 // Legacy
                 imgPath = window.g_protocol + pepper.getUserData().domain + '/Resources/business' + pepper.getUserData().businessID + '/resources/' + self.m_nativeID + '.' + self.m_fileFormat;
                 }
                 */
                imgPath = window.g_protocol + pepper.getUserData().domain + '/Resources/business' + pepper.getUserData().businessID + '/resources/' + self.m_nativeID + '.' + self.m_fileFormat;
                // log('loading img from ' + imgPath);
            }

            var initImage = function (i_image, i_passed) {
                if (!i_passed){
                    i_callback();
                    return;
                }
                $(i_image).width(1000).height(800).appendTo('body');
                var options = self._fabricateOptions(parseInt(layout.attr('y')), parseInt(layout.attr('x')), parseInt(layout.attr('width')), parseInt(layout.attr('height')), parseInt(layout.attr('rotation')));
                var img = new fabric.Image(i_image, options);
                _.extend(self, img);
                self._fabricAlpha(domPlayerData);
                self._fabricLock();
                self['canvasScale'] = i_canvasScale;
                i_callback();
            };

            // manage errors of resources which don't load
            $('<img src="' + imgPath + '" style="display: none" >').load(function () {
                initImage(this, true);
            }).error(function () {
                initImage(this, false);
            })
        },

        /**
         Get the resource id of the embedded resource
         @method getResourceID
         @return {Number} resource_id;
         **/
        getResourceID: function () {
            var self = this;
            return self.m_resourceID;
        },

        /**
         Delete this block
         @method deleteBlock
         @params {Boolean} i_memoryOnly if true only remove from existance but not from msdb
         **/
        deleteBlock: function (i_memoryOnly) {
            var self = this;
            $(Elements.IMAGE_ASPECT_RATIO).off('change', self.m_inputChangeHandler);
            self._deleteBlock(i_memoryOnly);
        }
    });

    return BlockImage;
});