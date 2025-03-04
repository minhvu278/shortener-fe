// Khai báo module cho PayPal SDK
declare global {
  interface Window {
    paypal: {
      Buttons: (options: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }, actions: any) => Promise<void>;
        onError?: (err: any) => void;
      }) => {
        render: (container: string) => void;
      };
    };
  }
}

export {};