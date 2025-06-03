import Shippo from 'shippo'

declare module 'shippo' {
  interface ShippoAddress {
    name?: string;
    company?: string;
    street1: string;
    street2?: string;
    city: string;
    state?: string;
    zip: string;
    country: string;
    phone?: string;
    email?: string;
    is_residential?: boolean;
    metadata?: string;
  }

  interface ShippoResponse {
    object_id: string;
    validation_results?: {
      is_valid: boolean;
    };
  }

  interface ShippoClient {
    address: {
      create: (address: ShippoAddress) => Promise<ShippoResponse>;
    };
  }

  function Shippo(token: string): ShippoClient;
  export = Shippo;
}

declare module 'shippo';
