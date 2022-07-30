import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  phoneNumber: '',
  name: '',
  nickname: '',
  accessToken: '',
  photoURL: '',
  authority: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.phoneNumber = action.payload.phoneNumber;
      state.nickname = action.payload.nickname;
      state.photoURL = action.payload.photoURL;
      state.authority = action.payload.authority;
      // state.accessToken = action.payload.accessToken;
    },
    setTeacher(state, action) {
      state.phoneNumber = action.payload.phoneNumber;
      state.name = action.payload.name;
      // state.authority = action.payload.authority;
      // state.accessToken = action.payload.accessToken;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
    },
    setAuthority(state, action) {
      state.authority = action.payload.authority;
    },
    setProfile(state, action) {
      state.nickname = action.payload.nickname;
      // state.photoURL = action.payload.photoURL;
    },
    setPhoneNumber(state, action) {
      state.phoneNumber = action.payload.phoneNumber;
    },
    setPhotoURL(state, action) {
      state.photoURL = action.payload.photoURL;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
