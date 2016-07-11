/**
 * BlockLabel block resides inside a scene or timeline
 * @class BlockLabel
 * @extends Block
 * @constructor
 * @param {string} i_placement location where objects resides which can be scene or timeline
 * @param {string} i_campaign_timeline_chanel_player_id required and set as block id when block is inserted onto timeline_channel
 * @return {Object} Block instance
 */
define(['jquery', 'backbone', 'Block'], function ($, Backbone, Block) {

    var BlockLabel = Block.extend({

        /**
         Constructor
         @method initialize
         **/
        constructor: function (options) {
            var self = this;
            self.m_blockType = 3241;
            _.extend(options, {blockType: self.m_blockType})
            Block.prototype.constructor.call(this, options);
            self._initSubPanel(Elements.BLOCK_LABEL_COMMON_PROPERTIES);
            self.m_labelFontSelector = self.m_blockProperty.getLabelFontSelector();
            self._listenInputChange();
            self._listenFontSelectionChange();
            self._listenMouseEntersSceneCanvas();
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
                var text = $(Elements.LABEL_TEXT).val();
                text = BB.lib.cleanProbCharacters(text, 1);
                var domPlayerData = self._getBlockPlayerData();
                var xSnippet = $(domPlayerData).find('Label');
                var xSnippetText = $(xSnippet).find('Text');
                if (text == xSnippetText.text())
                    return;
                $(xSnippetText).text(text);
                self._setBlockPlayerData(domPlayerData);
            };
            $(Elements.LABEL_TEXT).on("mousemove", self.m_inputChangeHandler);

            /*self._labelEnterKey = _.debounce(function (e) {
                if (!self.m_selected)
                    return;
                //if (e.which == 13)
                self.m_inputChangeHandler(e);
                e.preventDefault();
            }, 750);
            $(Elements.LABEL_TEXT).on("keydown", self._labelEnterKey);*/
        },

        /**
         Load up property values in the common panel
         @method _populate
         @return none
         **/
        _populate: function () {
            var self = this;
            var domPlayerData = self._getBlockPlayerData();
            var xSnippet = $(domPlayerData).find('Label');
            var xSnippetText = $(xSnippet).find('Text');
            var xSnippetFont = $(xSnippet).find('Font');
            $(Elements.LABEL_TEXT).val(xSnippetText.text());

            self.m_labelFontSelector.setConfig({
                bold: xSnippetFont.attr('fontWeight') == 'bold' ? true : false,
                italic: xSnippetFont.attr('fontStyle') == 'italic' ? true : false,
                underline: xSnippetFont.attr('textDecoration') == 'underline' ? true : false,
                alignment: xSnippetFont.attr('textAlign'),
                font: xSnippetFont.attr('fontFamily'),
                color: BB.lib.colorToHex(BB.lib.decimalToHex(xSnippetFont.attr('fontColor'))),
                size: xSnippetFont.attr('fontSize')
            });
        },

        /**
         Listen to changes in font UI selection from Block property and take action on changes
         @method _listenFontSelectionChange
         **/
        _listenMouseEntersSceneCanvas: function () {
            var self = this;
            BB.comBroker.listenWithNamespace(BB.EVENTS.MOUSE_ENTERS_CANVAS, self, function (e) {
                if (!self.m_selected)
                    return;
                $(Elements.LABEL_TEXT).blur();
            });
        },

        /**
         Listen to changes in font UI selection from Block property and take action on changes
         @method _listenFontSelectionChange
         **/
        _listenFontSelectionChange: function () {
            var self = this;
            BB.comBroker.listenWithNamespace(BB.EVENTS.FONT_SELECTION_CHANGED, self, function (e) {
                if (!self.m_selected || e.caller !== self.m_labelFontSelector)
                    return;
                var config = e.edata;
                var domPlayerData = self._getBlockPlayerData();
                var xSnippet = $(domPlayerData).find('Label');
                var xSnippetFont = $(xSnippet).find('Font');

                config.bold == true ? xSnippetFont.attr('fontWeight', 'bold') : xSnippetFont.attr('fontWeight', 'normal');
                config.italic == true ? xSnippetFont.attr('fontStyle', 'italic') : xSnippetFont.attr('fontStyle', 'normal');
                config.underline == true ? xSnippetFont.attr('textDecoration', 'underline') : xSnippetFont.attr('textDecoration', 'none');
                xSnippetFont.attr('fontColor', BB.lib.colorToDecimal(config.color));
                xSnippetFont.attr('fontSize', config.size);
                xSnippetFont.attr('fontFamily', config.font);
                xSnippetFont.attr('textAlign', config.alignment);
                self._setBlockPlayerData(domPlayerData);
            });
        },

        /**
         Populate the common block properties panel, called from base class if exists
         @method _loadBlockSpecificProps
         @return none
         **/
        _loadBlockSpecificProps: function () {
            var self = this;
            self._populate();
            this._viewSubPanel(Elements.BLOCK_LABEL_COMMON_PROPERTIES);
        },

        /**
         Convert the block into a fabric js compatible object
         @Override
         @method fabricateBlock
         @param {number} i_canvasScale
         @param {function} i_callback
         **/
        fabricateBlock: function (i_canvasScale, i_callback) {
            var self = this;

            var domPlayerData = self._getBlockPlayerData();
            var layout = $(domPlayerData).find('Layout');
            var label = $(domPlayerData).find('Label');
            var text = $(label).find('Text').text();
            var font = $(label).find('Font');

            var url = ('https:' === document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';

            //$.getScript(src, function (data) {
            //    console.log(data);
            //});

            var t = new fabric.IText(text, {
                fontSize: $(font).attr('fontSize'),
                //fontFamily: 'Graduate',
                //fontFamily: 'Jolly Lodger',
                //fontFamily: 'Arial',
                fontFamily: $(font).attr('fontFamily'),
                fill: '#' + BB.lib.decimalToHex($(font).attr('fontColor')),
                textDecoration: $(font).attr('textDecoration'),
                fontWeight: $(font).attr('fontWeight'),
                fontStyle: $(font).attr('fontStyle'),
                textAlign: $(font).attr('textAlign'),
                top: 5,
                left: 5
            });

            // calculate block so it can always contain the text it holds and doesn't bleed
            self.m_minSize.w = t.width < 50 ? 50 : t.width * 1.2;
            self.m_minSize.h = t.height < 50 ? 50 : t.height * 1.2;
            var w = parseInt(layout.attr('width')) < self.m_minSize.w ? self.m_minSize.w : parseInt(layout.attr('width'));
            var h = parseInt(layout.attr('height')) < self.m_minSize.h ? self.m_minSize.h : parseInt(layout.attr('height'));

            var rec = self._fabricRect(w, h, domPlayerData);
            var o = self._fabricateOptions(parseInt(layout.attr('y')), parseInt(layout.attr('x')), w, h, parseInt(layout.attr('rotation')));
            //var group = new fabric.Group([ rec, t ], o);
            //_.extend(self, group);

            rec.originX = 'center';
            rec.originY = 'center';
            t.top = 0 - (rec.height / 2);
            t.left = 0 - (rec.width / 2);
            _.extend(self, o);
            self.add(rec);
            self.add(t);
            self._fabricAlpha(domPlayerData);
            self._fabricLock();
            self['canvasScale'] = i_canvasScale;

            //$.ajax({
            //    url: url,
            //    async: false,
            //    dataType: "script",
            //    complete: function(e){
            //        setTimeout(i_callback,1)
            //    }
            //});
            setTimeout(i_callback,1);

            var direction = $(font).attr('textAlign');
            switch (direction) {
                case 'left': {
                    break;
                }
                case 'center': {
                    t.set({
                        textAlign: direction,
                        originX: direction,
                        left: 0
                    });
                    break;
                }
                case 'right': {
                    t.set({
                        textAlign: direction,
                        originX: direction,
                        left: rec.width / 2
                    });
                    break;
                }
            }

            // todo: add shadow
            //http://jsfiddle.net/Kienz/fgWNL/
            //http://jsfiddle.net/fabricjs/7gvJG/
            //http://jsfiddle.net/5KKQ2/
            //t.set('shadow', {
            //    color: 'black',
            //    blur: 1,
            //    offsetX:3,
            //    offsetY: 1
            //});({ color: 'rgba(12,12,12,1)' });
            //rec.set('shadow', {
            //    color: 'black',
            //    blur: 1,
            //    offsetX:3,
            //    offsetY: 1
            //});
        },

        /**
         Delete this block
         @method deleteBlock
         @params {Boolean} i_memoryOnly if true only remove from existance but not from msdb
         **/
        deleteBlock: function (i_memoryOnly) {
            var self = this;
            $(Elements.LABEL_TEXT).off("mousemove", self.m_inputChangeHandler);
            //$(Elements.LABEL_TEXT).off("keydown", self.m_inputChangeHandler);
            $(Elements.LABEL_TEXT).off("blur", self.m_inputChangeHandler);
            BB.comBroker.stopListenWithNamespace(BB.EVENTS.FONT_SELECTION_CHANGED, self);
            BB.comBroker.stopListenWithNamespace(BB.EVENTS.MOUSE_ENTERS_CANVAS, self);
            self._deleteBlock(i_memoryOnly);
        }
    });

    return BlockLabel;
});