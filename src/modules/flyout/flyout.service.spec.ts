import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injector
} from '@angular/core';

import {
  inject,
  TestBed
} from '@angular/core/testing';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  expect
} from '@blackbaud/skyux-builder/runtime/testing/browser';

import {
  SkyWindowRefService
} from '../window';

import { SkyFlyoutAdapterService } from './flyout-adapter.service';
import { SkyFlyoutService } from './flyout.service';

import {
  SkyFlyoutMessageType
} from './types';

describe('Flyout service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule
      ],
      providers: [
        SkyFlyoutService,
        {
          provide: SkyFlyoutAdapterService,
          useValue: {
            appendToBody(): void { },
            removeHostElement(): void { }
          }
        },
        {
          provide: ApplicationRef,
          useValue: {
            attachView(): void {},
            detachView(): void {}
          }
        },
        Injector,
        {
          provide: ComponentFactoryResolver,
          useValue: {
            resolveComponentFactory(): any {
              return {
                create(): any {
                  return {
                    destroy(): any {},
                    hostView: {
                      rootNodes: [
                        {}
                      ]
                    },
                    instance: {
                      messageStream: {
                        take(): any {
                          return {
                            subscribe(): void { }
                          };
                        },
                        next(): void {}
                      },
                      attach(): any {
                        return {
                          close(): void { },
                          closed: {
                            take(): any {
                              return {
                                subscribe(): void { }
                              };
                            }
                          }
                        };
                      }
                    }
                  };
                }
              };
            }
          }
        },
        SkyWindowRefService
      ]
    });
  });

  it('should only create a single host component', inject(
    [SkyFlyoutService],
    (service: SkyFlyoutService) => {
      const spy = spyOn(service as any, 'createHostComponent').and.callThrough();
      service.open({} as any);
      service.open({} as any);
      expect(spy.calls.count()).toEqual(1);
    }
  ));

  it('should return an instance with a close method', inject(
    [SkyFlyoutService],
    (service: SkyFlyoutService) => {
      const flyout = service.open({} as any);
      expect(typeof flyout.close).toEqual('function');
    }
  ));

  it('should expose a method to remove the flyout from the DOM', inject(
    [SkyFlyoutService, SkyFlyoutAdapterService, ApplicationRef],
    (
      service: SkyFlyoutService,
      adapter: SkyFlyoutAdapterService,
      appRef: ApplicationRef
    ) => {
      service.open({} as any);
      const spy = spyOn(service['host'].instance.messageStream, 'next').and.callThrough();
      service.close();
      expect(spy).toHaveBeenCalledWith({
        type: SkyFlyoutMessageType.Close
      });
    }
  ));
});
