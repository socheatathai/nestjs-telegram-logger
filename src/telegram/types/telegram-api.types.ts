export type TelegramApiResponse<T> = {
  ok: boolean;
  result?: T;
  description?: string;
};

export type TelegramChat = {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

export type TelegramUpdate = {
  update_id: number;
  message?: {
    chat?: TelegramChat;
  };
  my_chat_member?: {
    chat?: TelegramChat;
  };
};
