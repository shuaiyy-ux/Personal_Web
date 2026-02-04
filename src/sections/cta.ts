import contactsData from '../data/contacts.json';

interface ContactLink {
  id: string;
  type: string;
  label: string;
  value: string;
  required: boolean;
}

export function renderCTA(): string {
  const contacts = contactsData as ContactLink[];
  const requiredContacts = contacts.filter((c) => c.required);

  const linksHtml = requiredContacts
    .map(
      (contact) => `
        <a
          class="cta__contact-link"
          href="${contact.value}"
          ${contact.type !== 'email' ? 'target="_blank" rel="noopener noreferrer"' : ''}
        >
          ${contact.label}
        </a>
      `
    )
    .join('');

  return `
    <section data-section="cta" class="cta" aria-labelledby="cta-heading">
      <h2 id="cta-heading" class="cta__heading">Ready to build something cool together?</h2>
      <button class="cta__button" type="button" aria-expanded="false" aria-controls="cta-contacts">
        LET'S START
      </button>
      <div id="cta-contacts" class="cta__contacts">
        ${linksHtml}
      </div>
    </section>
  `;
}
