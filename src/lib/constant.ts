export enum ListingStatus {
  draft = 0,
  active = 1,
  closed = 2,
  deleted = 3
}

export enum MessageStatus {
  unread = 0,
  read = 1,
  delete = 2
}

export enum DropdownEventType {
  edit = '1',
  unpublish = '2',
  close = '3',
  delete = '4'
}

export enum MessageDropdownEventType {
  view = '1',
  unread = '2',
  read = '3',
  delete = '4'
}

export enum CodeSentType {
  Verify = '_verify',
  ForgotPassword = '_forgot-password',
}