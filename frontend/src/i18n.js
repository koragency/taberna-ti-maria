import { createContext, useContext, useState } from "react";

export const translations = {
  pt: {
    nav: {
      menu: "A Ementa",
      legend: "A Lenda",
      chef: "O Cozinheiro",
      contact: "Reservas",
      admin: "Entrar",
    },
    hero: {
      kicker: "Taberna · Lagos · Desde 1954",
      slogan1: "ÓOOOH Ti Maria,",
      slogan2: "tens cá disto?",
      sub: "Petiscos caseiros, vinhos do Algarve e cerveja a tirar lágrimas de tão fresca. Aqui come-se devagar, ri-se alto e sai-se de coração cheio.",
      ctaMenu: "Ver a ementa",
      ctaBook: "Ligar para reservar",
      scroll: "desce, vem cá abaixo",
    },
    marquee: ["Sardinhas na brasa", "Vinho do Algarve", "Cerveja gelada", "Convívio", "Comida caseira", "Desde 1954"],
    menu: {
      kicker: "A Ementa",
      title: "Feito à mão, servido com graça",
      sub: "Quase tudo nasce no Algarve — do mar à horta, do cerro à mesa. O resto, o Sr. Ângelo não deixa entrar.",
      tabs: { petiscos: "Petiscos", vinhos: "Vinhos", cervejas: "Cervejas" },
      note: "Come-se a tradição. Reparte-se o petisco. Brinda-se com medronho. É o conforto da Ti Maria.",
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
    chef: {
      kicker: "O Homem do Fogão",
      title: "Sr. Ângelo",
      stats: [
        { value: "40", label: "anos aos tachos" },
        { value: "20", label: "anos como chefe" },
        { value: "1", label: "segredo que não revela" },
      ],
      text1: "Há quarenta anos que o Sr. Ângelo cozinha. Vinte deles a mandar em cozinhas que outras gentes assinavam. Agora cozinha para si — e para si, que está a ler isto.",
      text2: "A cozinha é pequena, a ambição não. Produtos algarvios, receitas de família e a teimosia de quem quer que cada prato fique na cabeça de quem o prova. Spoiler: fica.",
      quote: "“Não quero que seja uma simples taberna. Eu quero imputar quem nos vista.”",
    },
    contact: {
      kicker: "Reservas & Encontro",
      title: "Mesa posta? Só por telefone.",
      text: "Somos poucos lugares e muita vontade de bem receber. Não temos aplicações nem formulários — temos um telefone, um sorriso e uma cadeira à sua espera.",
      phoneLabel: "Ligar para a taberna",
      addressLabel: "Onde ficamos",
      address: "Tv. Dom Vasco da Gama 11, Lagos, Portugal",
      hoursLabel: "Quando abrimos",
      hours: "Ter–Dom · 12h00–23h00",
      hoursNote: "À segunda a taberna dorme. Até a Maria precisa de descanso.",
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
      chef: "The Chef",
      contact: "Reservations",
      admin: "Sign in",
    },
    hero: {
      kicker: "Tavern · Lagos · Since 1954",
      slogan1: "OOOH Ti Maria,",
      slogan2: "got any of this?",
      sub: "Homemade petiscos, Algarve wines and beer so cold it brings tears to your eyes. Here we eat slowly, laugh loudly and leave with a full heart.",
      ctaMenu: "See the menu",
      ctaBook: "Call to book",
      scroll: "scroll down, come closer",
    },
    marquee: ["Charcoal sardines", "Algarve wine", "Ice-cold beer", "Good company", "Homemade food", "Since 1954"],
    menu: {
      kicker: "The Menu",
      title: "Made by hand, served with a wink",
      sub: "Almost everything is born in the Algarve — from the sea to the garden, from the hills to the table. The rest, Mr. Ângelo simply won't let in.",
      tabs: { petiscos: "Petiscos", vinhos: "Wines", cervejas: "Beers" },
      note: "Tradition is eaten. The petisco is shared. We toast with medronho. That is the comfort of Ti Maria.",
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
    chef: {
      kicker: "The Man at the Stove",
      title: "Mr. Ângelo",
      stats: [
        { value: "40", label: "years at the stove" },
        { value: "20", label: "years as head chef" },
        { value: "1", label: "secret he won't reveal" },
      ],
      text1: "Mr. Ângelo has been cooking for forty years. Twenty of them running kitchens that other people signed. Now he cooks for himself — and for you, reading this.",
      text2: "The kitchen is small, the ambition is not. Algarve produce, family recipes and the stubbornness of a man who wants every dish to stay in the memory of whoever tastes it. Spoiler: it does.",
      quote: "“I don't want this to be just a tavern. I want to impact those who visit us.”",
    },
    contact: {
      kicker: "Reservations & Finding Us",
      title: "A set table? Only by phone.",
      text: "We are few seats and a great will to welcome well. No apps, no forms — just a phone, a smile and a chair waiting for you.",
      phoneLabel: "Call the tavern",
      addressLabel: "Where we are",
      address: "Tv. Dom Vasco da Gama 11, Lagos, Portugal",
      hoursLabel: "When we open",
      hours: "Tue–Sun · 12:00–23:00",
      hoursNote: "On Mondays the tavern sleeps. Even Maria needs rest.",
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
