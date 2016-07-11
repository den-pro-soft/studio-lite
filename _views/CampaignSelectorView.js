/**
 Campaign selector, class extends Backbone > View and used to select a campaign or create a new one
 @class CampaignSelectorView
 @constructor
 @return {Object} instantiated CampaignSelectorView
 **/
define(['jquery', 'backbone', 'simplestorage', 'ResourcesListView'], function ($, Backbone, simplestorage, ResourcesListView) {

    BB.CONSTS.SEQUENCER_MODE = '0';
    BB.CONSTS.SCHEDULER_MODE = '1';
    /**
     Custom event fired when we need to refresh the campaign list
     @event LOAD_CAMPAIGN_LIST
     @param {This} caller
     @param {Self} context caller
     @param {Event} rss link
     @static
     @final
     **/
    BB.EVENTS.LOAD_CAMPAIGN_LIST = 'LOAD_CAMPAIGN_LIST';

    /**
     Custom event fired when a going back to campaign is selected
     @event CAMPAIGN_SELECTED
     @param {This} caller
     @param {Self} context caller
     @param {Event}
     @static
     @final
     **/
    BB.EVENTS.CAMPAIGN_SELECTED = 'CAMPAIGN_SELECTED';

    BB.SERVICES.CAMPAIGN_SELECTOR = 'CampaignSelector';

    var CampaignSelectorView = BB.View.extend({

        /**
         Constructor
         @method initialize
         **/
        initialize: function () {
            var self = this;
            self.m_selectedCampaignID = -1;
            self.m_disabled = true;
            self.m_campainProperties = new BB.View({
                el: Elements.CAMPAIGN_PROPERTIES
            });
            self.m_propertiesPanel = BB.comBroker.getService(BB.SERVICES.PROPERTIES_VIEW);
            self.m_propertiesPanel.addView(this.m_campainProperties);
            self.MIN_WIDTH_WIZARD = 1200;
            self.MIN_HIGHT_WIZARD = 700;
            self._loadCampaignList();
            self._listenAddRemoveCampaign();
            self._listenCampaignModeSelect();
            self._listenWizardStart();
            self._checkFirstTimeUser();
        },

        /**
         Enable this component, i.e.: allow clicking of campaign list selection and set
         the storage firstwizard so it no longer auto pops up
         @method _enableComponent
         **/
        _enableComponent: function () {
            var self = this;
            simplestorage.set('firstwizard', 2);
            $(Elements.CAMPAIGN_SELECTOR).animate({opacity: 1});
            $('button', self.$el).attr('disabled', false);
            self.m_disabled = false;
        },

        /**
         Listen to kick off of wizard button
         @method _listenWizardStart
         **/
        _listenWizardStart: function () {
            var self = this;
            $(Elements.GET_WIZARD_HELP).on('click', function () {
                $(Elements.GET_WIZARD_HELP).fadeOut('slow');
                var w = BB.comBroker.getService(BB.SERVICES.LAYOUT_ROUTER).getAppWidth();
                var h = BB.comBroker.getService(BB.SERVICES.LAYOUT_ROUTER).getAppHeight();
                if (w < self.MIN_WIDTH_WIZARD || h < self.MIN_HIGHT_WIZARD) {
                    bootbox.alert($(Elements.MSG_BOOTBOX_BROWSER_TOO_SMALL).text());
                    return;
                }
                $(Elements.LIVE_TUTORIAL).trigger('click');
            });
        },

        /**
         For first time users launch wizard
         @method _checkFirstTimeUser
         **/
        _checkFirstTimeUser: function () {
            var self = this;

            // disable wizard
            //self._enableComponent();
            //return;

            var firstwizard = simplestorage.get('firstwizard');
            firstwizard = _.isUndefined(firstwizard) ? 1 : firstwizard;
            if (firstwizard > 1) {
                self._enableComponent();
            } else {
                self._autoStartWizard();
            }
        },

        /**
         Auto kick start the Wizard, but only if app WxH is sufficient
         @method _autoStartWizard
         **/
        _autoStartWizard: function () {
            var self = this;
            var w = BB.comBroker.getService(BB.SERVICES.LAYOUT_ROUTER).getAppWidth();
            var h = BB.comBroker.getService(BB.SERVICES.LAYOUT_ROUTER).getAppHeight();
            if (w < self.MIN_WIDTH_WIZARD || h < self.MIN_HIGHT_WIZARD) {
                self._enableComponent();
                return;
            }
            $(Elements.GET_WIZARD_HELP).fadeOut('slow');
            setTimeout(function () {
                BB.comBroker.fire(BB.EVENTS.CAMPAIGN_LIST_LOADING, this, this);
            }, 1000);
            setTimeout(function () {
                self._enableComponent();
            }, 3000);
        },

        /**
         Listen to changes in campaign playback mode
         @method _listenCampaignModeSelect
         **/
        _listenCampaignModeSelect: function () {
            var self = this;
            $(Elements.CLASS_CAMPAIGN_PLAY_MODE).on('click', function (e) {
                if ($(e.target).is('span'))
                    e.target = $(e.target).closest('button');

                switch ($(e.target).attr('name')) {
                    case 'campaignModeSequencer':
                    {
                        self._populateCampaignMode(0);
                        pepper.setCampaignRecord(self.m_selectedCampaignID, 'campaign_playlist_mode', '0');
                        break;
                    }
                    case 'campaignModeScheduler':
                    {
                        self._populateCampaignMode(1);
                        pepper.setCampaignRecord(self.m_selectedCampaignID, 'campaign_playlist_mode', '1');
                        pepper.checkAndCreateCampaignTimelineScheduler(self.m_selectedCampaignID);
                        break;
                    }
                }
            });
        },

        /**
         Load the campaign's play mode (scheduler /sequencer)
         @method _populateCampaignMode();
         **/
        _populateCampaignMode: function (i_mode) {
            var self = this;
            var mode = String(i_mode);
            switch (mode) {
                case BB.CONSTS.SEQUENCER_MODE:
                {
                    $(Elements.CAMPAIGN_MODE_SCHEDULER).fadeTo('fast', 0.4);
                    $(Elements.CAMPAIGN_MODE_SEQUENCER).fadeTo('fast', 1);
                    $(Elements.CAMPAIGN_MODE_HEADER).text($(Elements.CAMPAIGN_MODE_HEADER_SEQ).text());
                    $(Elements.CAMPAIGN_MODE_DESCRIPTION).text($(Elements.CAMPAIGN_MODE_SEQ).text());
                    break;
                }
                case BB.CONSTS.SCHEDULER_MODE:
                {
                    $(Elements.CAMPAIGN_MODE_SCHEDULER).fadeTo('fast', 1);
                    $(Elements.CAMPAIGN_MODE_SEQUENCER).fadeTo('fast', 0.4);
                    $(Elements.CAMPAIGN_MODE_HEADER).text($(Elements.CAMPAIGN_MODE_HEADER_SCHED).text());
                    $(Elements.CAMPAIGN_MODE_DESCRIPTION).text($(Elements.CAMPAIGN_MODE_SCHED).text());
                    break;
                }
            }
        },

        /**
         Wire the UI including new campaign creation and delete existing campaign
         @method _listenAddRemoveCampaign
         **/
        _listenAddRemoveCampaign: function () {
            var self = this;

            $(Elements.NEW_CAMPAIGN).on('click', function (e) {
                if (self.m_disabled)
                    return;
                self.m_selectedCampaignID = -1;
                BB.comBroker.fire(BB.EVENTS.CAMPAIGN_SELECTED, this, this, self.m_selectedCampaignID);
                self.options.stackView.slideToPage(self.options.to, 'right');
                return false;
            });

            $(Elements.REMOVE_CAMPAIGN).on('click', function (e) {
                if (self.m_disabled)
                    return;
                if (self.m_selectedCampaignID != -1) {
                    var selectedElement = self.$el.find('[data-campaignid="' + self.m_selectedCampaignID + '"]');
                    var allCampaignIDs = pepper.getStationCampaignIDs();
                    if (_.indexOf(allCampaignIDs, self.m_selectedCampaignID) == -1) {
                        bootbox.confirm($(Elements.MSG_BOOTBOX_SURE_DELETE_CAMPAIGN).text(), function (result) {
                            if (result == true) {
                                selectedElement.remove();
                                self._removeCampaignFromMSDB(self.m_selectedCampaignID);
                            }
                        });
                    } else {
                        bootbox.alert($(Elements.MSG_BOOTBOX_CANT_DELETE_COMP).text());
                        return false;
                    }
                } else {
                    bootbox.alert($(Elements.MSG_BOOTBOX_SELECT_COMP_FIRST).text());
                    return false;
                }
            });
        },

        /**
         Listen for when to refresh the campaign list (new campaign was created)
         @method _listenLoadCampaignList
         @return none
         **/
        _listenLoadCampaignList: function () {
            var self = this;
            BB.comBroker.listen(BB.EVENTS.LOAD_CAMPAIGN_LIST, function (e) {
                self._loadCampaignList();
            });
        },

        /**
         Populate the LI with all available campaigns from msdb
         @method _loadCampaignList
         @return none
         **/
        _loadCampaignList: function () {
            var self = this;
            self.m_selected_resource_id = undefined;
            $(Elements.CAMPAIGN_SELECTOR_LIST).empty();
            var campaignIDs = pepper.getCampaignIDs();
            for (var i = 0; i < campaignIDs.length; i++) {
                var campaignID = campaignIDs[i];
                var recCampaign = pepper.getCampaignRecord(campaignID);
                var playListMode = recCampaign['campaign_playlist_mode'] == 0 ? 'sequencer' : 'scheduler';

                var snippet = '<a href="#" class="' + BB.lib.unclass(Elements.CLASS_CAMPIGN_LIST_ITEM) + ' list-group-item" data-campaignid="' + campaignID + '">' +
                    '<h4>' + recCampaign['campaign_name'] + '</h4>' +
                    '<p class="list-group-item-text">play list mode:' + playListMode + '</p>' +
                    '<div class="openProps">' +
                    '<button type="button" class="' + BB.lib.unclass(Elements.CLASS_OPEN_PROPS_BUTTON) + ' btn btn-default btn-sm"><i style="font-size: 1.5em" class="fa fa-gear"></i></button>' +
                    '</div>' +
                    '</a>';
                $(Elements.CAMPAIGN_SELECTOR_LIST).append($(snippet));
            }

            this._listenOpenProps();
            this._listenSelectCampaign();
            this._listenInputChange();
            this._listenLoadCampaignList();
        },

        /**
         Listen select campaign
         @method _listenSelectCampaign
         @return none
         **/
        _listenSelectCampaign: function () {
            var self = this;
            $(Elements.CLASS_CAMPIGN_LIST_ITEM, self.el).on('click', function (e) {
                if (self.m_disabled)
                    return;
                $(Elements.CLASS_CAMPIGN_LIST_ITEM, self.el).removeClass('active');
                $(this).addClass('active');
                self.m_selectedCampaignID = $(this).data('campaignid');
                BB.comBroker.fire(BB.EVENTS.CAMPAIGN_SELECTED, this, this, self.m_selectedCampaignID);
                self.options.stackView.slideToPage(Elements.CAMPAIGN, 'right');
                return false;
            });
        },

        /**
         Listen for user trigger on campaign selection and populate the properties panel
         @method _listenOpenProps
         @return none
         **/
        _listenOpenProps: function () {
            var self = this;
            $(Elements.CLASS_OPEN_PROPS_BUTTON, self.el).on('click', function (e) {
                if (self.m_disabled)
                    return;
                $(Elements.CLASS_CAMPIGN_LIST_ITEM, self.el).removeClass('active');
                var elem = $(e.target).closest('a').addClass('active');
                self.m_selectedCampaignID = $(elem).data('campaignid');
                var recCampaign = pepper.getCampaignRecord(self.m_selectedCampaignID);
                self._populateCampaignMode(recCampaign.campaign_playlist_mode);
                $(Elements.FORM_CAMPAIGN_NAME).val(recCampaign['campaign_name']);
                self.m_propertiesPanel.selectView(self.m_campainProperties);
                self.m_propertiesPanel.openPropertiesPanel();
                return false;
            });
        },

        /**
         Remove an entire campaign including its timelines, channels, blocks, template, board etc
         @method removeCampaign
         @return none
         **/
        _removeCampaignFromMSDB: function (i_campaign_id) {
            var self = this;

            var timelineIDs = pepper.getCampaignTimelines(i_campaign_id);

            for (var i = 0; i < timelineIDs.length; i++) {
                var timelineID = timelineIDs[i];
                var boardTemplateID = pepper.getGlobalTemplateIdOfTimeline(timelineID);
                pepper.removeTimelineFromCampaign(timelineID);
                var campaignTimelineBoardTemplateID = pepper.removeBoardTemplateFromTimeline(timelineID);
                pepper.removeTimelineBoardViewerChannels(campaignTimelineBoardTemplateID);
                pepper.removeBoardTemplate(boardTemplateID);
                pepper.removeBoardTemplateViewers(boardTemplateID);
                pepper.removeTimelineFromSequences(timelineID);
                pepper.removeSchedulerFromTime(timelineID);

                var channelsIDs = pepper.getChannelsOfTimeline(timelineID);
                for (var n = 0; n < channelsIDs.length; n++) {
                    var channelID = channelsIDs[n];
                    pepper.removeChannelFromTimeline(channelID);

                    var blockIDs = pepper.getChannelBlocks(channelID);
                    for (var x = 0; x < blockIDs.length; x++) {
                        var blockID = blockIDs[x];
                        pepper.removeBlockFromTimelineChannel(blockID);
                    }
                }
            }
            pepper.removeCampaign(i_campaign_id);
            pepper.removeCampaignBoard(i_campaign_id);

            // check to see if any other campaigns are left, do some clean house and remove all campaign > boards
            var campaignIDs = pepper.getCampaignIDs();
            if (campaignIDs.length == 0)
                pepper.removeAllBoards();
            self.m_selectedCampaignID = -1;
            self.m_propertiesPanel.selectView(Elements.DASHBOARD_PROPERTIES);
        },

        /**
         Wire changing of campaign name through campaign properties
         @method _listenInputChange
         @return none
         **/
        _listenInputChange: function () {
            var self = this;
            var onChange = _.debounce(function (e) {
                if (self.m_selectedCampaignID == -1)
                    return;
                var text = $(e.target).val();
                if (BB.lib.isEmpty(text))
                    return;
                text = BB.lib.cleanProbCharacters(text, 1);
                pepper.setCampaignRecord(self.m_selectedCampaignID, 'campaign_name', text);
                self.$el.find('[data-campaignid="' + self.m_selectedCampaignID + '"]').find('h4').text(text);
            }, 333, false);
            $(Elements.FORM_CAMPAIGN_NAME).on("input", onChange);
        },

        /**
         Get selected campaign id
         @method getSelectedCampaign
         @return {Number} campaign_id
         **/
        getSelectedCampaign: function () {
            return this.m_selectedCampaignID;
        },

        /**
         Set selected campaign id
         @method setSelectedCampaign
         **/
        setSelectedCampaign: function (i_campaign_id) {
            var self = this;
            self.m_selectedCampaignID = i_campaign_id;
            self._loadCampaignList();
        }
    });

    return CampaignSelectorView;

});

