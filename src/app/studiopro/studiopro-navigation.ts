import {ChangeDetectionStrategy, Component, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";
import {RedPepperService} from "../../services/redpepper.service";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Observable} from "rxjs/Observable";
import {UserModel} from "../../models/UserModel";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`

        .dottedHR {
            height: 6px;
            width: 1500px;
            opacity: 0.6;
            position: relative;
            border-top: 12px dotted #c1c1c1;
            padding-bottom: 7px;
            top: 20px;
        }

        .activated {
            background-color: #428bca;
            color: white;
        }

        .headerPropIcon {
            position: fixed !important;
            top: 0px !important;
            color: #f5f5f5;
            right: 50px !important;
            z-index: 1500;
            background-color: #151515;
            float: right;
            border: black;
        }

        .whiteFont {
            color: white;
        }

        .pricingContainer {
            padding-top: 40px;
        }

        .price {
            font-size: 25px;
            float: left;
        }

        .faHeader {
            font-size: 1.9em !important;
            color: #bababa;
        }

        .faHeader:hover {
            color: white;
        }

        .pricing_header1 {
            background: none repeat scroll 0% 0% #9CC23B;
            border-radius: 5px 5px 0px 0px;
        }

				.home-box-footer {
  					height: 50px;
				}

				.home-box-footer a {
						width: 25%;
						padding: 12px;
						background-color: black;
						border-width: 1px;
						border-radius: 8px !important;
						text-align: center;
						font-size: 10px;
						font-weight: 800;
						font-family: inherit;
						margin: 0px auto;
						display: block;
						border: 1px solid #07121b;
						box-shadow: 0px 2px 0px #07121b;
						color: #fff;
						text-shadow: 1px 1px 1px #07121b;
				}

				.home-box-footer a:active {
						position: relative;
						top: 2px;
						-webkit-box-shadow: none !important;
						-moz-box-shadow: none !important;
						-ms-box-shadow: none !important;
						-o-box-shadow: none !important;
						box-shadow: none !important;
						-webkit-transition: All 250ms ease;
						-moz-transition: All 250ms ease;
						-o-transition: All 250ms ease;
						-ms-transition: All 250ms ease;
						transition: All 250ms ease;
				}

        .pricing_header2 {
            background: none repeat scroll 0% 0% #499B45;
            border-radius: 5px 5px 0px 0px;
        }

        .pricing_header3 {
            background: none repeat scroll 0% 0% #414144;
            border-radius: 5px 5px 0px 0px;
        }

				.list-group {
						text-align: center;
						font-weight: bold;
				}

				.list-group .list-group-item {
						padding: 10px 0px;
				}

        .pricing_headerh2 {
            text-align: center;
            line-height: 25px;
            padding: 15px 0px;
            margin: 0px;
            font-size: 1.5em;
            font-weight: bold;
            color: white;
        }

    `],
    host: {
        '[@routeAnimation]': 'true',
        '[style.display]': "'block'"
    },
    animations: [
        trigger('routeAnimation', [
            state('*', style({opacity: 1})),
            transition('void => *', [
                style({opacity: 0}),
                animate(333)
            ]),
            transition('* => void', animate(333, style({opacity: 0})))
        ])
    ],
    template: `
        <div id="proStudioPanel">
            <h3 i18n data-localize="theRightPackage">Choose the package that's right for you</h3>
            <!-- price & service -->
            <div class="pricingContainer">
                <div class="row"></div>
                <br>

                <div id="pricingTableWrap" style="overflow-x: hidden; overflow-y: scroll; height: 100%">
                    <div class="col-md-4" id="home-box">
                        <div class="pricing_header1">
                            <h2 class="pricing_headerh2" data-localize="imagecreation">
                                IMAGE CREATION
                            </h2>

                            <div class="space"></div>
                        </div>
                        <ul class="list-group">
                            <li *ngIf="isBrandingDisabled | async" class="list-group-item">
                                <span >- </span><span data-localize="onehundredFree"> 100% FREE</span>
                            </li>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="simplegraphic"> Simple Graphic</span>
                            </li>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="campaignManager"> Includes styling, text, layering.</span>
                            </li>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="timelineManagement"> Up to 3 revisions.</span>
                            </li>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="screenTemplates"> Pick up your pixel size.</span>
                            </li>
                        </ul>
												<div class = "home-box-footer">
														<a href = "#" (click)="_onGoLink($event)" >
																PURCHASE
														</a>
												</div>
                        <div *ngIf="isBrandingDisabled | async" class="try">
                            <p class="price">$0.00</p>
                            <button class="pull-right btnPrice btn btn-default" disabled="disabled" href="#" type="button" data-localize="youAreHere">you are here
                            </button>
                        </div>
                    </div>
                    <div class="col-md-4" id="home-box">
                        <div class="pricing_header2">
                            <h2 class="pricing_headerh2" data-localize="videocreation">
                                VIDEO CREATION
                            </h2>

                            <div class="space"></div>
                        </div>
                        <ul class="list-group">
                            <li *ngIf="isBrandingDisabled | async" class="list-group-item">
                                <span >- </span><span data-localize="onehundredFree"> 100% FREE</span>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="simplegraphic"> Simple Video.</span>
                            </li>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="campaignManager"> Includes styling, text, layering.</span>
                            </li>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="timelineManagement"> Up to 3 revisions.</span>
                            </li>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="screenTemplates"> 1920 × 1080 Standard pixel size.</span>
                            </li>
                        </ul>
												<div class = "home-box-footer">
														<a href = "#" (click)="_onGoLink($event)" >
																PURCHASE
														</a>
												</div>
                        <div *ngIf="isBrandingDisabled | async" class="try">
                            <p class="price">$0.00</p>
                            <a (click)="_onConvert($event)" id="convertAccount" class="pull-right btnPrice btn-primary btn btn-default" href="#" type="button" data-localize="convert">Convert</a>
                        </div>
                    </div>
                    <div class="col-md-4" id="home-box">
                        <div class="pricing_header3">
                            <h2 class="pricing_headerh2" data-localize="completelayout">
                                COMPLETE LAYOUT</h2>

                            <div class="space"></div>
                        </div>
                        <ul class="list-group">
                            <li *ngIf="isBrandingDisabled | async" class="list-group-item">
                                <span >- </span><span data-localize="nintynine"> $99 a month (flat)</span>
                            </li>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="simplegraphic"> Menu Layout, Social Media Feed or Complex Graphic.</span>
                            </li>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="campaignManager"> Includes styling, text, layering.</span>
                            </li>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="timelineManagement"> Up to 3 revisions.</span>
                            </li>
                            <li class="list-group-item">
                                <span >- </span><span data-localize="screenTemplates"> Pick up your pixel size.</span>
                            </li>
                        </ul>
												<div class = "home-box-footer">
														<a href = "#" (click)="_onGoLink($event)" >
																PURCHASE
														</a>
												</div>
                        <div class="try">
                            <p *ngIf="isBrandingDisabled | async" class="price">$99/<span data-localize="month">month</span>
                            </p>
                            <button *ngIf="isBrandingDisabled | async" (click)="_onSubscribe($event)" id="subscribeAccount" class="pull-right showUpgradeModal btnPrice btn-primary btn btn-default" href="#" type="button" data-localize="subscribe"> Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <modal #modal>
            <modal-header [show-close]="true">
                <h4 i18n class="modal-title">Upgrade to Enterprise - $99.00 per month</h4>
            </modal-header>
            <modal-body>
                <pro-upgrade></pro-upgrade>
            </modal-body>
            <modal-footer [show-default-buttons]="false"></modal-footer>
        </modal>
    `
})
export class StudioProNavigation extends Compbaser {

    @ViewChild(ModalComponent)
    modal: ModalComponent;

    subAccount = false;
    isBrandingDisabled: Observable<boolean>

    constructor(private yp: YellowPepperService, private rp: RedPepperService) {
        super();
        this.isBrandingDisabled = this.yp.isBrandingDisabled()
    }

    _initCustomer() {
        if (this.rp.getUserData().resellerID == 1 || this.rp.getUserData().whiteLabel == false) {
            this.subAccount = false;
        } else {
            this.subAccount = true;
        }
    }

    _onConvert(event) {
        window.open('http://galaxy.mediasignage.com/WebService/signagestudio.aspx?mode=login&v=4&eri=f7bee07a7e79c8efdb961c4d30d20e10c66442110de03d6141', '_blank');
    }

		_onGoLink(event) {
				window.open('https://www.explorestream.com/contentstore/', '_blank');
		}

    _onSubscribe(event) {
        this.modal.open();
    }

    ngOnInit() {
        this.preventRedirect(true);
        this._initCustomer();
    }

    destroy() {
    }
}
