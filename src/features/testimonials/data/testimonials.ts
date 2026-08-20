export type TestimonialQA = {
  question: string;
  answer: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  batchLabel: string;
  storyNumber: number;
  photo: string;
  highlight: string;
  quote: string;
  qa: TestimonialQA[];
  tipsQuestion?: string;
  tips?: string;
  /** Short success copy when there is no interview Q&A */
  storyParagraphs?: string[];
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "keisha",
    name: "Keisha Aimee Puteri",
    role: "Data Analyst",
    company: "Jago",
    companyLogo: "/images/companies/jago.svg",
    batchLabel: "Alumni Batch 1 Digica Data Science Bootcamp",
    storyNumber: 1,
    photo: "/images/testimonials/keisha.png",
    highlight: "Sukses menjadi Data Analyst di Jago",
    quote:
      "Belajar skill Data Science sambil ngerjain skripsi, sekaligus mengasah problem solving lewat real-world case project.",
    qa: [
      {
        question:
          "Waktu ikut Digica Data Science Bootcamp, apa tujuan utama yang pengen kamu capai?",
        answer:
          "Tujuan utama aku waktu itu adalah belajar skill Data Science sambil ngerjain skripsi, sekaligus mengasah kemampuan problem solving lewat real-world case project.",
      },
      {
        question:
          "Hal apa yang paling membantu dari Digica selama proses belajar Data Science?",
        answer:
          "Menurutku di Digica, yang paling membantu itu cara belajarnya. Kelasnya engaging, interaktif, dan insight yang dikasih juga ga cuma textbook knowledge, tapi banyak sharing pengalaman langsung juga dari instruktur dan mentor.",
      },
      {
        question: "Materi atau sesi mana yang paling kerasa dampaknya buat kamu?",
        answer:
          "Materi yang paling kerasa dampaknya adalah bagian business implementation. Karena di situ ga cuma belajar melakukan analisis & modeling, tapi juga belajar bagaimana hasilnya bisa dihubungkan ke sisi bisnis dan membantu business users dalam mengambil keputusan.",
      },
      {
        question:
          "Skill dari Digica yang paling kepakai waktu proses interview sampai akhirnya keterima di Jago apa?",
        answer:
          "Logical thinking dan problem solving yang dilatih lewat assignment dan project. Selain itu, proses berpikir dalam mengerjakan project dan bagaimana mengaitkannya dengan masalah yang ingin diselesaikan, termasuk impact dan end result nya juga sangat kepakai.",
      },
    ],
    tipsQuestion:
      "Ada tips & saran buat teman-teman yang lagi mau mulai belajar data science atau data analytics?",
    tips:
      "Saranku adalah selain fokus belajar coding/technical skills, akan jauh lebih impactful kalau dibarengin dengan belajar bagaimana bisnis itu bekerja dan apa sebenarnya inti permasalahan yang ingin kita bantu selesaikan. Karena bekerja dengan data ga cuma soal teknis, tapi juga soal bagaimana menerjemahkan data jadi insight yang meaningful dan bisa bantu menyelesaikan real-world problems. Dengan belajar di Digica Bootcamp, bisa banget jadi cara belajar bekerja langsung dengan data secara teknis dan pemahaman bisnis.",
  },
  {
    id: "darren",
    name: "Darren",
    role: "Data Scientist",
    company: "DANA",
    companyLogo: "/images/companies/dana.svg",
    batchLabel: "Alumni Batch 2 Digica Data Science Bootcamp",
    storyNumber: 2,
    photo: "/images/testimonials/darren-story.jpg",
    highlight: "Sukses menjadi Data Scientist di DANA",
    quote:
      "Nge-build fondasi modeling dan problem solving end-to-end, supaya siap apply ke role Data Scientist setelah lulus.",
    qa: [
      {
        question:
          "Waktu ikut Digica Data Science Bootcamp, apa tujuan utama yang pengen kamu capai?",
        answer:
          "Tujuan utama aku waktu itu adalah nge-build fondasi Data Science yang lebih dalam—terutama modeling dan cara ngerjain problem end-to-end—supaya siap apply ke role Data Scientist setelah lulus. Aku pengen skill-nya kebawa ke kerjaan beneran, bukan cuma teori di kampus.",
      },
      {
        question:
          "Hal apa yang paling membantu dari Digica selama proses belajar Data Science?",
        answer:
          "Yang paling ngebantu itu feedback dari mentor di assignment dan project. Kita ga cuma disuruh bikin model yang akurasinya tinggi, tapi juga harus bisa jelasin kenapa approach-nya masuk akal, apa limitasinya, dan hasilnya bisa dipakai orang lain.",
      },
      {
        question: "Materi atau sesi mana yang paling kerasa dampaknya buat kamu?",
        answer:
          "Bagian modeling dan evaluation. Di situ kerasa banget bedanya belajar di bootcamp vs belajar sendiri: kita dilatih milih metric yang tepat, ngecek asumsi, dan ga langsung percaya ke hasil yang “bagus di atas kertas”. Itu yang bikin cara kerjanya lebih mirip Data Scientist di industri.",
      },
      {
        question:
          "Skill dari Digica yang paling kepakai waktu proses interview sampai akhirnya keterima di DANA apa?",
        answer:
          "Kemampuan breakdown problem dan jelasin alur berpikir—dari rumusan masalah, pilihan metode, sampai interpretasi hasil. Di interview Data Scientist, yang ditanya bukan cuma “bisa coding atau nggak”, tapi apakah kita paham kenapa suatu model dipilih, bagaimana evaluasinya, dan apa impact-nya ke keputusan bisnis.",
      },
    ],
    tipsQuestion:
      "Ada tips & saran buat teman-teman yang lagi mau mulai belajar data science atau data analytics?",
    tips:
      "Kalau lagi mulai, jangan cuma kejar tools atau algoritma terbaru. Kerjain beberapa project sampai selesai, dokumentasikan proses berpikirnya, dan biasain jelasin hasil ke orang yang nggak technical. Bootcamp kayak Digica ngebantu karena ritmenya mirip kerjaan beneran: ada deadline, ada review, dan ada konteks bisnisnya. Itu yang bikin transisi ke role Data Scientist terasa lebih natural.",
  },
];

export function getTestimonialById(id: string): Testimonial | undefined {
  return TESTIMONIALS.find((t) => t.id === id);
}

export function getAllTestimonialIds(): string[] {
  return TESTIMONIALS.map((t) => t.id);
}
