export type PushMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
};
