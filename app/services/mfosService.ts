// app/services/mfosService.ts
import axios from "axios";
import { MfoDetails } from "./getMfoDetailsService";

export type RatingCategory = {
  value: number;
  label: string;
};

export type CreditRange = {
  from: number;
  to: number;
  currency?: string;
  unit?: string;
  formatted: string;
};

export type CreditOffer = {
  title: string;
  amount: CreditRange;
  term: CreditRange;
  rate: {
    value: number;
    formatted: string;
  };
  real_annual_rate: CreditRange;
};

export interface MfoCatalogOffer {
  id: number;
  client_type: "new" | "repeat";
  amount_from: number;
  amount_to: number;
  term_from: number;
  term_to: number;
  rate: number;
  real_annual_rate_from: number;
  real_annual_rate_to: number;
}
export type Mfo = {
  id: number;
  catalog_offers: MfoCatalogOffer[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tariffs: any[]
  slug: string;
  name: string;
  h1_title: string;
  meta_title: string;
  meta_description: string;
  legal_entity: string;
  nbu_license: string;
  rating_average: number;
  rating_count: number;
  rating_position: number;
  rating_trust_score: number;
  position: number;
  ratings: {
    speed: RatingCategory;
    conditions: RatingCategory;
    support: RatingCategory;
    website: RatingCategory;
  };
  logo_url: string;
  basic_characteristics: string;
  user_warning: string;
  get_money_button_url: string;
  official_website: string;
  redirect_url: string;
  website_url: string;
  apply_url: string;
  is_active: boolean;
  credit_offers: {
    new_client: CreditOffer;
    repeat_client: CreditOffer;
  };
  quick_info: {
    amount_range: string;
    term_range: string;
    rate: string;
    rpc_range: string;
  };
  created_at: string;
  updated_at: string;
};

export type MfoParams = {
  page?: number;
  per_page?: number;
  lang?: "uk" | "ru" | "en";
  amount?: number;
  term?: number;
  rate_max?: number;
  rating_min?: number;
  sort?: "rating" | "amount_asc" | "amount_desc" | "rate_asc" | "rate_desc";
  catalog_page?: string;
  type?: "credit" | "loan";
};

export const getMFOs = async (params: MfoParams = {}): Promise<MfoDetails[]> => {
  try {
    const response = await axios.get<{ data: MfoDetails[] }>(
      "https://mfo.webalchemy.fun/api/v1/mfos",
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error("getMFOs error:", error);
    throw new Error("Failed to fetch MFO list");
  }
};
