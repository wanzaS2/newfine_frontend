export interface classAttendance {
  createdDate: string;
  modifiedDate: string;
  attendanceId: number;
  url: string;
  course: {
    school: string;
    subject: string;
    subjectType: string;
    teacher: {
      tid: number;
      tpassword: string;
      tname: string;
      tphoneNumber: string;
    };
    cid: number;
    cname: string;
  };
}
