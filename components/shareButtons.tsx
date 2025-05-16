import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share"

import { Laptop } from "@/types/productTypes"

export default function ShareButtons({ product }: { product: Laptop }) {
  return (
    <div className="mt-6">
      <h3 className="mb-2 text-lg font-semibold">Хуваалцах:</h3>
      <div className="flex flex-wrap gap-2">
        <FacebookShareButton
          url={typeof window !== "undefined" ? window.location.href : ""}
          hashtag={
            product.title
              ? `#${product.title.replace(/\s+/g, "")}`
              : "#ZenMinimal"
          }
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={product.title}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LinkedinShareButton
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={product.title}
          summary={product.description}
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <WhatsappShareButton
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={product.title}
          separator=": "
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <TelegramShareButton
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={product.title}
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <EmailShareButton
          url={typeof window !== "undefined" ? window.location.href : ""}
          subject={product.title}
          body={product.description}
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
        <ViberShareButton
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={product.title}
        >
          <ViberIcon size={32} round />
        </ViberShareButton>
      </div>
    </div>
  )
}
