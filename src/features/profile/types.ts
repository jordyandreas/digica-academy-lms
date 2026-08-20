export type StudentProfile = {
  full_name: string | null;
  phone: string | null;
  occupation: string | null;
  organization: string | null;
};

export type StudentProfileInput = {
  full_name: string;
  phone: string;
  occupation: string;
  organization: string;
};
