import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "Зэн Онлайн Дэлгүүр",
  author: "zenstore",
  description:
    "Зэн Онлайн Дэлгүүр - Хамгийн сүүлийн үеийн, шилдэг электроникс, гар утас, компьютер, бүтээгдэхүүнүүдийг нэг дороос.",
  keywords: [
    "Цахим худалдаа",
    "Онлайн дэлгүүр",
    "Технологи",
    "Бараа бүтээгдэхүүн",
    "Зэн Онлайн Дэлгүүр",
    "Электроникс",
    "Гэр ахуйн хэрэгсэл",
    "Гоо сайхан",
    "Хувцас",
    "Гар утас",
    "Компьютер",
  ],
  url: {
    base: "https://zenstore.enk.icu",
    author: "https://zenstore.enk.icu",
  },
  links: {
    github: "https://github.com/enkhbold470",
  },
  ogImage: "https://zenstore.enk.icu/og.png",
  about:
    "Зэн Онлайн Дэлгүүр нь хамгийн сүүлийн үеийн, төрөл бүрийн электроникс, гар утас, компьютер, бүтээгдэхүүнүүдийг санал болгодог цахим худалдааны платформ юм. Бидний зорилго бол хэрэглэгчдэдээ хамгийн чанартай, найдвартай бараа бүтээгдэхүүнийг хүргэх явдал юм.",
  goal: "Бидний зорилго бол үйлчлүүлэгчдийн хэрэгцээг ойлгож, тэдэнд хамгийн тохирсон электроникс, гар утас, компьютер, бүтээгдэхүүнүүдийг санал болгох, улмаар Монголын хэрэглэгчдэд дэлхийн технологи, бараа бүтээгдэхүүнийг хүртээмжтэй болгох явдал юм.",
}

export const googleForm = {
  url: process.env.GOOGLE_FORM_URL || "https://docs.google.com/forms/d/e/1FAIpQLSczk1z4BBhDFL1CMDIdAburzTSvgXdryBIu_eQlqUYTp4V6YQ/formResponse",
  fields: {
    name: "entry.987158723",
    laptopChoice: "entry.1889381644",
    phone: "entry.1567818344",
    email: "entry.92388569",
  },
};
