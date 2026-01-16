# CAT Academy Research Blog

A clean, academic-styled blog for sharing research updates and findings.

## Getting Started

### Adding Your Logo

1. Place your logo file in this directory
2. Rename it to `logo.png` (or update the `src="logo.png"` reference in the HTML files to match your filename)
3. The logo will appear in the header across all pages
4. Recommended logo dimensions: height of 60-120px for optimal display

### File Structure

```
CAT_Blog/
├── index.html          # Home page with blog posts
├── about.html          # About page for project description
├── contact.html        # Contact form page
├── styles.css          # All styling (clean academic aesthetic)
├── contact.js          # Contact form functionality
└── README.md           # This file
```

### Customizing Content

#### Home Page (index.html)
- Edit the blog post cards to add your research updates
- Each post includes: date, title, excerpt, and "Read more" link
- Add new posts by duplicating the `<article class="post-card">` sections

#### About Page (about.html)
- Replace placeholder text with your project description
- Sections include: Project Overview, Research Focus, Team, Publications
- Customize sections as needed for your research

#### Contact Form (contact.html)
- Form collects: name, email, affiliation, subject, and message
- Currently frontend-only (displays success message locally)
- To make it functional, integrate with a backend service:
  - [Formspree](https://formspree.io/) - Simple form backend
  - [EmailJS](https://www.emailjs.com/) - Email service integration
  - Your own backend endpoint

### Design Features

- Clean, academic aesthetic with serif fonts for body text and sans-serif for headings
- Responsive design works on desktop, tablet, and mobile
- Professional color scheme with blues and grays
- Sticky header navigation
- Hover effects on interactive elements
- Accessible form design with proper labels

### Color Scheme

The design uses a professional academic palette:
- Primary text: Dark gray (#2d3748)
- Headings: Nearly black (#1a202c)
- Accent/links: Professional blue (#2c5282)
- Backgrounds: White and light gray (#f7fafc)

To customize colors, edit the CSS variables in styles.css:

```css
:root {
    --primary-color: #1a1a1a;
    --accent-color: #2c5282;
    /* ... other variables */
}
```

### Opening the Site

Simply open `index.html` in your web browser. All pages are linked together through the navigation menu.

### Publishing

To publish your blog online:

1. **GitHub Pages** (free)
   - Create a GitHub repository
   - Upload all files
   - Enable GitHub Pages in repository settings

2. **Netlify** (free)
   - Drag and drop the folder to netlify.com
   - Get instant hosting with HTTPS

3. **Traditional hosting**
   - Upload files to your web server via FTP
   - Ensure all files maintain the same directory structure

## Next Steps

1. Add your logo file (logo.png)
2. Customize the About page with your project details
3. Replace sample blog posts with your research updates
4. Set up a backend service for the contact form if needed
5. Adjust colors and styling to match your preferences

---

For questions or issues, refer to the contact form on the website.
