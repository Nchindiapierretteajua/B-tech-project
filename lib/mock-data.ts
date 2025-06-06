import type { Lesson, Quiz, Service } from "./types";

export const mockServices: Service[] = [
  {
    id: "national-id-registration",
    name: "National ID Card Registration",
    shortDescription:
      "Register for your National ID Card (Carte Nationale d'Identité)",
    description:
      "The National ID Card is an essential document for all Cameroonian citizens. This service helps you register for a new ID card or renew an expired one. Our step-by-step guide will walk you through the entire process, from gathering required documents to collecting your new ID card.",
    category: "legal",
    address: "Délégation Générale à la Sûreté Nationale, Yaoundé",
    area: "yaoundé-centre",
    phone: "+237 222 22 02 22",
    website: "https://www.dgsn.cm",
    hours: {
      Monday: "7:30 AM - 3:30 PM",
      Tuesday: "7:30 AM - 3:30 PM",
      Wednesday: "7:30 AM - 3:30 PM",
      Thursday: "7:30 AM - 3:30 PM",
      Friday: "7:30 AM - 3:30 PM",
      Saturday: "Closed",
      Sunday: "Closed",
    },
    requirements: [
      "Birth certificate (original)",
      "Certificate of nationality (original)",
      "4 passport-sized photos",
      "Proof of residence",
      "Application fee (CFA 2,800)",
    ],
    tags: ["identity", "government", "documentation", "citizenship"],
    featured: true,
    colorScheme: "blue",
    icon: "🪪",
    accessibility: true,
    onlineAvailable: false,
    steps: [
      {
        title: "Gather Required Documents",
        description:
          "Collect all necessary documents including your birth certificate, certificate of nationality, and passport photos.",
        tips: [
          "Ensure your birth certificate is an original or certified copy",
          "Photos should be recent and with white background",
        ],
        documents: [
          "Birth certificate",
          "Certificate of nationality",
          "4 passport photos",
        ],
      },
      {
        title: "Visit the Police Station",
        description:
          "Go to your nearest police station or ID card issuance center with all your documents.",
        tips: [
          "Arrive early to avoid long queues",
          "Some centers are less crowded than others",
        ],
      },
      {
        title: "Submit Application",
        description:
          "Fill out the application form and submit it along with your documents and payment.",
        documents: ["Completed application form", "Payment receipt"],
      },
      {
        title: "Biometric Data Collection",
        description: "Have your fingerprints and photo taken for the ID card.",
        tips: [
          "Wear formal attire for the photo",
          "Ensure your hands are clean for fingerprinting",
        ],
      },
      {
        title: "Collect Your ID Card",
        description:
          "Return to collect your ID card on the specified date (usually 1-3 months after application).",
        tips: [
          "Bring your application receipt",
          "You may need to check if your card is ready before going",
        ],
      },
    ],
  },
  {
    id: "drivers-license-application",
    name: "Driver's License Application",
    shortDescription:
      "Apply for a new driver's license or renew an existing one",
    description:
      "Our driver's license application service helps Cameroonian citizens obtain or renew their driving permits. We guide you through the entire process, from registration at a driving school to collecting your license from the Ministry of Transport.",
    category: "transportation",
    address: "Ministry of Transport, Douala Branch, Akwa",
    area: "douala-akwa",
    phone: "+237 233 42 01 11",
    website: "https://www.mint.gov.cm",
    hours: {
      Monday: "7:30 AM - 3:30 PM",
      Tuesday: "7:30 AM - 3:30 PM",
      Wednesday: "7:30 AM - 3:30 PM",
      Thursday: "7:30 AM - 3:30 PM",
      Friday: "7:30 AM - 3:30 PM",
      Saturday: "Closed",
      Sunday: "Closed",
    },
    requirements: [
      "National ID Card (original and copy)",
      "Birth certificate (copy)",
      "Medical certificate (less than 3 months old)",
      "4 passport-sized photos",
      "Driving school certificate (for new applications)",
      "Application fee (varies by category)",
    ],
    tags: ["driving", "license", "transportation", "permit"],
    featured: true,
    colorScheme: "green",
    icon: "🚗",
    accessibility: true,
    onlineAvailable: false,
    steps: [
      {
        title: "Register at a Driving School",
        description:
          "For new licenses, enroll in an accredited driving school for training and certification.",
        tips: [
          "Choose a school with good reputation and pass rates",
          "Expect to spend at least 1-2 months in training",
        ],
      },
      {
        title: "Obtain Medical Certificate",
        description:
          "Visit an approved medical center to get a certificate confirming you are fit to drive.",
        documents: ["National ID Card", "Payment for medical examination"],
      },
      {
        title: "Submit Application",
        description:
          "Go to the Ministry of Transport office with all required documents to submit your application.",
        documents: [
          "National ID Card",
          "Birth certificate",
          "Medical certificate",
          "Driving school certificate (for new applications)",
          "4 passport photos",
        ],
      },
      {
        title: "Take Driving Test",
        description:
          "For new licenses, take the theoretical and practical driving tests administered by the Ministry.",
        tips: [
          "Study the highway code thoroughly",
          "Practice driving in various conditions",
        ],
      },
      {
        title: "Pay Fees and Collect License",
        description:
          "Pay the required fees and collect your driver's license on the specified date.",
        tips: [
          "Bring your application receipt",
          "The process may take 1-3 months to complete",
        ],
      },
    ],
  },
  {
    id: "healthcare-enrollment",
    name: "Universal Health Coverage Registration",
    shortDescription:
      "Register for Cameroon's Universal Health Coverage program",
    description:
      "Our healthcare enrollment service helps Cameroonian citizens register for the Universal Health Coverage program. This program provides access to essential healthcare services at reduced costs. We guide you through the registration process and help you understand your benefits.",
    category: "health",
    address: "Ministry of Public Health, Yaoundé",
    area: "yaoundé-centre",
    phone: "+237 222 22 01 80",
    website: "https://www.minsante.cm",
    hours: {
      Monday: "7:30 AM - 3:30 PM",
      Tuesday: "7:30 AM - 3:30 PM",
      Wednesday: "7:30 AM - 3:30 PM",
      Thursday: "7:30 AM - 3:30 PM",
      Friday: "7:30 AM - 3:30 PM",
      Saturday: "Closed",
      Sunday: "Closed",
    },
    requirements: [
      "National ID Card (original and copy)",
      "Birth certificate (for dependents)",
      "Proof of residence",
      "Recent passport-sized photos",
      "Registration fee",
    ],
    tags: ["healthcare", "insurance", "medical", "enrollment"],
    featured: true,
    colorScheme: "red",
    icon: "🏥",
    accessibility: true,
    onlineAvailable: true,
    steps: [
      {
        title: "Check Eligibility",
        description:
          "Verify that you and your family members are eligible for the Universal Health Coverage program.",
        tips: [
          "All Cameroonian citizens are eligible",
          "Different contribution rates apply based on income",
        ],
      },
      {
        title: "Gather Required Documents",
        description:
          "Collect all necessary documentation for yourself and any dependents you wish to register.",
        documents: [
          "National ID Card",
          "Birth certificates for children",
          "Marriage certificate (if applicable)",
          "Proof of residence",
        ],
      },
      {
        title: "Complete Registration Form",
        description:
          "Fill out the registration form with accurate information about yourself and your dependents.",
        tips: [
          "Forms are available at local health centers or online",
          "Ensure all information matches your official documents",
        ],
      },
      {
        title: "Pay Contribution",
        description:
          "Pay your initial contribution based on your income category.",
        tips: [
          "Payments can be made at designated banks or via mobile money",
          "Keep your payment receipt as proof of enrollment",
        ],
      },
      {
        title: "Receive Health Insurance Card",
        description:
          "Collect your Universal Health Coverage card which you'll present when seeking healthcare services.",
        tips: [
          "Processing may take 2-4 weeks",
          "You can check the status of your application online",
        ],
      },
    ],
  },
  {
    id: "business-registration",
    name: "Business Registration Service",
    shortDescription:
      "Register your business with the Cameroon Business Creation Center",
    description:
      "Our business registration service helps entrepreneurs register their businesses with the Cameroon Business Creation Center (CFCE). We guide you through the entire process, from choosing a business structure to obtaining your business registration certificate.",
    category: "financial",
    address: "CFCE Headquarters, Bonanjo, Douala",
    area: "douala-bonanjo",
    phone: "+237 233 43 31 80",
    website: "https://www.cfce.cm",
    hours: {
      Monday: "7:30 AM - 3:30 PM",
      Tuesday: "7:30 AM - 3:30 PM",
      Wednesday: "7:30 AM - 3:30 PM",
      Thursday: "7:30 AM - 3:30 PM",
      Friday: "7:30 AM - 3:30 PM",
      Saturday: "Closed",
      Sunday: "Closed",
    },
    requirements: [
      "National ID Card of business owner(s)",
      "Business plan",
      "Articles of association (for companies)",
      "Proof of address for business premises",
      "Initial capital deposit certificate",
      "Registration fees",
    ],
    tags: ["business", "entrepreneurship", "registration", "financial"],
    featured: false,
    colorScheme: "purple",
    icon: "🏢",
    accessibility: true,
    onlineAvailable: true,
    steps: [
      {
        title: "Choose Business Structure",
        description:
          "Decide on the legal structure for your business (sole proprietorship, LLC, SA, etc.).",
        tips: [
          "Different structures have different tax implications",
          "Consult with a business advisor if unsure",
        ],
      },
      {
        title: "Prepare Documentation",
        description:
          "Gather all required documents based on your chosen business structure.",
        documents: [
          "National ID Card",
          "Business plan",
          "Articles of association (for companies)",
          "Proof of address",
        ],
      },
      {
        title: "Deposit Initial Capital",
        description:
          "For companies, deposit the initial capital in a bank and obtain a deposit certificate.",
        tips: [
          "Minimum capital requirements vary by business type",
          "Some banks offer special accounts for business registration",
        ],
      },
      {
        title: "Submit Application to CFCE",
        description:
          "Visit the CFCE office with all your documents to submit your application.",
        tips: [
          "The one-stop-shop process simplifies registration",
          "You can track your application status online",
        ],
      },
      {
        title: "Receive Registration Documents",
        description:
          "Collect your business registration certificate, tax ID, and other official documents.",
        tips: [
          "Processing typically takes 72 hours",
          "Make copies of all official documents for your records",
        ],
      },
    ],
  },
  {
    id: "scholarship-application",
    name: "Government Scholarship Application",
    shortDescription: "Apply for government scholarships for higher education",
    description:
      "Our scholarship application service helps Cameroonian students apply for government scholarships for higher education, both locally and internationally. We provide guidance on eligibility requirements, application procedures, and documentation needed.",
    category: "education",
    address: "Ministry of Higher Education, Yaoundé",
    area: "yaoundé-centre",
    phone: "+237 222 22 51 00",
    website: "https://www.minesup.gov.cm",
    hours: {
      Monday: "7:30 AM - 3:30 PM",
      Tuesday: "7:30 AM - 3:30 PM",
      Wednesday: "7:30 AM - 3:30 PM",
      Thursday: "7:30 AM - 3:30 PM",
      Friday: "7:30 AM - 3:30 PM",
      Saturday: "Closed",
      Sunday: "Closed",
    },
    requirements: [
      "National ID Card",
      "Academic transcripts and certificates",
      "Admission letter from university (if applicable)",
      "Recommendation letters",
      "Motivation letter",
      "Passport-sized photos",
    ],
    tags: ["education", "scholarship", "university", "financial aid"],
    featured: false,
    colorScheme: "yellow",
    icon: "🎓",
    accessibility: true,
    onlineAvailable: true,
    steps: [
      {
        title: "Check Eligibility and Available Scholarships",
        description:
          "Research available government scholarships and verify that you meet the eligibility criteria.",
        tips: [
          "Different scholarships have different requirements",
          "Some scholarships are specific to certain fields of study",
        ],
      },
      {
        title: "Prepare Academic Documents",
        description:
          "Gather all your academic records, including transcripts, certificates, and diplomas.",
        documents: [
          "GCE O/L and A/L certificates or Baccalauréat",
          "University transcripts (if applicable)",
          "Other academic achievements",
        ],
      },
      {
        title: "Obtain Recommendation Letters",
        description:
          "Request recommendation letters from teachers, professors, or employers who can vouch for your academic abilities.",
        tips: [
          "Ask recommenders well in advance",
          "Provide them with information about your achievements and goals",
        ],
      },
      {
        title: "Write Motivation Letter",
        description:
          "Compose a compelling motivation letter explaining why you deserve the scholarship and how it aligns with your career goals.",
        tips: [
          "Be specific about your academic and career objectives",
          "Highlight your achievements and community involvement",
        ],
      },
      {
        title: "Submit Application",
        description:
          "Submit your complete application package before the deadline.",
        tips: [
          "Keep copies of all submitted documents",
          "Follow up on your application status regularly",
        ],
      },
    ],
  },
];

