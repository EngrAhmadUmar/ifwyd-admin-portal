export type SettingsState = {
  brand: {
    orgName: string;
    tagline: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  application: {
    acceptVolunteerApplications: boolean;
    acceptRegistrations: boolean;
    maintenanceMode: boolean;
    newsletterSignup: boolean;
  };
};

export function getDefaultSettings(): SettingsState {
  return {
    brand: {
      orgName: "Ikra Foundation for Women & Youth Development",
      tagline: "Empowering women and youth across Nigeria",
      contactEmail: "info@ifwyd.org",
      contactPhone: "+234 810 000 0000",
      address: "Bauchi, Nigeria",
    },
    social: {
      facebook: "https://facebook.com/ifwyd",
      instagram: "https://instagram.com/ifwyd",
      twitter: "https://twitter.com/ifwyd",
      linkedin: "https://linkedin.com/company/ifwyd",
    },
    application: {
      acceptVolunteerApplications: true,
      acceptRegistrations: true,
      maintenanceMode: false,
      newsletterSignup: true,
    },
  };
}
