export type ContentSection = {
  id: string;
  page: string;
  label: string;
  description: string;
  body: string;
};

export function getDefaultContentSections(): ContentSection[] {
  return [
    {
      id: "home-hero",
      page: "Home",
      label: "Hero",
      description: "Headline and intro shown at the top of the homepage.",
      body: "<p>Empowering women and youth to build brighter futures across Nigeria.</p>",
    },
    {
      id: "about-story",
      page: "About",
      label: "Our story",
      description: "How IFWYD started and what has changed since.",
      body: "<p>IFWYD was founded to close the gap in education, protection, and economic opportunity for women and youth.</p>",
    },
    {
      id: "about-mission",
      page: "About",
      label: "Mission & vision",
      description: "Shown on the About page under \"Mission & vision\".",
      body: "<p><strong>Mission:</strong> To equip women and youth with the skills, protection, and opportunities they need to thrive.</p>",
    },
    {
      id: "about-leadership",
      page: "About",
      label: "Leadership / team",
      description: "Short bios for leadership shown on the About page.",
      body: "<ul><li>Executive Director</li><li>Program Director</li><li>M&E Lead</li></ul>",
    },
    {
      id: "about-partners",
      page: "About",
      label: "Partners",
      description: "List of partner organizations shown on the About page.",
      body: "<p>Partner logos and names are managed here.</p>",
    },
  ];
}
