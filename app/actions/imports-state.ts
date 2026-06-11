export type ImportActionState =
  | {
      status: "idle";
      message: "";
      details?: never;
    }
  | {
      status: "success" | "error";
      message: string;
      details?: string[];
    };

export const initialImportActionState: ImportActionState = {
  status: "idle",
  message: "",
};

