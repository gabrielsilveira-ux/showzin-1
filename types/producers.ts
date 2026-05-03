export interface CreateProducerRequest {
  name: string;
  documentNumber: string;
}

export interface UpdateProducerRequest {
  name: string;
  documentNumber: string;
  isActive: boolean;
}

export interface Producer {
  producerId: number;
  name: string | null;
  documentNumber: string | null;
  isActive: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProducersListResponse {
  producers: Producer[];
}
