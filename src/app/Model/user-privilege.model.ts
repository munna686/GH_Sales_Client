export interface UserPrivilege {
  privilegeId: number;
  moduleId: number;
  userId: number;
  designationId: number;
  departmentId: number;
  workId: number;

  isRevert: boolean;
  isOnBehalf: boolean;
  isNew: boolean;
  isEdit: boolean;
  isDelete: boolean;
  isReadOnly: boolean;
  isReport: boolean;
  isPrint: boolean;
  isCancel: boolean;

  condition: string;
  conditionColumn: string | null;

  isCheckFor: number | null;
  isApproveFor: number | null;
  isEditTransDate: boolean | null;

  entryUserId: number | null;
  entryDate: string | null;
  updateBy: number | null;
  updateDate: string | null;

  checkBy: number | null;
  checkDate: string | null;
  approveBy: number | null;
  approveDate: string | null;

  isApproved: boolean;
  isCancel1: boolean;
  cancelBy: number | null;
  cancelDate: string | null;

  isDeleted: boolean;
  deleteDate: string | null;
  deleteBy: number | null;

  workFollowPosition: number;
  isActive: boolean;
  isDisApprove: boolean;

  entryBy: string | null;
}

export const EMPTY_USER_PRIVILEGE: UserPrivilege = {
  privilegeId: 0,
  moduleId: 0,
  userId: 0,
  designationId: 0,
  departmentId: 0,
  workId: 0,

  isRevert: false,
  isOnBehalf: false,
  isNew: false,
  isEdit: false,
  isDelete: false,
  isReadOnly: false,
  isReport: false,
  isPrint: false,
  isCancel: false,

  condition: '',
  conditionColumn: null,

  isCheckFor: null,
  isApproveFor: null,
  isEditTransDate: null,

  entryUserId: null,
  entryDate: null,
  updateBy: null,
  updateDate: null,

  checkBy: null,
  checkDate: null,
  approveBy: null,
  approveDate: null,

  isApproved: false,
  isCancel1: false,
  cancelBy: null,
  cancelDate: null,

  isDeleted: false,
  deleteDate: null,
  deleteBy: null,

  workFollowPosition: 0,
  isActive: true,
  isDisApprove: false,

  entryBy: null
};
