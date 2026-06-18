export interface Account {
  id: string;
  formattedName: string;
  displayId: string;
  // Add other fields as needed from the CNS API response
  email?: string;
  phone?: string;
  address?: string;
}

export interface AccountApiResponse {
  value: Account[];
}
