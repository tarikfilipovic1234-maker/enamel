import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

try {
  process.loadEnvFile();
} catch {
  /* env may already be set */
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const services = [
  {
    slug: "pregled-i-konsultacije",
    name: { bs: "Pregled i konsultacije", en: "Examination & consultation" },
    description: {
      bs: "Detaljan stomatološki pregled, dijagnostika i izrada plana terapije prilagođenog vama.",
      en: "A thorough dental examination, diagnostics and a tailored treatment plan.",
    },
    durationMin: 30,
    priceFrom: null,
    category: "Opća stomatologija",
    order: 1,
  },
  {
    slug: "profesionalno-ciscenje",
    name: { bs: "Profesionalno čišćenje zubi", en: "Professional teeth cleaning" },
    description: {
      bs: "Uklanjanje kamenca i mekih naslaga ultrazvukom uz poliranje za zdrav i svjež osmijeh.",
      en: "Ultrasonic scaling and polishing to remove tartar and plaque for a fresh, healthy smile.",
    },
    durationMin: 45,
    priceFrom: null,
    category: "Prevencija",
    order: 2,
  },
  {
    slug: "izbjeljivanje-zubi",
    name: { bs: "Izbjeljivanje zubi", en: "Teeth whitening" },
    description: {
      bs: "Sigurno i efikasno izbjeljivanje za vidljivo svjetliji osmijeh u samo jednoj posjeti.",
      en: "Safe, effective whitening for a visibly brighter smile in a single visit.",
    },
    durationMin: 60,
    priceFrom: null,
    category: "Estetska stomatologija",
    order: 3,
  },
  {
    slug: "zubni-implantati",
    name: { bs: "Zubni implantati", en: "Dental implants" },
    description: {
      bs: "Trajno i prirodno rješenje za nedostajuće zube uz vrhunske titanske implantate.",
      en: "A permanent, natural solution for missing teeth using premium titanium implants.",
    },
    durationMin: 90,
    priceFrom: null,
    category: "Implantologija",
    order: 4,
  },
  {
    slug: "ortodoncija-aligneri",
    name: { bs: "Ortodoncija i aligneri", en: "Orthodontics & aligners" },
    description: {
      bs: "Diskretno poravnanje zubi providnim alignerima ili klasičnim aparatićima.",
      en: "Discreet teeth alignment with clear aligners or classic braces.",
    },
    durationMin: 45,
    priceFrom: null,
    category: "Ortodoncija",
    order: 5,
  },
  {
    slug: "djecija-stomatologija",
    name: { bs: "Dječija stomatologija", en: "Pediatric dentistry" },
    description: {
      bs: "Nježan i strpljiv pristup najmlađim pacijentima u opuštajućem okruženju.",
      en: "A gentle, patient approach for our youngest patients in a relaxing setting.",
    },
    durationMin: 30,
    priceFrom: null,
    category: "Dječija stomatologija",
    order: 6,
  },
];

const staff = [
  {
    slug: "dr-adna-koso",
    name: "Dr. Adna Koso",
    title: {
      bs: "Vodeća doktorica, maksilofacijalna hirurgija",
      en: "Lead Doctor, Maxillofacial Surgery",
    },
    bio: {
      bs: "Vodeća doktorica poliklinike Enamel i specijalista maksilofacijalne hirurgije. Spaja vrhunsku hiruršku ekspertizu s nježnim pristupom svakom pacijentu.",
      en: "Lead doctor at Enamel and a specialist in maxillofacial surgery, combining top-tier surgical expertise with a gentle approach to every patient.",
    },
    specialties: ["Maksilofacijalna hirurgija", "Oralna hirurgija", "Implantologija"],
    order: 1,
  },
];

async function main() {
  console.log("Seeding…");

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  for (const m of staff) {
    const created = await prisma.staffMember.upsert({
      where: { slug: m.slug },
      update: { name: m.name, title: m.title, bio: m.bio, specialties: m.specialties, order: m.order },
      create: { ...m },
    });
    // Working hours: Mon–Fri 09:00–17:00, Sat 09:00–14:00
    const hours = [
      ...[1, 2, 3, 4, 5].map((d) => ({ dayOfWeek: d, startMin: 540, endMin: 1020 })),
      { dayOfWeek: 6, startMin: 540, endMin: 840 },
    ];
    for (const h of hours) {
      await prisma.workingHours.upsert({
        where: { staffId_dayOfWeek: { staffId: created.id, dayOfWeek: h.dayOfWeek } },
        update: { startMin: h.startMin, endMin: h.endMin },
        create: { staffId: created.id, ...h },
      });
    }
  }

  const author = await prisma.staffMember.findUnique({ where: { slug: "dr-adna-koso" } });
  await prisma.blogPost.upsert({
    where: { slug: "5-savjeta-za-zdrave-zube" },
    update: {},
    create: {
      slug: "5-savjeta-za-zdrave-zube",
      title: { bs: "5 savjeta za zdrave zube", en: "5 tips for healthy teeth" },
      excerpt: {
        bs: "Pet navika koje najviše utiču na to hoćete li razviti karijes i upalu desni.",
        en: "Five habits that most affect whether you develop decay and gum disease.",
      },
      body: {
        bs: "Većina problema sa zubima počinje tiho i godinama ne boli. Ovih pet navika najviše utiče na to hoćete li ih uopšte razviti.\n\n## 1. Perite zube dva puta dnevno, po dvije minute\n\nUjutro i prije spavanja, pastom sa fluoridom. Večernje pranje je važnije: preko noći se luči manje pljuvačke, pa naslage duže ostaju na zubima.\n\n## 2. Čistite i između zuba\n\nČetkica dolazi do oko tri petine površine zuba. Zubni konac ili interdentalna četkica jednom dnevno pokrivaju ostatak, gdje karijes i upala desni najčešće počinju.\n\n## 3. Nemojte ispirati usta vodom odmah nakon pranja\n\nSamo ispljunite višak paste. Ispiranje spere fluorid prije nego što stigne djelovati na caklinu.\n\n## 4. Pazite na učestalost slatkog i kiselog, ne samo na količinu\n\nSvaki slatki ili gazirani napitak pokreće kiseli period od oko pola sata. Jedan desert uz obrok manje šteti nego isti taj desert pojeden u pet navrata tokom dana.\n\n## 5. Krvarenje desni nije normalno\n\nDesni koje krvare pri pranju su znak upale, a ne znak da perete prejako. Ako krvarenje traje duže od sedmicu-dvije, javite se stomatologu.",
        en: "Most dental problems start quietly and stay painless for years. These five habits have the largest effect on whether you develop them at all.\n\n## 1. Brush twice a day, for two minutes\n\nMorning and last thing at night, with a fluoride toothpaste. The evening brush matters more: you produce less saliva overnight, so plaque sits on the teeth for longer.\n\n## 2. Clean between your teeth\n\nA brush reaches only about three fifths of each tooth surface. Floss or an interdental brush once a day covers the rest, which is where decay and gum inflammation usually begin.\n\n## 3. Do not rinse with water straight after brushing\n\nJust spit out the excess toothpaste. Rinsing washes the fluoride away before it has had a chance to act on the enamel.\n\n## 4. Watch how often you eat sugar and acid, not just how much\n\nEvery sugary or fizzy drink starts an acid period of roughly half an hour. One dessert with a meal does less damage than the same dessert spread across five moments in the day.\n\n## 5. Bleeding gums are not normal\n\nGums that bleed when you brush are a sign of inflammation, not a sign that you are brushing too hard. If the bleeding lasts more than a week or two, see a dentist.",
      },
      tags: ["prevencija", "savjeti"],
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: author?.id ?? null,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
