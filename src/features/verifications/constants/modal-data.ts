// Modal data for different verification types

export const MODAL_DATA = {
  github: {
    title: "Verify your GitHub account ownership",
    points: "0/6",
    time: "5-10 minutes",
    price: "Free",
    status: "Account Verification",
    achievements: [
      {
        title: "Verify GitHub Account Ownership",
        points: 6,
        description: "Connect and verify ownership of your GitHub account."
      }
    ],
    requirements: [
      "Must have an active GitHub account",
      "Account must be at least 30 days old",
      "Must have at least one public repository"
    ]
  },
  linkedin: {
    title: "Verify your LinkedIn account ownership",
    points: "0/6",
    time: "1-2 minutes",
    price: "Free",
    status: "Account Verification",
    achievements: [
      {
        title: "Verify LinkedIn Account Ownership",
        points: 6,
        description: "Connect and verify ownership of your LinkedIn account."
      }
    ],
    requirements: [
      "Must have an active LinkedIn account",
      "Profile must be public or have appropriate privacy settings",
      "Account must be at least 30 days old"
    ]
  },
  google: {
    title: "Verify your Google account ownership",
    points: "0/6",
    time: "< 1 minute",
    price: "Free",
    status: "Account Verification",
    achievements: [
      {
        title: "Verify Google Account Ownership",
        points: 6,
        description: "Connect and verify ownership of your Google account."
      }
    ],
    requirements: [
      "Must have an active Google account",
      "Account must be verified with Google"
    ]
  },
  discord: {
    title: "Verify that you own a Discord account",
    points: "0/6",
    time: "1-2 minutes",
    price: "Free",
    status: "Account Verification",
    achievements: [
      {
        title: "Verify Discord Account Ownership",
        points: 6,
        description: "Connect and verify ownership of your Discord account"
      }
    ],
    requirements: [
      "Must have an active Discord account",
      "Account must be at least 7 days old"
    ]
  }
} as const;

export const getModalData = (verificationId: string) => {
  return MODAL_DATA[verificationId as keyof typeof MODAL_DATA] || null;
};
