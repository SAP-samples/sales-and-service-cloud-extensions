export interface Employee {
  id: string;
  formattedName: string;
  displayId: string;
  // Add other fields as needed from the CNS API response
  email?: string;
  department?: string;
  position?: string;
}

export interface EmployeeApiResponse {
  value: Employee[];
}

export interface CNSTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}
