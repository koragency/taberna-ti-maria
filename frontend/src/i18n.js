import { createContext, useContext, useState } from "react";

export const translations = {
  pt: {
    nav: {
      menu: "A Ementa",
      legend: "A Lenda",
      chef: "A Cozinha",
      contact: "Reservas",
      admin: "Entrar",
      openNow: "Aberto agora",
      closed: "Fechado",
    },
    hero: {
      kicker: "Taberna · Lagos · Desde 1954",
      slogan1: "ÓOOOH Ti Maria,",
      slogan2: "tens cá disto?",
      sub: "Petiscos caseiros, vinhos do Algarve e cerveja a tirar lágrimas de tão fresca. Aqui come-se devagar, ri-se alto e sai-se de coração cheio.",
      ctaMenu: "Ver a ementa",
      ctaBook: "Reservar no WhatsApp",
      scroll: "desce, vem cá abaixo",
    },
    marquee: ["Sardinhas na brasa", "Vinho do Algarve", "Cerveja gelada", "Convívio", "Comida caseira", "Desde 1954"],
    menu: {
      kicker: "A Ementa",
      title: "Feito à mão, servido com graça",
      sub: "Quase tudo nasce no Algarve — do mar à horta, do cerro à mesa. O resto, o Sr. Ângelo não deixa entrar.",
      tabs: { "pequeno-almoco": "Pequeno Almoço", menu: "Menu", almoco: "Almoço", petiscos: "Petiscos", fritos: "Fritos", especialidades: "Especialidades", frios: "Frios", sandes: "Sandes" },
      note: "Come-se a tradição. Reparte-se o petisco. Brinda-se com medronho. É o conforto da Ti Maria.",
      photoQuote: "Fresco da ria, direto para a mesa.",
      photoBy: "— Ti Maria",
      empty: "A arca está vazia... volte já já.",
    },
    legend: {
      kicker: "A Nossa Inspiração",
      title: "A Lenda da Maria de Lagos",
      chapters: [
        {
          n: "I",
          title: "A rapariga que conhecia o mar",
          text: "Conta a lenda que Maria, filha de pescadores de Lagos, lia o mar como quem lê uma carta de amor. Sabia onde as sardinhas dormiam, onde as conquilhas se escondiam, e quando a maré trazia presentes.",
        },
        {
          n: "II",
          title: "O segredo guardado no tempero",
          text: "Dizem que Maria temperava tudo com sal da ria, limão do Barrocal e uma mão cheia de graça. Quem provasse os seus petiscos, jurava a pés juntos que nunca mais queria comer noutro lugar.",
        },
        {
          n: "III",
          title: "De Lagos para a nossa mesa",
          text: "É dela que herdamos a mania de bem receber: mesa pequena, copo cheio e conversa comprida. A Maria não cá está, mas em cada sardinha assada que sai da nossa brasa, está um bocadinho dela.",
        },
      ],
    },
    kitchen: {
      kicker: "A Nossa Cozinha",
      title: "Do fogão diretamente para a mesa",
      sub: "Tachos ao lume, brasa acesa e o Algarve inteiro no prato. Espreite o que se passa do outro lado do balcão.",
      caption: "Feito à mão, todos os dias.",
    },
    contact: {
      kicker: "Reservas & Encontro",
      title: "Mesa posta? Só por telefone.",
      text: "Somos poucos lugares e muita vontade de bem receber. Não temos aplicações nem formulários — temos um telefone, um sorriso e uma cadeira à sua espera.",
      phoneLabel: "Falar no WhatsApp",
      whatsappMessage: "Olá! Gostava de reservar uma mesa na Taberna Ti Maria.",
      addressLabel: "Onde ficamos",
      address: "Tv. Dom Vasco da Gama 9, Lagos, Portugal",
      hoursLabel: "Quando abrimos",
      hours: "Ter–Sáb · 09h00–21h00",
      hoursNote: "Domingo · 09h00–17h00 · Segunda: fechado — a taberna dorme.",
      maps: "Ver no mapa",
    },
    footer: {
      slogan: "ÓOOOH Ti Maria, tens cá disto?",
      rights: "Taberna Ti Maria — Lagos, Algarve",
      made: "Feito com sal, limão e boa disposição",
    },
  },
  en: {
    nav: {
      menu: "The Menu",
      legend: "The Legend",
      chef: "The Kitchen",
      contact: "Reservations",
      admin: "Sign in",
      openNow: "Open now",
      closed: "Closed",
    },
    hero: {
      kicker: "Tavern · Lagos · Since 1954",
      slogan1: "OOOH Ti Maria,",
      slogan2: "got any of this?",
      sub: "Homemade petiscos, Algarve wines and beer so cold it brings tears to your eyes. Here we eat slowly, laugh loudly and leave with a full heart.",
      ctaMenu: "See the menu",
      ctaBook: "Book on WhatsApp",
      scroll: "scroll down, come closer",
    },
    marquee: ["Charcoal sardines", "Algarve wine", "Ice-cold beer", "Good company", "Homemade food", "Since 1954"],
    menu: {
      kicker: "The Menu",
      title: "Made by hand, served with a wink",
      sub: "Almost everything is born in the Algarve — from the sea to the garden, from the hills to the table. The rest, Mr. Ângelo simply won't let in.",
      tabs: { "pequeno-almoco": "Breakfast", menu: "Menu", almoco: "Lunch", petiscos: "Snacks", fritos: "Fried", especialidades: "Specialities", frios: "Cold Dishes", sandes: "Sandwiches" },
      note: "Tradition is eaten. The petisco is shared. We toast with medronho. That is the comfort of Ti Maria.",
      photoQuote: "Fresh from the ria, straight to the table.",
      photoBy: "— Ti Maria",
      empty: "The pantry is empty... come back in a moment.",
    },
    legend: {
      kicker: "Our Inspiration",
      title: "The Legend of Maria of Lagos",
      chapters: [
        {
          n: "I",
          title: "The girl who knew the sea",
          text: "Legend says Maria, a fisherman's daughter from Lagos, read the sea like a love letter. She knew where the sardines slept, where the clams hid, and when the tide brought gifts.",
        },
        {
          n: "II",
          title: "The secret kept in the seasoning",
          text: "They say Maria seasoned everything with salt from the ria, Barrocal lemon and a handful of wit. Whoever tasted her petiscos swore they'd never want to eat anywhere else again.",
        },
        {
          n: "III",
          title: "From Lagos to our table",
          text: "From her we inherited the art of hosting: a small table, a full glass and a long conversation. Maria is gone, but in every grilled sardine that leaves our coals, a little bit of her remains.",
        },
      ],
    },
    kitchen: {
      kicker: "Our Kitchen",
      title: "From the stove straight to the table",
      sub: "Pots on the fire, coals glowing and the whole Algarve on the plate. Peek at what happens behind the counter.",
      caption: "Handmade, every single day.",
    },
    contact: {
      kicker: "Reservations & Finding Us",
      title: "A set table? Only by phone.",
      text: "We are few seats and a great will to welcome well. No apps, no forms — just a phone, a smile and a chair waiting for you.",
      phoneLabel: "Chat on WhatsApp",
      whatsappMessage: "Hello! I'd like to book a table at Taberna Ti Maria.",
      addressLabel: "Where we are",
      address: "Tv. Dom Vasco da Gama 9, Lagos, Portugal",
      hoursLabel: "When we open",
      hours: "Tue–Sat · 9:00–21:00",
      hoursNote: "Sunday · 9:00–17:00 · Monday: closed — the tavern sleeps.",
      maps: "Open in maps",
    },
    footer: {
      slogan: "OOOH Ti Maria, got any of this?",
      rights: "Taberna Ti Maria — Lagos, Algarve",
      made: "Made with salt, lemon and good cheer",
    },
  },
};

const LangContext = createContext(null);

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState("pt");
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
