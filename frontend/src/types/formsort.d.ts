interface FormsortData {
  first_name: string;
  last_name: string;
  email_address: string;
  salesperson_selection: string[];
}

declare global {
  interface Window {
    formsortData?: FormsortData;
  }
}