export const MOCK_PROVIDER_LESSONS: Lesson[] = [
  {
    id: "national-id",
    title: "How to Apply for a National ID Card",
    category: "Documentation & ID",
    difficulty: "Beginner",
    duration: "15 min",
    createdAt: "2023-10-15",
    status: "Published",
  },
  {
    id: "tax-registration",
    title: "Tax Registration Process",
    category: "Taxes & Finance",
    difficulty: "Intermediate",
    duration: "20 min",
    createdAt: "2023-10-10",
    status: "Draft",
  },
  {
    id: "voting-rights",
    title: "Understanding Your Voting Rights",
    category: "Citizenship & Rights",
    difficulty: "Beginner",
    duration: "10 min",
    createdAt: "2023-09-28",
    status: "Published",
  },
];

export const MOCK_PROVIDER_QUIZZES: Quiz[] = [
  {
    id: "national-id-quiz",
    title: "National ID Card Quiz",
    category: "Documentation & ID",
    difficulty: "Beginner",
    questions: 5,
    createdAt: "2023-10-15",
    status: "Published",
  },
  {
    id: "tax-system-quiz",
    title: "Tax System Quiz",
    category: "Taxes & Finance",
    difficulty: "Advanced",
    questions: 12,
    createdAt: "2023-10-10",
    status: "Draft",
  },
  {
    id: "citizenship-rights-quiz",
    title: "Citizenship Rights Quiz",
    category: "Citizenship & Rights",
    difficulty: "Beginner",
    questions: 10,
    createdAt: "2023-09-28",
    status: "Published",
  },
];

