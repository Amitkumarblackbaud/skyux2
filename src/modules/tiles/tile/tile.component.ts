import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  ViewChild
} from '@angular/core';
import {
  skyAnimationSlide
} from '../../animation/slide';

import {
  SkyTileDashboardService
} from '../tile-dashboard/tile-dashboard.service';

@Component({
  selector: 'sky-tile',
  styleUrls: ['./tile.component.scss'],
  templateUrl: './tile.component.html',
  animations: [skyAnimationSlide]
})
export class SkyTileComponent {
  public isInDashboardColumn = false;

  @Input()
  public showSettings: boolean = true;

  @Output()
  public settingsClick = new EventEmitter();

  @Output()
  public isCollapsedChange = new EventEmitter<boolean>();

  public get isCollapsed(): boolean {
    if (this.dashboardService) {
      return this.dashboardService.tileIsCollapsed(this);
    }

    return this._isCollapsed;
  }

  @Input()
  public set isCollapsed(value: boolean) {
    if (this.dashboardService) {
      this.dashboardService.setTileCollapsed(this, value);
    } else {
      this._isCollapsed = value;
    }

    this.isCollapsedChange.emit(value);
  }

  @ViewChild('grabHandle')
  private grabHandle: ElementRef;

  @ViewChild('titleContainer')
  private title: ElementRef;

  private _isCollapsed = false;

  constructor(
    public elementRef: ElementRef,
    @Optional() private dashboardService: SkyTileDashboardService
  ) {
    this.isInDashboardColumn = !!dashboardService;
  }

  public settingsButtonClicked() {
    this.settingsClick.emit(undefined);
  }

  public get hasSettings(): boolean {
    return this.settingsClick.observers.length > 0 && this.showSettings;
  }

  public titleClick() {
    this.isCollapsed = !this.isCollapsed;
  }

  public chevronDirectionChange(direction: string) {
    this.isCollapsed = direction === 'down';
  }

  public moveTile(event: KeyboardEvent) {
    if (this.isInDashboardColumn) {
      let direction = event.key.toLowerCase().replace('arrow', '');
      if (direction === 'up'
        || direction === 'down'
        || direction === 'left'
        || direction === 'right'
      ) {
        this.dashboardService.moveTileOnKeyDown(
          this,
          direction,
          this.title ? this.title.nativeElement.innerText : undefined
        );
        this.focusHandle();
      }
    }
  }

  private focusHandle(): void {
    this.grabHandle.nativeElement.focus();
  }
}
