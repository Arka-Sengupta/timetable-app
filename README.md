## File Tree


```
├── 📁 app
│   ├── 📁 (tabs)
│   │   ├── 📄 _layout.tsx
│   │   ├── 📄 index.tsx
│   │   └── 📄 mess.tsx
│   ├── 📁 assets
│   │   ├── 📁 images
│   │   │   ├── 🖼️ favicon.png
│   │   │   ├── 🖼️ icon.png
│   │   │   ├── 🖼️ logo.png
│   │   │   ├── 🖼️ partial-react-logo.png
│   │   │   ├── 🖼️ react-logo.png
│   │   │   ├── 🖼️ react-logo@2x.png
│   │   │   ├── 🖼️ react-logo@3x.png
│   │   │   ├── 🖼️ splash-icon.png
│   │   │   └── 🖼️ splash.png
│   │   ├── 📄 data.csv
│   │   └── 📄 timetable.csv
│   ├── 📄 _layout.tsx
│   └── 📄 calendar.tsx
├── 📁 components
│   └── 📄 ClassNoteItem.tsx
├── 📁 constants
│   └── 📄 theme.ts
├── 📁 hooks
│   ├── 📄 useMessMenu.js
│   ├── 📄 useNotes.js
│   └── 📄 useTimetable.js
├── 📁 utils
│   └── 📄 getCurrentClass.js
├── ⚙️ .gitignore
├── 📝 README.md
├── ⚙️ app.json
├── ⚙️ eas.json
├── 📄 eslint.config.js
├── 📄 index.js
├── 📄 metro.config.js
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── ⚙️ tsconfig.json
```
# Note: App is hardcoded for Arka Sengupta's data using timetable.csv and data.csv(for mess data), follow the steps if you want to use it for your own purpose

1. in your terminal run `git clone https://github.com/Arka-Sengupta/timetable-app`
2. `cd timetable-app`
3. `npm install`
4. download expo go in your phone or android emulator in your pc
5. convert your timetable to csv format and save it as `timetable.csv` in the `app/assets` folder
6. convert your mess data to csv format and save it as `data.csv` in the `app/assets` folder
7. Follow the format of my timetable.csv and data.csv to create your own timetable.csv and data.csv
8. run `npx expo start` in your terminal
9. scan the qr code in your phone or emulator
10. Enjoy the app

If you want to just see how the app is working so you can just install the provided apk file the releases section, it has my data

If you also want to make an .apk/.aab for your build, contact me at [my email](arka.sengupta.06@gmail.com)