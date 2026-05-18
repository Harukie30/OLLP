"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What should I wear?",
    answer:
      "Come as you are. You'll see everything from casual to business casual — we care that you're here, not what you wear.",
  },
  {
    question: "Is there something for kids?",
    answer:
      "Yes. We offer age-appropriate programs during the main service. Check in at the welcome desk when you arrive and our team will guide you.",
  },
  {
    question: "How long is the service?",
    answer:
      "Most Sunday gatherings last about 75–90 minutes, including worship and teaching. You're welcome to stay afterward for coffee and conversation.",
  },
  {
    question: "Where do I park?",
    answer:
      "Free parking is available in the lot beside the building. Accessible spots are near the main entrance on the north side.",
  },
]

export function FaqSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`item-${index}`}>
          <AccordionTrigger className="text-base">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
