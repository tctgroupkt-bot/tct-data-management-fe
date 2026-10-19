export interface SettingDto {
  id: number;
  emailToSend: string;
  emailToCC: string[];
  googleDriveFileId: string;
  googleDriveStorageLinkId: string;
}

export interface UpdateSettingDto {
  emailToSend: string;
  emailToCC: string[];
  googleDriveFileId: string;
  googleDriveStorageLinkId: string;
}