export const MOCK_ALL_LESSONS = [
  {
    id: "national-id",
    title: "How to Apply for a National ID Card",
    category: "documentation",
    categoryName: "Documentation & ID",
    difficulty: "Beginner",
    duration: "15 min",
    description: "Learn the step-by-step process...",
  },
  {
    id: "tax-registration",
    title: "Tax Registration Process",
    category: "taxes",
    categoryName: "Taxes & Finance",
    difficulty: "Intermediate",
    duration: "20 min",
    description: "Understand how to register for taxes...",
  },
  {
    id: "voting-rights",
    title: "Understanding Your Voting Rights",
    category: "citizenship",
    categoryName: "Citizenship & Rights",
    difficulty: "Beginner",
    duration: "10 min",
    description: "Learn about your voting rights...",
  },
  {
    id: "business-registration",
    title: "How to Register a Business",
    category: "financial",
    categoryName: "Taxes & Finance",
    difficulty: "Advanced",
    duration: "30 min",
    description: "A comprehensive guide to registering...",
  },
  {
    id: "healthcare-system",
    title: "Navigating the Healthcare System",
    category: "health",
    categoryName: "Healthcare System",
    difficulty: "Intermediate",
    duration: "25 min",
    description: "Learn how to access healthcare...",
  },
  // Add more from the original example...
  {
    id: "education-scholarships",
    title: "Applying for Government Scholarships",
    category: "education",
    categoryName: "Education System",
    difficulty: "Intermediate",
    duration: "20 min",
    description: "A guide to finding and applying...",
  },
  {
    id: "passport-application",
    title: "Passport Application Process",
    category: "documentation",
    categoryName: "Documentation & ID",
    difficulty: "Beginner",
    duration: "15 min",
    description: "Step-by-step guide to applying...",
  },
  {
    id: "legal-aid",
    title: "Accessing Legal Aid Services",
    category: "legal",
    categoryName: "Legal System",
    difficulty: "Intermediate",
    duration: "20 min",
    description: "Learn how to access legal aid...",
  },
];

