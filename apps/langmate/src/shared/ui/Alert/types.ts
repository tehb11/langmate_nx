export interface AlertButtonT {
  text: string;
  type?: 'highlight' | 'danger';
  isDisabled?: boolean;
  hideAlertOnPress?: boolean;
  onPress?: (() => boolean | void) | (() => Promise<boolean | void>);
}

export interface AlertParams {
  title?: string;
  message?: string;
  buttons?: AlertButtonT[];
  cancelable?: boolean;
}

export interface IAlert {
  show: (params: AlertParams) => void;
  hide: () => void;
}
