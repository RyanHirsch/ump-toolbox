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
  properties: KeyedValues;
}

export interface KeyedValues {
  [key: string]: any;
}

export interface EventBreakdown {
  eventProps: KeyedValues;
  superProps: KeyedValues;
  mpProps: KeyedValues;
}