export const MOCK_ALL_QUIZZES = [
  // Ensure data structure matches QuizSummary interface in QuizCard
  {
    id: "citizenship-rights",
    title: "Citizenship Rights Quiz",
    category: "citizenship",
    categoryName: "Citizenship & Rights",
    difficulty: "Beginner",
    questions: 10,
    description: "Test your knowledge about citizen rights...",
    completed: true,
    score: 80,
  },
  {
    id: "documentation-procedures",
    title: "Documentation Procedures Quiz",
    category: "documentation",
    categoryName: "Documentation & ID",
    difficulty: "Intermediate",
    questions: 8,
    description: "Test your knowledge about official document...",
    completed: false,
    score: null,
  },
  {
    id: "tax-system",
    title: "Tax System Quiz",
    category: "taxes",
    categoryName: "Taxes & Finance",
    difficulty: "Advanced",
    questions: 12,
    description: "Test your understanding of the Cameroonian tax system...",
    completed: false,
    score: null,
  },
  // Add more...
  {
    id: "national-id",
    title: "National ID Card Quiz",
    category: "documentation",
    categoryName: "Documentation & ID",
    difficulty: "Beginner",
    questions: 5,
    description: "Test your knowledge about the National ID...",
    completed: false,
    score: null,
  },
];

export const MOCK_QUIZZES_DB: { [key: string]: any } = {
  "national-id": {
    id: "national-id",
    title: "National ID Card Quiz",
    description: "Test your knowledge...",
    points: 100,
    passingScore: 70,
    badge: {
      id: "id-master",
      name: "ID Master",
      icon: "🏆",
      description: "Passed the National ID Card quiz...",
    },
    questions: [
      {
        question: "What is the application fee...?",
        options: ["CFA 1,500", "CFA 2,800", "CFA 5,000", "CFA 10,000"],
        correctAnswer: 1,
        explanation: "The fee is CFA 2,800.",
      },
      {
        question: "Which document is NOT required...?",
        options: [
          "Birth certificate",
          "Certificate of nationality",
          "Passport",
          "Proof of residence",
        ],
        correctAnswer: 2,
        explanation: "A passport is not required...",
      },
      {
        question: "How many photos are needed...?",
        options: ["2 photos", "3 photos", "4 photos", "5 photos"],
        correctAnswer: 2,
        explanation: "You need 4 photos...",
      },
      {
        question: "Where can you apply...?",
        options: [
          "Only central office...",
          "Only municipal offices",
          "Local police stations or ID centers",
          "Only embassies...",
        ],
        correctAnswer: 2,
        explanation: "Apply at local police stations or ID centers.",
      },
      {
        question: "How long to receive ID...?",
        options: ["1-2 weeks", "1-3 months", "6-12 months", "2-3 years"],
        correctAnswer: 1,
        explanation: "Typically 1-3 months.",
      },
    ],
  },
  "citizenship-rights": {
    /* ... more quiz data ... */
  },
  "documentation-procedures": {
    /* ... more quiz data ... */
  },
};

