export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Camera: undefined;
  Questionnaire: { photoUri?: string }; // update here
  Recommendation: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};