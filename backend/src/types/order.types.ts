export enum EPayment {
  card = "card",
  online = "online",
}

export type TOrder = {
  payment: EPayment;
  email: string;
  phone: string;
  address: string;
  total: number | null;
  items: string[];
};
