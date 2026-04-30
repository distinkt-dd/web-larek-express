const Status = {
  card: "card",
  online: "online",
};

export type EPayment = typeof Status[keyof typeof Status];

export type TOrder = {
  payment: EPayment;
  email: string;
  phone: string;
  address: string;
  total: number | null;
  items: string[];
};
