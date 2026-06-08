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
    priceFrom: 30,
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
    priceFrom: 60,
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
    priceFrom: 200,
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
    priceFrom: 900,
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
    priceFrom: 40,
    category: "Dječija stomatologija",
    order: 6,
  },
];

const staff = [
  {
    slug: "dr-amina-hadzic",
    name: "Dr. Amina Hadžić",
    title: { bs: "Doktorica dentalne medicine, osnivačica", en: "Doctor of Dental Medicine, Founder" },
    bio: {
      bs: "Sa preko 15 godina iskustva, dr. Hadžić predvodi tim Enamela s posvećenošću estetskoj i restaurativnoj stomatologiji.",
      en: "With over 15 years of experience, Dr. Hadžić leads the Enamel team with a dedication to aesthetic and restorative dentistry.",
    },
    specialties: ["Estetska stomatologija", "Implantologija"],
    order: 1,
  },
  {
    slug: "dr-tarik-begovic",
    name: "Dr. Tarik Begović",
    title: { bs: "Specijalista ortodoncije", en: "Orthodontics Specialist" },
    bio: {
      bs: "Stručnjak za poravnanje zubi i providne alignere, posvećen savršenom i funkcionalnom osmijehu.",
      en: "An expert in teeth alignment and clear aligners, devoted to perfect, functional smiles.",
    },
    specialties: ["Ortodoncija", "Aligneri"],
    order: 2,
  },
  {
    slug: "dr-lejla-kovac",
    name: "Dr. Lejla Kovač",
    title: { bs: "Doktorica dentalne medicine", en: "Doctor of Dental Medicine" },
    bio: {
      bs: "Topla i strpljiva, specijalizirana za dječiju i preventivnu stomatologiju.",
      en: "Warm and patient, specialized in pediatric and preventive dentistry.",
    },
    specialties: ["Dječija stomatologija", "Prevencija"],
    order: 3,
  },
];

const testimonials = [
  {
    patientName: "Selma A.",
    rating: 5,
    text: { bs: "Najbolje iskustvo kod stomatologa do sada. Ljubazno osoblje i bezbolan tretman!", en: "The best dental experience I've had. Kind staff and a painless treatment!" },
    service: "Izbjeljivanje zubi",
  },
  {
    patientName: "Damir H.",
    rating: 5,
    text: { bs: "Implantati su urađeni perfektno. Preporučujem svima u Sarajevu.", en: "The implants were done perfectly. I recommend them to everyone in Sarajevo." },
    service: "Zubni implantati",
  },
  {
    patientName: "Ena M.",
    rating: 5,
    text: { bs: "Moja djeca se više ne boje stomatologa. Hvala dr. Lejli!", en: "My kids are no longer afraid of the dentist. Thank you Dr. Lejla!" },
    service: "Dječija stomatologija",
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

  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    for (const tst of testimonials) {
      await prisma.testimonial.create({ data: { ...tst, status: "APPROVED" } });
    }
  }

  const author = await prisma.staffMember.findUnique({ where: { slug: "dr-amina-hadzic" } });
  await prisma.blogPost.upsert({
    where: { slug: "5-savjeta-za-zdrave-zube" },
    update: {},
    create: {
      slug: "5-savjeta-za-zdrave-zube",
      title: { bs: "5 savjeta za zdrave zube", en: "5 tips for healthy teeth" },
      excerpt: {
        bs: "Jednostavne navike koje čuvaju vaš osmijeh zdravim cijeli život.",
        en: "Simple habits that keep your smile healthy for life.",
      },
      body: {
        bs: "## Njega svaki dan\n\nPerite zube dva puta dnevno, koristite zubni konac i redovno posjećujte stomatologa.",
        en: "## Daily care\n\nBrush twice a day, floss daily, and visit your dentist regularly.",
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
