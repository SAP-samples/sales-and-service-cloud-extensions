export interface CloudEvent {
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
    type: 'PLAN' | 'DATA' | 'SUMMARY';
    count?: number;
    currentImage?: any;
    beforeImage?: any;
    status?: 'SUCCESS' | 'ABORTED';
    errorMessage?: string;
    errorCode?: string;
  };
}
