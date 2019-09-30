export interface UserInfoMessage {
  type: "user-info";
  data: {
    username: string;
    email: string;
  };
}
