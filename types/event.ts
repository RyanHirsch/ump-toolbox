export interface ScrapedTrackEvent {
  domain: string;
  data: string;
  sentAt: number;
}

export interface ParsedTrackEvent extends MixpanelEvent {
  domain: string;
  sentAt: number;
}

export interface MixpanelEvent {
  event: string;
  properties: {
    [key: string]: any;
  };
}
