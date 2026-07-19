// Single source of truth for FAQ copy — shown both inline on the Landing
// page's "Frequently Asked Questions" section and on the standalone
// /help page, so the two never drift out of sync with each other.
export const FAQ_ITEMS = [
  {
    question: 'How do I register?',
    answer:
      'Scan the QR code at the event entrance, or use the "Scan QR" option on the home page. This opens your registration wizard directly.',
  },
  {
    question: 'I lost my registration — how do I find it again?',
    answer:
      'Your registration is tied to the browser you registered in. If you still have that browser open, use Pilgrim Login on the home page to reach your Dashboard.',
  },
  {
    question: 'When will my registration be approved?',
    answer:
      'An event administrator reviews each submitted registration. You can check your current status any time on your Dashboard.',
  },
  {
    question: 'What documents do I need to upload?',
    answer:
      'A profile photo and a government ID are typically requested during registration. You can upload, replace, or preview them from the Documents section.',
  },
];

export default FAQ_ITEMS;