// -----------------------------------------------------------------
// Example structure within user object or fetched separately
interface UserLearningProgress {
  totalPoints: number;
  completedLessonIds: string[];
  completedQuizzes: {
    // Store quiz ID and best score
    [quizId: string]: number; // e.g., { "national-id-quiz": 80, "education-system-quiz": 90 }
  };
  earnedBadgeIds: string[];
}

// Example mock user progress
export const mockUserLearning: UserLearningProgress = {
  totalPoints: 130, // Example total
  completedLessonIds: ["national-id", "voting-rights"],
  completedQuizzes: {
    "citizenship-rights": 80,
    "education-system": 90,
    // "national-id-quiz": 60, // Example failed score (might not count for badges)
  },
  earnedBadgeIds: ["id-expert", "citizen-aware"], // Assuming these IDs exist
};

// Assume we have access to the full lesson/quiz/badge definitions somewhere
// (like MOCK_LESSONS_DB, MOCK_ALL_QUIZZES from previous steps, plus badge definitions)

// Mock Badge Definitions (align with previous examples)
export const MOCK_BADGES_DB: {
  [key: string]: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
} = {
  "id-expert": {
    id: "id-expert",
    name: "ID Expert",
    icon: "🪪",
    description: "Completed the National ID Card lesson",
  },
  "id-master": {
    id: "id-master",
    name: "ID Master",
    icon: "🏆",
    description: "Passed the National ID Card quiz...",
  },
  "citizen-aware": {
    id: "citizen-aware",
    name: "Citizen Aware",
    icon: "🏛️",
    description: "Knows their rights!",
  },
  // Add more badges...
};

// Mock Lesson Titles (align with previous examples)
export const MOCK_LESSON_TITLES: { [key: string]: string } = {
  "national-id": "How to Apply for a National ID Card",
  "voting-rights": "Understanding Your Voting Rights",
  "tax-registration": "Tax Registration Process",
};

// Mock Quiz Titles (align with previous examples)
export const MOCK_QUIZ_TITLES: { [key: string]: string } = {
  "citizenship-rights": "Citizenship Rights Quiz",
  "education-system": "Education System Quiz",
  "national-id-quiz": "National ID Card Quiz",
  "documentation-procedures": "Documentation Procedures Quiz",
};
