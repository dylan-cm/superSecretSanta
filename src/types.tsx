import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  NotFound: undefined;
  Details: { event: SSEvent };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type Person = {
  name: string;
  rcpt?: string;
  id: string;
  phone: string;
};

export type SSEvent = {
  drawn?: boolean;
  drawDate: Date;
  title: string;
  people: Person[];
  adminId: string;
};
