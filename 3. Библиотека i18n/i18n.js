const stringTokens = [
    // ["#price"], " ", 
    // ["@plural", "#day", "tripDays"],
    // " - ",
    // ["@number", "$tripPrice", "USD"], 
    ["@date", 1676561884561],
    // ["@list", "Motocycle", "$item", "#bus"],
    // ["@relativeTime", -5, "hours"]
    // "key", " ", "$var", " ", "#translation"
    // '@date', 'Sun, 19 Feb 2023 09:57:14 GMT'
  ];
  
  const variables = {
    // tripDays: 10,
    // tripPrice: 56789.01,
    // item: "Car",
    // var: 100 

  };
  
  const translations = {
    // "ru-RU": {
    //   price: "Цена",
    //   day: {
    //     zero: "дней",
    //     one: "день",
    //     few: "дня",
    //     many: "дней",
    //     other: "дней"
    //   },
    //   bus: "Автобус", 
    // },
    
      // "ru-RU": { translation: "тест" },
      // "en-US": { translation: "test" },
      // "de-DE": { translation: "prüfen" },
      // "hi-IN": { translation: "परीक्षा" },
      // "ar-AA": { translation: "امتحان" },
  
  };


  
  const locale = "ar-AA";

  function getI18nText({ stringTokens, variables, translations, locale }) {
  
    const values = stringTokens.map((token) => {
      if (typeof token === 'string') {
        return (token[0] == "$" ) ? (Number(variables[token.substring(1)])) :
                (token[0] == "#" ) ? (translations[locale][token.substring(1)]) :
                (token);
      }
  
      const [type, ...args] = token;
  
      switch (type) {
        case '@date': {
          const options = {
            weekday: 'long', 
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZoneName: 'short',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          };
          const [value] = args;
          const date = new Date(value); 
          return new Intl.DateTimeFormat(locale, options).format(date);
        }
  
        case '@number': {
          const [value, currency] = args;

          let num = Number(variables[value.substring(1)]);
          const options = currency
            ? {style: 'currency', currency}
            : {};
          return new Intl.NumberFormat(locale, options).format(num);
        }
  
        case '@plural': {
          const [key, number] = args;

          let type = key.substring(1);
          
          const plurForm = new Intl.PluralRules(locale).select(number);
          return variables[number] + " " + translations[locale][type][plurForm];
        }
  
        case '@list': {
          let items = args.map((item) => variables[item] || item);
          const newItems = [];
          for(let i = 0; i < items.length; i++){
            if(items[i][0] == "$"){
              newItems.push(variables[items[i].substring(1)]);
            }
            else if(items[i][0] == "#"){
              newItems.push(translations[locale][items[i].substring(1)]);
            }
            else{
              newItems.push(items[i])
            }
          };
          return new Intl.ListFormat(locale).format(newItems);
        }
  
        case '@relativeTime': {
          const [value, unit] = args;
          const options = { numeric: 'auto', style: 'short' };
          return new Intl.RelativeTimeFormat(locale, options).format(value, unit);
        }
  
        default: {
          return '';
        }
      }
    });
  
    return values.join(' ');
  }
  
  
  const result = getI18nText({ stringTokens, variables, translations, locale });
  console.log(result); 