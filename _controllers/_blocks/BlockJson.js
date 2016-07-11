///<reference path="../../typings/lite/app_references.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(['jquery', 'BlockJsonBase'], function ($, BlockJsonBase) {
    TSLiteModules.BlockJsonBase = BlockJsonBase;
    /**
     BlockJson is a Player block that is used as base class for all JSON based components
     it allows for parsing of JSON data and is supported with the JSON Item inside scenes

     The setup sequence is:
     ======================
     1. Constructor of the child, which calls super on base
     2. Constructor of the base, which calls init on base
     3. Initialize of the base
     4. Initialize of the child
     5. Instance is ready

     @class BlockJson
     @constructor
     @return {Object} instantiated BlockJson
     * @example
     * path: http://www.digitalsignage.com/videoTutorials/_data/videos.json
     * json player: children[0].children
     * json item: text
     **/
    var BlockJson = (function (_super) {
        __extends(BlockJson, _super);
        function BlockJson(options) {
            //BB.lib.log('c child');
            this.m_options = options;
            this.m_blockType = 4300;
            _.extend(this.m_options, { blockType: this.m_blockType });
            _super.call(this);
        }
        /**
         Init sub class and super on base
         @Override
         @method initialize
         **/
        BlockJson.prototype.initialize = function () {
            var self = this;
            _super.prototype.initialize.call(this, this.m_options);
        };
        /**
         Show the JSON URL and JSON Object paths inputs for the JSON component only
         @Override
         @method  _showJsonPaths
         **/
        BlockJson.prototype._updateJsonPaths = function () {
            $(Elements.JSON_PATHS_CONTAINER).slideDown();
        };
        /**
         Update the title of the selected tab properties element and also show the sub tab
         for Settings of Json sub components (world weather, Calendar etc...)
         @override
         @method _updateTitleTab
         */
        BlockJson.prototype._updateTitleTab = function () {
            var self = this;
            _super.prototype._updateTitleTab.call(this);
            $(Elements.BLOCK_COMMON_SETTINGS_TAB).hide();
        };
        /**
         Populate the common properties UI
         @Override
         @method _populate
         **/
        BlockJson.prototype._populate = function () {
            _super.prototype._populate.call(this);
            $(Elements.JSON_PATHS_CONTAINER).show();
        };
        return BlockJson;
    })(TSLiteModules.BlockJsonBase);
    return BlockJson;
});
//# sourceMappingURL=BlockJson.js.map