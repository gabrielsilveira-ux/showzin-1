export interface CreateLocalizationRequest {
  name: string;
  zipCode: string;
  address: string;
  cityId: number;
}

export interface UpdateLocalizationRequest {
  name: string;
  zipCode: string;
  address: string;
  cityId: number;
  isActive: boolean;
}

export interface LocalizationRaw {
  localizationId: number;
  name: string | null;
  zipCode: string | null;
  address: string | null;
  localizationsCities: { name: string | null } | null;
}

export interface LocalizationListItem {
  localizationId: number;
  name: string | null;
  zipCode: string | null;
  address: string | null;
  city: string | null;
}

export interface LocalizationsListResponse {
  localizations: LocalizationListItem[];
}

export interface LocalizationDetails {
  localizationId: number;
  name: string | null;
  zipCode: string | null;
  address: string | null;
  cityId: number | null;
  isActive: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  localizationsCities: {
    name: string | null;
  } | null;
}
