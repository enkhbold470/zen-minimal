import { SiteConfig } from "@/types"


export const siteConfig: SiteConfig = {
  name: "Zen Online Shop",
  author: "зэнлаптоп",
  description:
    "Зэн Лаптоп Дэлгүүр - Хамгийн сүүлийн үеийн, шилдэг лаптопуудыг нэг дороос.",
  keywords: [
    "Цахим худалдаа",
    "Лаптопууд",
    "Технологи",
    "Онлайн дэлгүүр",
    "Зэн Лаптоп Дэлгүүр",
    "Зэн Лаптоп",
    "Зэн Лаптоп Дэлгүүр",
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
    "Зэн Лаптоп Дэлгүүр нь хамгийн сүүлийн үеийн, шилдэг лаптопуудыг санал болгодог онлайн дэлгүүр юм. Бидний зорилго бол хэрэглэгчдэдээ хамгийн чанартай, найдвартай бүтээгдэхүүнийг хүргэх явдал юм.",
  goal: "Бидний зорилго бол үйлчлүүлэгчдийн хэрэгцээг ойлгож, тэдэнд хамгийн тохирсон лаптопуудыг санал болгох, улмаар Монголын хэрэглэгчдэд технологийн дэвшлийг хүртээмжтэй болгох явдал юм.",
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
