// apps/web/src/pages/MarketplacePage.tsx

// Mock data for the judges. In a real app, this would come from an API.
const judges = [
  {
    name: "Judge Alex",
    specialty:
      "Expert in blockchain and decentralized technologies. 10+ years of experience in software development.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDuT16JxpgyPDzmIrx6Xot0Ekk45HLdZE9pBjucno3hycECPRz0y8N9Yt3XmziiACfgfdGRfmG4KSMcD7UlVpw1ArCFVzA9SpL7w23CkcI_SQmtOGFO4ooVBjgiqRR72yiUxITyAoSvYaINsvYqBqEOHa1yKafNdGQoZcI1CONCDqBuaIAI1OiF0a_QKQM-KoPgZsfsjjeEVqsDpbG5H5VtdQBdQHdHxMRv28p1Atmf3aGkKKFoEYBNBPrPUR0esFzlCIaPnmqVbdc",
    status: "Available",
  },
  {
    name: "Judge Sarah",
    specialty:
      "Specialist in UI/UX design and user-centric product development. 8+ years of experience in design.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBltMTC_dPks7XyM7PCfrcE__sBzpt8pl7En-JcId7DEUvOiEXZUSm00ZYJO3UFtv6pc7lUPwzGt1jvVHLXiqvo5Ug_3ZIkNhCwDpCxv4bckRMMlyApAb6khz-kQMqsZcj-fA5ExRpLJo_Oqh644IEOF2PzytEYcMJK7BKj0cO4CdvWZBKJ0Mhw3D0V5xyRQMAlXwD40vb2SR6KEEHLq4p5wsqhbDMJkGtiDaB-k4YsLJcB00m8139eKyOkoYI6RqRPOh6tAj7GrGo",
    status: "Available",
  },
  {
    name: "Judge David",
    specialty:
      "Experienced in AI and machine learning applications. 12+ years of experience in data science.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4Zqul7WOeek3pmrzfeCOOtBbQ3oIHc2e6XFftOD2uQ4DaGez6A9PYmQF89VKwHoDxX9y_AsAu8JgF7wx0X9pzE3itcskwPrmttZfQYGr8ugylH8m43IEF39G2JY60RrEAO3nP6c6wpgTtMkYVoeFXTrsaktCTKK--F7Or1Sn2DPYCfMrDJvkpMbnrHsnepKXWE4A2yXxg426CwYxJJzkLCI_IDzuRsf0_nPBJ3mzEw-zU3AmUXytUk40LVGypPugj5Euae1BbRrY",
    status: "Available",
  },
  // Add more judges if needed
];

// A reusable component for each judge card
const JudgeCard = ({ judge }: { judge: (typeof judges)[0] }) => {
  return (
    <div className="grid grid-cols-1 items-start gap-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/5 p-6 md:grid-cols-3">
      <div
        className="h-48 w-full rounded-lg bg-cover bg-center md:h-full"
        style={{ backgroundImage: `url("${judge.imageUrl}")` }}
      ></div>
      <div className="flex flex-col justify-between gap-4 md:col-span-2 h-full">
        <div>
          <span className="text-sm font-medium text-primary">
            {judge.status}
          </span>
          <h3 className="mt-1 text-2xl font-bold text-black dark:text-white">
            {judge.name}
          </h3>
          <p className="mt-2 text-black/60 dark:text-white/60">
            {judge.specialty}
          </p>
        </div>
        <div className="mt-4">
          <button className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:w-auto">
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export function MarketplacePage() {
  return (
    <div className="container mx-auto">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-black dark:text-white sm:text-5xl">
            Available Judges
          </h1>
          <p className="mt-4 text-lg text-black/60 dark:text-white/60">
            Browse and select INFT judges for your hackathon. Purchase or
            authorize judging capacity as needed.
          </p>
        </div>
        <div className="grid gap-8">
          {judges.map((judge, index) => (
            <JudgeCard key={index} judge={judge} />
          ))}
        </div>
      </div>
    </div>
  );
}
