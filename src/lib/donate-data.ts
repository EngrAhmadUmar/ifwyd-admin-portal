export type DonateSettings = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  currency: string;
  suggestedAmounts: string[];
  introText: string;
  acceptOnlinePayments: boolean;
  acceptBankTransfer: boolean;
};

export function getDefaultDonateSettings(): DonateSettings {
  return {
    bankName: "First Bank of Nigeria",
    accountName: "Ikra Foundation for Women & Youth Development",
    accountNumber: "3012345678",
    currency: "₦",
    suggestedAmounts: ["5,000", "10,000", "25,000", "50,000"],
    introText:
      "Your donation helps IFWYD run classrooms, skill acquisition programs, and outreach across Bauchi and beyond.",
    acceptOnlinePayments: true,
    acceptBankTransfer: true,
  };
}
