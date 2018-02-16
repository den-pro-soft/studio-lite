import {ChangeDetectionStrategy, Component, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";
import {MediaPlayer} from "../../comps/media-player/media-player";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Observable} from "rxjs/Observable";
/*
		<button class="videos btn btn-primary btn-lg" (click)="_onPlay('http://s3.signage.me/business1000/resources/FasterQv2.mp4')">
				<span>FasterQue line management</span>
		</button>
*/
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        button {
            padding: 8px;
            margin: 8px;
            width: 200px
        }

				.go_video {
						padding: 8px;
						margin: 8px;
				}

				.go_video a {
						width: 153px;
						height: 67px;
						background: url(assets/click_t.png) no-repeat;
						background-size: 150px 65px;
						display: inline-block;
				}


				.go_video a:active {
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
        <div id="helpPanel">
            <!-- video tutorials -->
            <h3 data-localize="videoTutorial">Video tutorial</h3>

						<div class = "go_video">
								<a href = "#" (click)="_onGoLink($event)" >
								</a>
						</div>
            <hr/>
            <div>
                <div class="reshid">
                    <div *ngIf="isBrandingDisabled | async">
                        <li>
                            <a class="helpLinks" target="_blank" href="http://lite.digitalsignage.com" data-localize="studioLitePage">StudioLite page</a>
                        </li>
                        <li>
                            <a class="helpLinks" target="_blank" href="http://script.digitalsignage.com/forum/index.php" data-localize="supportForum">Support forum</a>
                        </li>
                        <li>
                            <a class="helpLinks" target="_blank" href="http://git.digitalsignage.com" data-localize="openSource">StudioLite as open source (GitHub)</a>
                        </li>
                        <li>
                            <a class="helpLinks" target="_blank" href="http://script.digitalsignage.com/cgi-bin/webinar.cgi" data-localize="webinar">Webinar</a>
                        </li>
                        <li>
                            <a class="helpLinks" target="_blank" href="http://www.digitalsignage.com/_html/faqs.html" data-localize="faq">FAQs</a>
                        </li>
                        <li>
                            <a class="helpLinks" target="_blank" href="http://www.digitalsignage.com/support/upload/index.php?/Knowledgebase/List" data-localize="knowledgeBase">Knowledge base</a>
                        </li>
                    </div>
                </div>
                <hr/>
                <div *ngIf="isBrandingDisabled | async" class="reshid">
                    <h3>Contact us</h3>
                    <contact-us></contact-us>
                </div>
            </div>
            <div class="clearFloat"></div>
            <hr/>
            <div class="pull-left">
            </div>

        </div>
        <modal (onDismiss)="_onClose()" (onClose)="_onClose()" [size]="'lg'" #modal>
            <modal-header [show-close]="true">
            </modal-header>
            <modal-body>
                <media-player *ngIf="m_playing" [autoPlay]="true" #mediaPlayer [playResource]="m_playResource"></media-player>
            </modal-body>
            <modal-footer [show-default-buttons]="false"></modal-footer>
        </modal>
    `
})
export class HelpNavigation extends Compbaser {

    m_playResource
    m_playing = false;
    isBrandingDisabled: Observable<boolean>;

    @ViewChild('modal')
    modal: ModalComponent;

    @ViewChild('mediaPlayer')
    media: MediaPlayer;

    constructor(private yp: YellowPepperService) {
        super();
        this.isBrandingDisabled = this.yp.isBrandingDisabled()
    }

    _onClose() {
        this.m_playing = false;
    }

		_onGoLink(event) {
				window.open('https://www.youtube.com/playlist?list=PLpsFzcQvzwhTS96NAM7NCDIrInH_-ccFL', '_blank');
		}

    _onPlay(i_path) {
        this.m_playResource = i_path;
        this.modal.open('lg')
        this.m_playing = true;
    }

    destroy() {
    }
}
