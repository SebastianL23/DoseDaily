declare module 'coinbase-commerce-node' {
  export class Client {
    static init(apiKey: string): void;
  }

  export namespace resources {
    export class Charge {
      static create(params: {
        name: string;
        description: string;
        local_price: {
          amount: string;
          currency: string;
        };
        pricing_type: string;
        metadata: {
          product_id: string;
        };
        redirect_url: string;
        cancel_url: string;
      }): Promise<{
        hosted_url: string;
      }>;
    }
  }
} 