import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//type 만들어주기
export interface course {
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
}

// interface InitialState {
//     courses : course[];
// }
// const initialState: InitialState = {
//     courses: [],
//
// };
// const courseSlice = createSlice({
//   name: 'course',
//   initialState,
//     reducers : {
//       // 미리 reducer 로 만들어놓고 action 으로 dispatch
//       addCourse(state,action: PayloadAction<TeacherCourse>){
//           state.courses.push(action.payload);
//       },
//
//     },
//     extraReducers: builder => {};
// });
