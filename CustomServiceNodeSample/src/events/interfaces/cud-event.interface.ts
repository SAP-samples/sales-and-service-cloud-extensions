/**
 * Generic CloudEvent envelope for CUD (Create/Update/Delete) events.
 * Not analytics-specific — any consumer subscribing to these events receives
 * this shape.
 */
export interface CudEvent {
  id: string;
  subject: string;
  type: string;
  specversion: string;
  source: string;
  time: string;
  datacontenttype: string;
  data: {
    dataRequestId: string;
    entityFullName: string;
    serviceFullName: string;
    type: 'DATA';
    currentImage?: any;
    beforeImage?: any;
  };
}
