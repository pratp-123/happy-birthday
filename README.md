# Happy Birthday Surprise Website

A personalized birthday celebration website featuring an interactive surprise journey with animated visuals, emotional messages, a photo gallery, and a heartfelt finale.

This project is built as a static web experience using HTML, CSS, and JavaScript, with a soft romantic theme, sakura animation, balloons, music, and multi-page storytelling that feels like a digital birthday gift.

## ✨ Features

- Interactive welcome screen with a glowing heart unlock animation
- Birthday cake reveal and candle-blow celebration
- Custom story chapters with romantic and heartfelt messages
- Balloon pop interactions to reveal memories
- Envelope letter reveal with a personal birthday note
- Hall of fame photo carousel with scrolling cards
- Gallery page with lightbox image viewing
- Animated sakura petal background and festive balloons
- Background music support with resume behavior across pages
- Special finale page with warm birthday wishes
- Responsive design for desktop and mobile screens
- AOS scroll animations for smooth transitions

## 📄 Project Pages

The website is divided into multiple story pages:

- `index.html` — Welcome screen with the unlockable birthday surprise
- `letter.html` — Personal birthday message inside an interactive envelope
- `story.html` — Story arc with memory balloons and messages
- `fame.html` — Hall of fame style memory cards
- `gallery.html` — Image gallery with lightbox zooming
- `finale.html` — Final celebration page and birthday wishes

## 🧩 Technologies Used

- HTML5
- CSS3
- JavaScript
- Tailwind CSS
- AOS (Animate On Scroll)
- LightGallery
- Browser audio APIs for interactive sound and music

## 🗂️ Project Structure

```text
happy-birthday/
├── index.html
├── letter.html
├── story.html
├── fame.html
├── gallery.html
├── finale.html
├── style.css
├── script.js
├── README.md
├── img/
│   ├── ...photos and assets
├── background sound/
│   └── ...audio file(s)
├── LICENSE
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── SECURITY.md
└── ...
```

## ▶️ How to Run

Since this is a static website, you can open it directly in a browser:

1. Clone or download the project.
2. Open the folder in your browser or launch a local web server.
3. Navigate to `index.html`.

For example, using a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## 🎨 Customization

You can personalize the project by editing:

- `index.html` for the main welcome message and title
- `letter.html` for the birthday note content
- `story.html` for story and memory descriptions
- `fame.html` and `gallery.html` for photo cards and gallery items
- `style.css` for colors, animations, typography, and layout
- `script.js` for behavior like background music, balloon effects, and page interactions

## 💡 Notes

- The project uses remote CDNs for fonts, stylesheet, and animation libraries.
- Some features require browser permissions for audio playback.
- Images and media are stored in the `img/` folder and audio under `background sound/`.

## 🏁 Purpose

This website is designed as a thoughtful digital birthday gift to celebrate someone special with a memorable, warm, and emotional experience.

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.
