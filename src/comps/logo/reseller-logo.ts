import {Component, ChangeDetectionStrategy, AfterViewInit, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {LazyImage} from "../lazy-image/lazy-image";
import {UserModel} from "../../models/UserModel";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'reseller-logo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <img lazyImage style="width: 170px; height: 60px;"
             [loadingImage]="'assets/login_logo.png'"
             [defaultImage]="'assets/login_logo.png'"
             [errorImage]="'assets/login_logo.png'"
             [retry]="3"
             [delay]="500"
             (loaded)="_onLoaded()"
             (error)="_onError()"
             (completed)="_onCompleted()">
    `
})
export class ResellerLogo extends Compbaser implements AfterViewInit {


    constructor(private yp: YellowPepperService, private rp: RedPepperService) {
        super();
    }



    @ViewChild(LazyImage)
    lazyImage: LazyImage;

    _onLoaded() {
        // console.log('img loaded');
    }

    _onError() {
        console.log('img error');
    }

    _onCompleted() {
        // console.log('img completed');
    }

    ngAfterViewInit() {
        this.cancelOnDestroy(
            this.yp.listenUserModel()
                .take(1)
                .subscribe((i_userModel: UserModel) => {
                    if (i_userModel.resellerId == 1)
                        return;
                    var urls = [
                        `assets/login_logo.png`,
                        `assets/login_logo.png`
                    ];
                    this.lazyImage.setUrls(urls);
                }, (e) => console.error(e))
        )

    }

    ngOnInit() {
    }

    destroy() {
    }
}
